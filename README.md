# leitweg-id

Leitweg-ID prüfen und Prüfziffer berechnen, nach der offiziellen **Format-Spezifikation Version 2.0.2** der KoSIT (28.07.2021). Ohne Abhängigkeiten, läuft im Browser und in Node.js.

Die Leitweg-ID ist die Adresse von Behörden für E-Rechnungen. In der XRechnung steht sie im Feld Käuferreferenz (BT-10).

**Online ausprobieren:** [erechnungswandler.de/leitweg-id](https://erechnungswandler.de/leitweg-id), dort auch der Aufbau und die Rechnung Schritt für Schritt erklärt. Ganze E-Rechnungen (XRechnung, ZUGFeRD) prüfen: [erechnungswandler.de](https://erechnungswandler.de).

## Installation

```sh
npm install github:belahamburg-sudo/leitweg-id
```

## Verwendung

```js
import { pruefeLeitwegId, pruefziffer } from "@erechnungswandler/leitweg-id";

pruefeLeitwegId("991-33333TEST-33").gueltig;
// true

const r = pruefeLeitwegId("04011000-1234512345-07");
r.gueltig;              // false
r.richtigePruefziffer;  // "06"
r.fehler;               // ["Die Prüfziffer 07 stimmt nicht. Richtig wäre 06. ..."]
r.land;                 // "Bremen"

pruefziffer("04011000", "1234512345");
// "06"
```

`pruefeLeitwegId` liefert:

| Feld | Bedeutung |
|---|---|
| `gueltig` | `true`, wenn Aufbau und Prüfziffer stimmen |
| `fehler` | Fehlermeldungen auf Deutsch |
| `grob`, `fein` | Grob- und Feinadressierung |
| `angegebenePruefziffer`, `richtigePruefziffer` | angegebene und berechnete Prüfziffer |
| `land` | Bundesland oder „Bund“ (Kennzahl 01 bis 16, 99) |
| `teile` | Land, Regierungsbezirk, Landkreis, Gemeinde(verband) |

## Regeln

- **Grobadressierung:** nur Ziffern, 2, 3, 5, 8, 9 oder 12 Stellen (Land 2, Regierungsbezirk 1, Landkreis 2, Gemeinde 3, 4 oder 7). Kennzahl 01 bis 16 oder 99.
- **Feinadressierung:** optional, bis 30 Zeichen A bis Z und 0 bis 9, Groß- und Kleinschreibung egal.
- **Prüfziffer:** zwei Ziffern nach ISO/IEC 7064 Modulo 97-10, berechnet über Grob- und Feinadressierung ohne Bindestriche, Buchstaben A = 10 bis Z = 35.
- **Gesamtlänge:** 5 bis 46 Zeichen.

## English

Validates German **Leitweg-IDs** (routing IDs for e-invoices to public authorities, XRechnung field BT-10) according to the official format specification 2.0.2, including the ISO/IEC 7064 MOD 97-10 check digit. Error messages are in German.

## Lizenz

MIT. Bereitgestellt von [E-Rechnungswandler](https://erechnungswandler.de), dem kostenlosen Prüfer für XRechnung und ZUGFeRD.
