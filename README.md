# Bryllupsside – Sofie & Sigve (versjon 2)

Statisk nettside på GitHub Pages. Gjestene går inn med en felles kode, og påmeldingene lagres i et Google Regneark.

| Fil | Hva |
|---|---|
| `index.html` | Hele siden. Alt innhold (tekster, program, overnatting, kart) ligger i `C`-objektet øverst. |
| `style.css` | Utseende. Fargene ligger øverst. |
| `config.js` | Koden, lenken til regnearket, maks antall per påmelding og bryteren `paameldingApen`. |
| `apps-script.gs` | Limes inn i Google Apps Script. Tar imot påmeldinger og lager fanene i regnearket. |
| `media/` | `hav.jpg` / `hav.mp4` (toppbanner), `surf.jpg`, `krogerup.jpg`, `deling.jpg` (forhåndsvisning ved deling). |
| `fonts/` | `HAD-Script.woff2` (håndskriften). Reservefont: Caveat. |

---

## 1. Regnearket (ca. 15 min)

1. Lag et nytt Google Regneark, for eksempel «Bryllup – påmeldinger».
2. **Utvidelser → Apps Script**. Slett det som står der, lim inn hele `apps-script.gs` og lagre (Ctrl+S).
3. Velg **oppsett** i nedtrekkslisten øverst og trykk **Kjør**. Godkjenn tilgang når Google spør (se punkt 5). Regnearket får da fanene **Oversikt**, **Svar** og **Innstillinger**.
4. **Distribuer → Ny distribusjon** → tannhjulet → **Nettapp**:
   - *Kjør som:* Meg
   - *Hvem har tilgang:* Alle
   - Trykk **Distribuer** og kopier **nettapp-URL-en** (slutter på `/exec`).
5. Google advarer om at appen ikke er verifisert. Det er normalt for egne script: **Avansert → Gå til … (ikke trygg) → Tillat**.
6. Lim inn URL-en i `config.js` under `scriptUrl`.

**Koden** fra invitasjonen ligger i fanen **Innstillinger**, celle B1, og i `config.js`. Endres den, må den endres begge steder.

**Endrer du scriptet senere:** Distribuer → Administrer distribusjoner → blyanten → Versjon: *Ny versjon* → Distribuer. URL-en forblir den samme.

## 2. Publiser

Last opp alle filene til GitHub-repoet (**Add file → Upload files**). Siden ligger på
`https://matsblar01.github.io/Sigves-brullyp/`

Slett disse fra repoet hvis de ligger der fra versjon 1: `admin.html`, `schema.sql`, `.github/`.

## 3. Test

- [ ] Feil kode gir feilmelding, riktig kode slipper inn (og huskes ved neste besøk)
- [ ] Skrolling låser seg på hvert avsnitt, deretter fri skrolling
- [ ] «Vis bare lørdag» skjuler torsdag og fredag
- [ ] Påmelding: én person, flere personer, og «Kan dessverre ikke»
- [ ] Svarene havner i fanen **Svar**, og **Oversikt** teller riktig
- [ ] «Legg i kalenderen» fungerer på iPhone og Android
- [ ] Slett testradene i **Svar** før lansering

## Deling og tilgang

- Del regnearket med Sigve, Sofie og Anders (**Del**, øverst til høyre).
- Ikke endre kolonnene i **Svar**. Vil dere jobbe videre med listen, for eksempel bordplassering, lag en egen fane som henter data fra **Svar**.
- Lenke som slipper gjester rett inn: `https://matsblar01.github.io/Sigves-brullyp/?kode=123`

## Oppdatere innhold

Endre `C`-objektet i `index.html`, eller be Claude gjøre det, og last opp filen på nytt.

## Etter bryllupet

Slett regnearket, eller i det minste kolonnen med allergier. Allergiopplysninger skal ikke ligge lagret lenger enn nødvendig.
