import { describe, expect, it } from "vitest";
import { findKlub, klubber } from "./demo-data";

/**
 * Regressionstest for Gentofte Bridgeklub (2132).
 *
 * Sikrer at:
 * - KUN klub 2132 har et Tilmelding-link, og at det er den præcise
 *   MBridge-URL med klubnr=2132.
 * - Spilleholdenes (underklubbernes) resultat-links forbliver uændrede
 *   og altid bruger mainclubno=2132 med det rette clubno (4/3/2).
 * - Ingen andre klubber påvirkes.
 */

const MBRIDGE_TILMELDING = "https://mbridge.dk/files7/index.php?klubnr=2132&ak=1";

const FORVENTEDE_SPILLEHOLD: Record<number, string> = {
  4: "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2132&clubno=4",
  3: "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2132&clubno=3",
  2: "https://resultater.bridge.dk/template/overview_club.php?mainclubno=2132&clubno=2",
};

const AKTUELLE_TURNERINGER: Record<number, string | undefined> = {
  4: "https://resultater.bridge.dk/template/turnering.php?mainclubno=2132&clubno=4&tournament=483",
  3: undefined,
  2: undefined,
};

const HANDICAP_URL = "https://medlemmer.bridge.dk/klubhac.php?Klubnr=2132";

describe("Gentofte Bridgeklub (2132) – Tilmelding og spilleholdslinks", () => {
  const gentofte = findKlub("2132");

  it("klub 2132 findes i klubdatamodellen", () => {
    expect(gentofte).toBeDefined();
    expect(gentofte!.navn).toBe("Gentofte Bridgeklub");
  });

  it("Tilmelding-linket er præcis MBridge-URL'en med klubnr=2132", () => {
    expect(gentofte!.eksterneLinks?.tilmeldingUrl).toBe(MBRIDGE_TILMELDING);
  });

  it("kun klub 2132 har et Tilmelding-link – ingen andre klubber", () => {
    const medTilmelding = klubber.filter((k) => k.eksterneLinks?.tilmeldingUrl);
    expect(medTilmelding.map((k) => k.nr)).toEqual(["2132"]);
  });

  it("MBridge-URL'en indeholder klubnr=2132 og intet andet klubnummer", () => {
    const url = gentofte!.eksterneLinks!.tilmeldingUrl!;
    expect(url).toContain("klubnr=2132");
    expect(url).not.toMatch(/klubnr=(?!2132)\d+/);
  });

  it("åbent hus-sektionen har ikke sit eget tilmeldingslink (undgår dublet)", () => {
    expect(gentofte!.aabentHus?.tilmeldingUrl).toBeUndefined();
  });

  it("handicaplinket på hovedklubben er præcis DBF's klubhandicap-URL", () => {
    expect(gentofte!.eksterneLinks?.handicapUrl).toBe(HANDICAP_URL);
  });

  it("Gentofte har præcis tre spillehold med clubNo 4, 3 og 2", () => {
    const hold = gentofte!.spillehold ?? [];
    expect(hold.map((h) => h.clubNo).sort()).toEqual([2, 3, 4]);
  });

  it.each(Object.entries(FORVENTEDE_SPILLEHOLD))(
    "spillehold clubno=%s har det uændrede resultat-link",
    (clubNo, forventetUrl) => {
      const hold = gentofte!.spillehold!.find((h) => h.clubNo === Number(clubNo));
      expect(hold, `spillehold med clubNo ${clubNo} skal findes`).toBeDefined();
      expect(hold!.resultsUrl).toBe(forventetUrl);
    },
  );

  it("alle spilleholds resultat-links bruger mainclubno=2132", () => {
    for (const hold of gentofte!.spillehold!) {
      expect(hold.resultsUrl).toContain("mainclubno=2132");
      expect(hold.resultsUrl).toContain(`clubno=${hold.clubNo}`);
      // clubno=1 må aldrig bruges som standard
      expect(hold.resultsUrl).not.toContain("clubno=1");
    }
  });

  it.each(Object.entries(AKTUELLE_TURNERINGER))(
    "spillehold clubno=%s har det korrekte link til aktuelle turneringer",
    (clubNo, forventetUrl) => {
      const hold = gentofte!.spillehold!.find((h) => h.clubNo === Number(clubNo));
      expect(hold!.aktuelleTurneringUrl).toBe(forventetUrl);
    },
  );

  it("ingen spillehold har et MBridge- eller tilmeldingslink", () => {
    for (const hold of gentofte!.spillehold!) {
      expect(JSON.stringify(hold)).not.toContain("mbridge");
    }
  });

  it("kun 2132 har Gentoftes egne resultatlinks på spillehold", () => {
    const andre = klubber.filter(
      (k) => k.nr !== "2132" && k.spillehold?.some((h) => h.resultsUrl?.includes("mainclubno=2132")),
    );
    expect(andre).toEqual([]);
  });

  it("ingen andre klubber linker til MBridge", () => {
    const andre = klubber.filter((k) => k.nr !== "2132");
    for (const k of andre) {
      expect(JSON.stringify(k.eksterneLinks ?? {})).not.toContain("mbridge");
    }
  });

  it("de øvrige klubber (2275, 4470, 9999) findes fortsat uændret", () => {
    for (const nr of ["2275", "4470", "9999"]) {
      expect(findKlub(nr), `klub ${nr} skal fortsat findes`).toBeDefined();
    }
  });
});
