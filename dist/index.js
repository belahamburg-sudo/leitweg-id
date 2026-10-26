// Leitweg-ID prüfen und Prüfziffer berechnen nach der offiziellen Format-Spezifikation Version 2.0.2 (KoSIT, 28.07.2021).
// Aufbau: Grobadressierung - [Feinadressierung -] Prüfziffer, Prüfziffer nach ISO/IEC 7064 Modulo 97-10.
// MIT-Lizenz, https://erechnungswandler.de/leitweg-id
export const LAENDER = {
    "01": "Schleswig-Holstein",
    "02": "Hamburg",
    "03": "Niedersachsen",
    "04": "Bremen",
    "05": "Nordrhein-Westfalen",
    "06": "Hessen",
    "07": "Rheinland-Pfalz",
    "08": "Baden-Württemberg",
    "09": "Bayern",
    "10": "Saarland",
    "11": "Berlin",
    "12": "Brandenburg",
    "13": "Mecklenburg-Vorpommern",
    "14": "Sachsen",
    "15": "Sachsen-Anhalt",
    "16": "Thüringen",
    "99": "Bund",
};
// Erlaubte Längen der Grobadressierung: Land (2), + Regierungsbezirk (1), + Landkreis (2), + Gemeinde (3, 4 oder 7)
const GROB_LAENGEN = [2, 3, 5, 8, 9, 12];
// Rest modulo 97 einer langen Ziffernfolge, stückweise wie bei der IBAN-Prüfung
function mod97(ziffern) {
    let rest = 0;
    for (const z of ziffern)
        rest = (rest * 10 + Number(z)) % 97;
    return rest;
}
// Buchstaben A bis Z werden zu 10 bis 35 (nicht case-sensitiv)
function alsZiffern(text) {
    return text
        .toUpperCase()
        .split("")
        .map((c) => (/[A-Z]/.test(c) ? String(c.charCodeAt(0) - 55) : c))
        .join("");
}
export function pruefziffer(grob, fein) {
    return String(98 - mod97(alsZiffern(grob + fein) + "00")).padStart(2, "0");
}
/**
 * Prüft eine Leitweg-ID. Ohne Prüfziffer (z. B. "04011000-1234512345") wird die passende Prüfziffer berechnet.
 */
export function pruefeLeitwegId(eingabe) {
    const id = eingabe.trim().replace(/[‐-―−]/g, "-").replace(/\s+/g, "");
    const fehler = [];
    if (!id)
        return { gueltig: false, fehler: ["Bitte eine Leitweg-ID eingeben."] };
    if (/[^0-9A-Za-z-]/.test(id))
        fehler.push("Erlaubt sind nur Ziffern, Buchstaben A bis Z und der Bindestrich.");
    const teile = id.split("-");
    if (teile.length > 3)
        fehler.push("Zu viele Bindestriche. Erlaubt sind höchstens zwei: Grobadressierung-Feinadressierung-Prüfziffer.");
    const grob = teile[0] ?? "";
    // Letzter Teil mit genau zwei Ziffern ist die Prüfziffer, sonst fehlt sie
    const hatPruefziffer = teile.length >= 2 && /^\d{2}$/.test(teile[teile.length - 1]);
    const fein = teile.length === 3 ? teile[1] : teile.length === 2 && !hatPruefziffer ? teile[1] : "";
    const angegeben = hatPruefziffer ? teile[teile.length - 1] : undefined;
    if (!/^\d+$/.test(grob))
        fehler.push("Die Grobadressierung (vor dem ersten Bindestrich) darf nur Ziffern enthalten.");
    else if (!GROB_LAENGEN.includes(grob.length))
        fehler.push(`Die Grobadressierung hat ${grob.length} Stellen. Erlaubt sind 2, 3, 5, 8, 9 oder 12 Stellen.`);
    const landCode = grob.slice(0, 2);
    if (/^\d{2}/.test(grob) && !LAENDER[landCode])
        fehler.push(`Die ersten zwei Ziffern (${landCode}) sind keine gültige Kennzahl. Erlaubt sind 01 bis 16 für die Länder und 99 für den Bund.`);
    if (teile.length === 3 && !hatPruefziffer)
        fehler.push("Die Prüfziffer am Ende muss aus genau zwei Ziffern bestehen.");
    if (fein.length > 30)
        fehler.push(`Die Feinadressierung hat ${fein.length} Zeichen. Erlaubt sind höchstens 30.`);
    if (teile.length === 3 && fein === "")
        fehler.push("Zwischen den beiden Bindestrichen fehlt die Feinadressierung.");
    if (id.length > 46)
        fehler.push(`Die Leitweg-ID hat ${id.length} Zeichen. Erlaubt sind höchstens 46.`);
    const richtig = fehler.length === 0 ? pruefziffer(grob, fein) : undefined;
    if (richtig && angegeben && angegeben !== richtig)
        fehler.push(`Die Prüfziffer ${angegeben} stimmt nicht. Richtig wäre ${richtig}. Meist ist eine Ziffer vertippt, bitte die Leitweg-ID beim Auftraggeber nachfragen.`);
    return {
        gueltig: fehler.length === 0 && !!angegeben,
        fehler,
        grob,
        fein: fein || undefined,
        angegebenePruefziffer: angegeben,
        richtigePruefziffer: richtig,
        land: LAENDER[landCode],
        teile: /^\d+$/.test(grob)
            ? {
                land: grob.slice(0, 2),
                regierungsbezirk: grob.slice(2, 3) || undefined,
                landkreis: grob.slice(3, 5) || undefined,
                gemeinde: grob.slice(5) || undefined,
            }
            : undefined,
    };
}
