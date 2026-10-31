-- ============================================================
-- Bryllupsside Sofie & Sigve – databaseoppsett for Supabase
-- Kjøres én gang i Supabase: SQL Editor → New query → Run
-- ============================================================

-- Én påmelding = én innsending fra skjemaet (kontaktpersonen)
create table if not exists public.svar (
  id         uuid primary key default gen_random_uuid(),
  opprettet  timestamptz not null default now(),
  navn       text not null,
  epost      text not null,
  telefon    text
);

-- Alle personene i påmeldingen, inkludert kontaktpersonen selv (nr = 1)
create table if not exists public.personer (
  id           uuid primary key default gen_random_uuid(),
  svar_id      uuid not null references public.svar(id) on delete cascade,
  nr           int not null,
  navn         text not null,
  allergier    text,
  overnatting  boolean not null default false,   -- Krogerup lørdag–søndag
  brunsj       boolean not null default false    -- søndag 18. juli
);
create index if not exists personer_svar_id_idx on public.personer(svar_id);

-- Hvem som har tilgang til adminsiden
create table if not exists public.admins (
  epost text primary key
);

-- Eksplisitte rettigheter (prosjektet eksponerer ikke nye tabeller automatisk).
-- Gjester får ingen tabelltilgang, bare funksjonen send_svar lenger ned.
grant usage on schema public to anon, authenticated;
grant select, delete on public.svar     to authenticated;
grant select         on public.personer to authenticated;

-- Slå på radnivåsikkerhet. Uten policyer under kan ingen lese noe.
alter table public.svar     enable row level security;
alter table public.personer enable row level security;
alter table public.admins   enable row level security;

-- Er innlogget bruker admin?
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins
    where lower(epost) = lower(auth.jwt() ->> 'email')
  );
$$;

-- Admin kan lese og slette
drop policy if exists "admin leser svar" on public.svar;
create policy "admin leser svar" on public.svar
  for select to authenticated using (public.is_admin());

drop policy if exists "admin sletter svar" on public.svar;
create policy "admin sletter svar" on public.svar
  for delete to authenticated using (public.is_admin());

drop policy if exists "admin leser personer" on public.personer;
create policy "admin leser personer" on public.personer
  for select to authenticated using (public.is_admin());

-- Gjestene sender inn via denne funksjonen (ingen innlogging).
-- Alt lagres samlet, eller ingenting om noe er feil.
create or replace function public.send_svar(p jsonb)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  ny_id  uuid;
  pers   jsonb;
  antall int;
begin
  if jsonb_typeof(p -> 'personer') <> 'array' then
    raise exception 'Mangler personer';
  end if;

  antall := jsonb_array_length(p -> 'personer');
  if antall < 1 or antall > 10 then
    raise exception 'Ugyldig antall personer';
  end if;

  if coalesce(trim(p ->> 'navn'), '') = '' or coalesce(trim(p ->> 'epost'), '') = '' then
    raise exception 'Mangler navn eller e-post';
  end if;

  insert into public.svar (navn, epost, telefon)
  values (
    left(trim(p ->> 'navn'), 120),
    left(trim(p ->> 'epost'), 200),
    left(nullif(trim(p ->> 'telefon'), ''), 40)
  )
  returning id into ny_id;

  for pers in select value from jsonb_array_elements(p -> 'personer') with ordinality as t(value, ord) order by ord loop
    if coalesce(trim(pers ->> 'navn'), '') = '' then
      raise exception 'Alle personer må ha navn';
    end if;
  end loop;

  insert into public.personer (svar_id, nr, navn, allergier, overnatting, brunsj)
  select ny_id, ord::int, left(trim(value ->> 'navn'), 120),
         left(nullif(trim(value ->> 'allergier'), ''), 500),
         coalesce((value ->> 'overnatting')::boolean, false),
         coalesce((value ->> 'brunsj')::boolean, false)
  from jsonb_array_elements(p -> 'personer') with ordinality as t(value, ord);

  return ny_id;
end;
$$;

revoke all on function public.send_svar(jsonb) from public;
grant execute on function public.send_svar(jsonb) to anon, authenticated;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Holder gratisprosjektet aktivt (kalles av GitHub Actions, se .github/workflows/ping.yml)
create or replace function public.ping()
returns int
language plpgsql security definer
set search_path = public
as $$
begin
  perform 1 from public.svar limit 1;
  return 1;
end;
$$;
revoke all on function public.ping() from public;
grant execute on function public.ping() to anon;

-- ============================================================
-- Legg inn admins (bytt til ekte e-postadresser og kjør)
-- ============================================================
-- insert into public.admins (epost) values
--   ('mats@eksempel.no'),
--   ('anders@eksempel.no');
