export declare const LAENDER: Record<string, string>;
export declare function pruefziffer(grob: string, fein: string): string;
export type LeitwegErgebnis = {
    gueltig: boolean;
    fehler: string[];
    grob?: string;
    fein?: string;
    angegebenePruefziffer?: string;
    richtigePruefziffer?: string;
    land?: string;
    teile?: {
        land: string;
        regierungsbezirk?: string;
        landkreis?: string;
        gemeinde?: string;
    };
};
/**
 * Prüft eine Leitweg-ID. Ohne Prüfziffer (z. B. "04011000-1234512345") wird die passende Prüfziffer berechnet.
 */
export declare function pruefeLeitwegId(eingabe: string): LeitwegErgebnis;
