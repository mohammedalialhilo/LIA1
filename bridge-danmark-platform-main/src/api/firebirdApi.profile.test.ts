import { afterEach, describe, expect, it, vi } from "vitest";
import { exportMembers, searchMembers, setFeeCategory, updateClubMember } from "./firebirdApi";

afterEach(() => vi.unstubAllGlobals());

describe("member administration API contract", () => {
  it("sends combined filters and pagination to the server", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ total: 0, page: 2, pageSize: 25, items: [] })),
      );
    vi.stubGlobal("fetch", fetchMock);
    await searchMembers(9999, {
      query: "Åse",
      city: "Birkerød",
      subclubId: 1,
      isSubstitute: false,
      hasPartner: true,
      sort: "clubStart",
      descending: true,
      page: 2,
      pageSize: 25,
    });
    const url = new URL(fetchMock.mock.calls[0]![0]);
    expect(url.pathname).toBe("/api/Clubs/9999/Members/Search");
    expect(Object.fromEntries(url.searchParams)).toMatchObject({
      query: "Åse",
      city: "Birkerød",
      subclubId: "1",
      isSubstitute: "false",
      hasPartner: "true",
      sort: "clubStart",
      descending: "true",
      page: "2",
      pageSize: "25",
    });
  });

  it("exports all filtered results without page limits", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("Medlemsnr.;Navn\r\n", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      exportMembers(9999, { city: "Århus", page: 4, pageSize: 25 }),
    ).resolves.toBeInstanceOf(Blob);
    const url = new URL(fetchMock.mock.calls[0]![0]);
    expect(url.pathname).toBe("/api/Clubs/9999/Members/Export");
    expect(url.searchParams.get("city")).toBe("Århus");
    expect(url.searchParams.has("page")).toBe(false);
    expect(url.searchParams.has("pageSize")).toBe(false);
  });

  it("sends an expected category and explicit null field clears", async () => {
    const fetchMock = vi.fn().mockImplementation(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await setFeeCategory(9999, 51, 3, 2);
    await updateClubMember(9999, 1, 51, { phone2: null, clubStart: null });
    expect(JSON.parse((fetchMock.mock.calls[0]![1] as RequestInit).body as string)).toEqual({
      code: 3,
      expectedCode: 2,
    });
    expect(JSON.parse((fetchMock.mock.calls[1]![1] as RequestInit).body as string)).toEqual({
      phone2: null,
      clubStart: null,
    });
  });
});
