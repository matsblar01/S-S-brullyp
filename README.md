# Bryllupsside – Sofie & Sigve

Statisk nettside på GitHub Pages med påmelding og adminside. Påmeldingene lagres i Supabase.

| Fil | Hva |
|---|---|
| `index.html` | Gjestesiden. Alt innhold ligger i `C`-objektet øverst. |
| `admin.html` | Oversikt over påmeldinger, allergier, overnatting og brunsj. CSV-eksport. Krever innlogging. |
| `style.css` | Utseende. Fargene ligger øverst. |
| `config.js` | Supabase-nøkler, maks antall per påmelding og bryteren `paameldingApen`. |
| `schema.sql` | Databaseoppsett. Kjøres én gang. |
| `media/` | `hav.jpg` og `hav.mp4` (toppbanner), `surf.jpg`, `krogerup.jpg`. |
| `fonts/` | `HAD-Script.woff2` (håndskriften). Reservefont: Caveat. |
| `.github/workflows/ping.yml` | Holder Supabase aktiv. Slås på før lansering. |

---

## Fase 1: Utvikling (nå)

### 1. Supabase (ca. 15 min)
1. supabase.com → logg inn med GitHub → **New project**. Velg region **Central EU (Frankfurt)** eller **North EU (Stockholm)**, og lagre databasepassordet.
2. **SQL Editor → New query**: lim inn hele `schema.sql` og trykk **Run**.
3. Kjør dette med deres egne adresser:
   ```sql
   insert into public.admins (epost) values ('mats@...'), ('anders@...');
   ```
4. **Authentication → Users → Add user → Create new user** for hver av dere, med **Auto Confirm User** på.
5. **Project Settings → API**: kopier *Project URL* og *anon/publishable key* inn i `config.js`. Bruk aldri *service_role/secret key*.

### 2. GitHub Pages (ca. 10 min)
1. Lag et **offentlig** repo på GitHub, for eksempel `bryllup`, og push hele mappen.
2. **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
3. Etter et minutt ligger siden på `https://<brukernavn>.github.io/bryllup/`.
4. I Supabase: **Authentication → URL Configuration**:
   - *Site URL*: adressen fra punkt 3.
   - *Redirect URLs*: legg til `https://<brukernavn>.github.io/bryllup/admin.html`.

### 3. Jobbe lokalt
```bash
python3 -m http.server 8000
```
Åpne `http://localhost:8000`. Push til GitHub bare når Sofie og Sigve skal se en ny versjon.

Legg også til `http://localhost:8000/admin.html` under *Redirect URLs* hvis du vil teste adminsiden lokalt.

Supabase pauser prosjektet etter en uke uten aktivitet. Under utvikling er det greit: trykk **Resume project** når du trenger det igjen.

---

## Fase 2: Venteperioden (måneder)

- Vil dere at siden skal være ute uten påmelding: sett `paameldingApen: false` i `config.js`. Knappen viser da «Påmelding åpner snart».
- Supabase blir pauset. Et pauset prosjekt kan startes igjen i 90 dager. Har det gått lengre tid, oppretter du et nytt prosjekt, kjører `schema.sql` på nytt og oppdaterer `config.js`. Du mister bare testdata.

---

## Fase 3: Lansering (2–3 uker før invitasjonene)

1. Start Supabase igjen, eller opprett det på nytt.
2. Slå på ping-jobben:
   - I GitHub: **Settings → Secrets and variables → Actions** → legg inn `SUPABASE_URL` og `SUPABASE_ANON_KEY`.
   - **Actions → Hold Supabase våken → Run workflow**. Sjekk at den blir grønn.
3. Sett `paameldingApen: true`.
4. Test:
   - [ ] iPhone (Safari) og Android (Chrome): video, skjema, kart
   - [ ] Påmelding for én person og for flere
   - [ ] Admininnlogging for både deg og Anders
   - [ ] CSV-eksport åpner riktig i Excel
   - [ ] Slett alle testpåmeldinger
5. Valgfritt eget domene: **Settings → Pages → Custom domain**. Husk å oppdatere *Site URL* og *Redirect URLs* i Supabase.

### Mens påmeldingen er åpen
- Sjekk av og til under **Actions** at ping-jobben går. GitHub kan slå av planlagte jobber i repoer uten aktivitet, og en liten commit innimellom holder den i gang.
- Ta CSV-eksport jevnlig, og en ekstra etter svarfristen 17. februar.
- Får ikke Anders innloggingslenken: inviter ham som medlem i Supabase-organisasjonen.

### Etter bryllupet
Eksporter det dere trenger, og slett Supabase-prosjektet. Allergiopplysninger skal ikke ligge lagret lenger enn nødvendig.

---

## Oppdatere innhold
Endre `C`-objektet i `index.html`, eller be Claude gjøre det, og push. Siden oppdateres etter et minutt.
