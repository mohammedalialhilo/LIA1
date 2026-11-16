import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addExistingMemberToSubclub,
  createClubMember,
  getClubMembers,
  searchExistingMembers,
  updateClubMember,
} from "./firebirdApi";

afterEach(() => vi.unstubAllGlobals());

describe("club member API", () => {
  it("loads members of the selected subclub", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getClubMembers(9999, 2)).resolves.toEqual([]);
    expect(fetchMock.mock.calls[0]?.[0]).toMatch(/\/api\/Clubs\/9999\/SubClubs\/2\/Members$/);
  });

  it("sends creation and updates without a write key", async () => {
    const member = { memberId: 51, clubId: 1, name: "Test Member" };
    const fetchMock = vi
      .fn()
      .mockImplementation(async () => new Response(JSON.stringify(member), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await createClubMember(9999, 1, {
      name: "Test Member",
      memberNo: 123456,
      zipCode: "3460",
      city: "Birkerød",
      countryCode: "DK",
    });
    await updateClubMember(9999, 1, 51, {
      phone1: "0701234567",
      zipCode: "3460",
      city: "Birkerød",
      countryCode: "DK",
    });

    const [postUrl, postInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const [putUrl, putInit] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(postUrl).toMatch(/\/api\/Clubs\/9999\/SubClubs\/1\/Members$/);
    expect(postInit.method).toBe("POST");
    expect(postInit.headers).not.toHaveProperty("X-Club-Write-Key");
    expect(JSON.parse(postInit.body as string)).toEqual({
      name: "Test Member",
      memberNo: 123456,
      zipCode: "3460",
      city: "Birkerød",
      countryCode: "DK",
    });
    expect(putUrl).toMatch(/\/api\/Clubs\/9999\/SubClubs\/1\/Members\/51$/);
    expect(putInit.method).toBe("PUT");
    expect(putInit.headers).not.toHaveProperty("X-Club-Write-Key");
    expect(JSON.parse(putInit.body as string)).toMatchObject({
      zipCode: "3460",
      city: "Birkerød",
      countryCode: "DK",
    });
  });

  it("searches existing members and links the chosen ID without a person payload", async () => {
    const candidate = {
      memberId: 51,
      memberNo: 32727,
      name: "Fætter Højben",
      alreadyAssigned: false,
      subclubs: [{ clubId: 1, clubName: "Mandagsklubben" }],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([candidate]), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ memberClubId: 99, memberId: 51, clubId: 2 }), {
          status: 201,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(searchExistingMembers(9999, 2, "Fætter")).resolves.toEqual([candidate]);
    await expect(addExistingMemberToSubclub(9999, 2, 51)).resolves.toMatchObject({
      memberClubId: 99,
      memberId: 51,
      clubId: 2,
    });

    expect(fetchMock.mock.calls[0]?.[0]).toMatch(/\/Existing\?query=F%C3%A6tter$/);
    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toMatch(/\/api\/Clubs\/9999\/SubClubs\/2\/Members\/Existing$/);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({ memberId: 51 });
  });
});
