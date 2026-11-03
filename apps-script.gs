/**
 * @OnlyCurrentDoc
 * Begrenser scriptet til bare dette regnearket. Uten denne linjen ber Google
 * om tilgang til ALLE regnearkene dine.
 */

/**
 * Bryllupsside Sofie & Sigve – mottak av påmeldinger.
 *
 * Oppsett (én gang):
 *   1. Lim inn hele denne filen i Utvidelser → Apps Script og lagre.
 *   2. Velg funksjonen «oppsett» i nedtrekkslisten øverst og trykk Kjør.
 *      Den lager fanene Svar, Oversikt og Innstillinger.
 *   3. Distribuer → Ny distribusjon → Nettapp. Kjør som: meg. Tilgang: Alle.
 *
 * Koden fra invitasjonen ligger i fanen «Innstillinger», celle B1.
 * Den kan endres der uten å distribuere scriptet på nytt.
 */

const KOLONNER = [
  "Tidspunkt", "Påmeldings-ID", "Påmeldt av", "E-post", "Telefon",
  "Navn", "Kommer", "Torsdag", "Fredag", "Lørdag", "Søndag brunsj",
  "Overnatting lør–søn", "Allergier / mathensyn"
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const bok = SpreadsheetApp.getActive();

    // Riktig kode?
    const kode = bok.getSheetByName("Innstillinger").getRange("B1").getDisplayValue().trim();
    if (tekst(d.kode, 50) !== kode) return svar({ ok: false, feil: "kode" });

    // Robotfelle
    if (d.nettside) return svar({ ok: true });

    const navn = tekst(d.navn, 120);
    const epost = tekst(d.epost, 200);
    if (!navn || !/^\S+@\S+\.\S+$/.test(epost)) return svar({ ok: false, feil: "felt" });

    const personer = Array.isArray(d.personer) ? d.personer.slice(0, 10) : [];
    if (!personer.length || personer.some(p => !tekst(p.navn, 120))) return svar({ ok: false, feil: "personer" });

    const kommer = d.kommer !== false;
    const ja = v => (kommer && v ? "Ja" : "");
    const id = Utilities.getUuid().slice(0, 8);
    const tid = new Date();

    const rader = personer.map(p => [
      tid, id, navn, epost, tekst(d.telefon, 40),
      tekst(p.navn, 120), kommer ? "Ja" : "Nei",
      ja(p.torsdag), ja(p.fredag), kommer ? "Ja" : "", ja(p.brunsj), ja(p.overnatting),
      kommer ? tekst(p.allergier, 500) : ""
    ].map(trygg));

    const ark = bok.getSheetByName("Svar");
    ark.getRange(ark.getLastRow() + 1, 1, rader.length, KOLONNER.length).setValues(rader);
    return svar({ ok: true });
  } catch (err) {
    return svar({ ok: false, feil: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function tekst(v, maks) {
  return String(v == null ? "" : v).trim().slice(0, maks);
}

// Hindrer at tekst fra skjemaet tolkes som formler i regnearket
function trygg(v) {
  return typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function svar(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Kjøres én gang for å lage fanene. Trygg å kjøre på nytt. */
function oppsett() {
  const bok = SpreadsheetApp.getActive();

  const svarArk = bok.getSheetByName("Svar") || bok.insertSheet("Svar");
  svarArk.getRange(1, 1, 1, KOLONNER.length).setValues([KOLONNER]).setFontWeight("bold");
  svarArk.setFrozenRows(1);

  const inn = bok.getSheetByName("Innstillinger") || bok.insertSheet("Innstillinger");
  if (!inn.getRange("B1").getValue()) inn.getRange("A1:B1").setValues([["Kode", "123"]]);

  const o = bok.getSheetByName("Oversikt") || bok.insertSheet("Oversikt", 0);
  o.clear();
  const tall = [
    ["Kommer", '=COUNTIF(Svar!G2:G,"Ja")'],
    ["Kan ikke komme", '=COUNTIF(Svar!G2:G,"Nei")'],
    ["Torsdag", '=COUNTIF(Svar!H2:H,"Ja")'],
    ["Fredag", '=COUNTIF(Svar!I2:I,"Ja")'],
    ["Lørdag", '=COUNTIF(Svar!J2:J,"Ja")'],
    ["Søndag brunsj", '=COUNTIF(Svar!K2:K,"Ja")'],
    ["Overnatting lør–søn", '=COUNTIF(Svar!L2:L,"Ja")'],
    ["Antall påmeldinger", '=COUNTUNIQUE(Svar!B2:B)']
  ];
  o.getRange("A1:B1").setValues([["Oversikt", "Antall"]]).setFontWeight("bold");
  tall.forEach(([navn, f], i) => {
    o.getRange(i + 2, 1).setValue(navn);
    o.getRange(i + 2, 2).setFormula(f);
  });
  o.getRange("A12:B12").setValues([["Allergier / mathensyn", ""]]).setFontWeight("bold");
  o.getRange("A13").setFormula('=IFERROR(FILTER({Svar!F2:F, Svar!M2:M}, Svar!M2:M<>""), "Ingen ennå")');
  o.setColumnWidth(1, 220);
  o.setColumnWidth(2, 260);

  const standard = bok.getSheetByName("Ark1") || bok.getSheetByName("Sheet1");
  if (standard && bok.getSheets().length > 1) bok.deleteSheet(standard);
}
