import { describe, expect, it } from "vitest";
import { findKlub } from "./demo-data";

describe("Ungdomsbridgeklubben (2133)", () => {
  const klub = findKlub("2133");

  it("findes med de præcise hovedklublinks", () => {
    expect(klub?.navn).toBe("Ungdomsbridgeklubben");
    expect(klub?.eksterneLinks?.handicapUrl).toBe(
      "https://medlemmer.bridge.dk/klubhac.php?Klubnr=2133",
    );
    expect(klub?.eksterneLinks?.rankingUrl).toBe(
      "https://www.bridge.dk/mp/ranglister/rangliste2133.html",
    );
    expect(klub?.eksterneLinks?.masterpointsUrl).toBe(
      "https://www.bridge.dk/mp/mp2133.html",
    );
    expect(klub?.eksterneLinks?.resultsUrl).toBe(
      "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2133&clubno=1",
    );
    expect(klub?.eksterneLinks?.bronzeStandingsUrl).toBe(
      "https://www.bridge.dk/2133/Bronzestilling.html",
    );
  });

  it("har hverken MBridge eller opdigtede resultatlinks på spilleholdene", () => {
    expect(klub?.eksterneLinks?.tilmeldingUrl).toBeUndefined();
    expect(JSON.stringify(klub)).not.toContain("mbridge");
    expect(JSON.stringify(klub)).not.toContain("tournament=");
    expect(klub?.spillehold?.every((hold) => !hold.resultsUrl && !hold.aktuelleTurneringUrl)).toBe(true);
    expect(klub?.spillehold?.every((hold) => hold.clubNo === undefined)).toBe(true);
    expect(klub?.resultatkort).toHaveLength(2);
    expect(klub?.resultatkort?.every((kort) => kort.url === klub.eksterneLinks?.resultsUrl)).toBe(true);
  });

  it("har to spillehold med interne sider", () => {
    expect(klub?.spillehold?.map((hold) => hold.id)).toEqual(["1", "2"]);
    expect(klub?.spillehold?.map((hold) => hold.navn)).toEqual([
      "Ungdomsbridge København",
      "Ungdomsbridge Aarhus",
    ]);
  });

  it("har ungdomsindhold i den fælles klubkonfiguration", () => {
    expect(klub?.tema.overskrift).toBe(
      "Bridge for børn og unge – fællesskab, læring og turnering",
    );
    expect(klub?.spilleholdTitel).toBe("Spil ungdomsbridge");
    expect(klub?.aktivitetskort?.map((kort) => kort.titel)).toEqual([
      "Juniorcamps",
      "Mesterskaber",
    ]);
    expect(klub?.rekrutteringskort?.map((kort) => kort.titel)).toEqual([
      "Nye spillere",
      "Andre unge",
      "Turneringer",
    ]);
  });
});