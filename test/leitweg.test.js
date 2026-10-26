// Tests mit dem Beispiel aus der offiziellen Format-Spezifikation 2.0.2 und der Test-Leitweg-ID des Bundes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pruefeLeitwegId, pruefziffer } from "../dist/index.js";

test("Beispiel aus der Spezifikation (Kap. 2.4)", () => {
  assert.equal(pruefziffer("04011000", "1234512345"), "06");
  assert.equal(pruefeLeitwegId("04011000-1234512345-06").gueltig, true);
});

test("Test-Leitweg-ID des Bundes mit Buchstaben", () => {
  assert.equal(pruefeLeitwegId("991-33333TEST-33").gueltig, true);
});

test("Groß- und Kleinschreibung egal", () => {
  assert.equal(pruefeLeitwegId("991-33333test-33").gueltig, true);
});

test("falsche Prüfziffer wird erkannt und die richtige genannt", () => {
  const r = pruefeLeitwegId("04011000-1234512345-07");
  assert.equal(r.gueltig, false);
  assert.equal(r.richtigePruefziffer, "06");
});

test("ohne Prüfziffer wird sie berechnet", () => {
  const r = pruefeLeitwegId("04011000-1234512345");
  assert.equal(r.gueltig, false);
  assert.equal(r.richtigePruefziffer, "06");
});

test("ungültige Länge der Grobadressierung", () => {
  assert.equal(pruefeLeitwegId("0401100-1234512345-06").gueltig, false);
});

test("unbekannte Landeskennzahl", () => {
  assert.equal(pruefeLeitwegId("17011000-1234512345-06").gueltig, false);
});

test("Prüfziffer muss aus genau zwei Ziffern bestehen", () => {
  assert.equal(pruefeLeitwegId("04011000-ABC-XYZ").gueltig, false);
  assert.equal(pruefeLeitwegId("04011000-1234512345-6").gueltig, false);
});

test("nur Bund ohne Feinadressierung", () => {
  assert.equal(pruefeLeitwegId("99-" + pruefziffer("99", "")).gueltig, true);
});
