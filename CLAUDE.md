# Overlevering – bryllupsside Sofie & Sigve

Kontekst for den som jobber videre med siden, menneske eller Claude. Les dette før du endrer noe.

## Arkitektur
- **Statisk side** på GitHub Pages: `https://matsblar01.github.io/Sigves-brullyp/`. Ingen byggesteg, bare HTML, CSS og JS.
- **Påmeldinger** sendes til et **Google Apps Script** (`apps-script.gs`), som skriver til et Google Regneark. Regnearket har fanene **Oversikt**, **Svar** og **Innstillinger**.
- **Kode-port:** én felles kode fra invitasjonskortet. Den ligger i `config.js` **og** i regnearket (Innstillinger!B1). Endres den, må den endres begge steder.

## Hvor ting ligger
- **Alt innhold** (intro, program per dag, overnatting, reise, kart, svarfrist) ligger i `C`-objektet øverst i `index.html`. Endre tekst der, ikke i HTML-en lenger ned.
- **Farger og fonter:** `:root` øverst i `style.css`.
- **Innstillinger:** `config.js` (kode, `scriptUrl`, `maksPersoner`, `paameldingApen`).
- **Bilder:** `media/`. Videoen skal ligge i `media/hav.mp4`, under ca. 8 MB, og spilles uten lyd.
- **Håndskriftfont:** `fonts/HAD-Script.woff2`. Reservefont er Caveat.

## Beslutninger som er tatt (ikke endre uten å avklare)
- Fullskjermsvideo med sentrert tekst og kode, deretter vanlig skrolling.
- Sideoppbygning (designerens skisser): Svar → Om oss (tekstboks over bilde) → Bryllupsdagen (tekst, bilde, tidslinje lør–søn) → Dagene før (tor/fre) → Praktisk info → bilde → Kart. Sidemeny til venstre på store skjermer, bygges fra `data-toc`.
- Bryteren «Skjul dagene før» skjuler alt med klassen `torfre`, og slås på automatisk hvis ingen i en påmelding kommer tor/fre.
- Påmelding: Ja eller «Kan dessverre ikke». Dagene velges **per person** (lørdag alltid med). Overnatting lør–søn på Krogerup velges per person. Overnatting tor/fre ordnes selv. Nye personer arver valgene fra første person.
- Kalender: Google Kalender (én lenke per dag) eller Apple/Outlook (.ics).
- Designet følger designerens skisser: Fraunces (serif), versaloverskrifter med kort strek under, sandfarget side, lyseblå knapper, håndskrift bare i toppen.

## Regler
- **Ikke endre kolonnerekkefølgen** i `apps-script.gs` (`KOLONNER`) uten å oppdatere formlene i `oppsett()` og fanen Oversikt.
- **Endringer i `apps-script.gs`** må lagres i Apps Script og publiseres som **ny versjon**: Implementer → Administrer implementeringer → blyant → Ny versjon. URL-en forblir den samme.
- **Test alltid i inkognitovindu.** GitHub Pages lar nettlesere mellomlagre filer i opptil 10 minutter.
- Ikke legg hemmeligheter i repoet. Det er offentlig.

## Åpne punkter
- [ ] Video (`media/hav.mp4`) og håndskriftfont
- [ ] Pris og betaling for overnatting på Krogerup (`C.overnatting.pris` og tekst)
- [ ] Innhold for fredag, og tid og sted for torsdag og vielsen
- [ ] Tips til overnatting tor/fre
- [ ] Kart: koordinater for vielsen og eventuelt rute (`C.kart`)
- [ ] Endelig kode før kortene trykkes (config.js og Innstillinger!B1)
- [ ] Slett testrader i Svar før publisering
