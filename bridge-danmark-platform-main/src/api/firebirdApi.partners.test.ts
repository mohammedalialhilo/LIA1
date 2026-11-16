import { afterEach, describe, expect, it, vi } from "vitest";
import {
  findAvailableSubstitutes,
  findEligiblePartners,
  removeRegularPartner,
  setRegularPartner,
  setSubstituteStatus,
} from "./firebirdApi";

afterEach(() => vi.unstubAllGlobals());

describe("partner and substitute API", () => {
  it("searches eligible partners and substitutes using encoded Danish text", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => new Response("[]", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await findEligiblePartners(9999, 1, 51, "Bjørn");
    await findAvailableSubstitutes(9999, 1, "Åse");
    expect(fetchMock.mock.calls[0]?.[0]).toMatch(/Partnerships\/51\/Candidates\?query=Bj%C3%B8rn$/);
    expect(fetchMock.mock.calls[1]?.[0]).toMatch(/Substitutes\?query=%C3%85se$/);
  });

  it("sends the expected current partner on assignment and removal", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ memberId: 51, clubId: 1, partnerMemberId: 52, partnerFirst: "T" }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    await setRegularPartner(9999, 1, 51, 52, 0);
    await removeRegularPartner(9999, 1, 51, 52);
    const [putUrl, putInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const [deleteUrl, deleteInit] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(putUrl).toMatch(/Partnerships\/51$/);
    expect(putInit.method).toBe("PUT");
    expect(JSON.parse(putInit.body as string)).toEqual({
      partnerMemberId: 52,
      expectedPartnerMemberId: 0,
    });
    expect(deleteUrl).toMatch(/Partnerships\/51\?expectedPartnerMemberId=52$/);
    expect(deleteInit.method).toBe("DELETE");
  });

  it("sends the current substitute state as a concurrency precondition", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ memberId: 51, clubId: 1, isSubstitute: true }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    await setSubstituteStatus(9999, 1, 51, true, false);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({
      isSubstitute: true,
      expectedIsSubstitute: false,
    });
  });
});
