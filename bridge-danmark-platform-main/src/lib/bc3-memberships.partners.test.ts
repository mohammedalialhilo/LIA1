import { describe, expect, it } from "vitest";
import type { Member, MemberClub } from "@/api/firebirdApi";
import { byggMakkerpar } from "./bc3-memberships";

const members = [
  { memberID: 1, name: "Åse", memberNo: 101 },
  { memberID: 2, name: "Bjørn", memberNo: 102 },
  { memberID: 3, name: "Cecilie", memberNo: 103 },
  { memberID: 4, name: "Dorte", memberNo: 104 },
] as Member[];

function link(memberID: number, partnerID: number, partnerFirst = "F") {
  return { memberID, partnerID, partnerFirst, clubID: 1, memberClubID: memberID } as MemberClub;
}

describe("subclub partner overview", () => {
  it("shows a reciprocal pair once and identifies the unpaired member", () => {
    const view = byggMakkerpar(1, [link(1, 2, "T"), link(2, 1), link(3, 0)], members);
    expect(view.par).toHaveLength(1);
    expect(view.par[0]?.noegle).toBe("1-2");
    expect(view.udenMakker.map((person) => person.memberID)).toEqual([3]);
    expect(view.problemer).toEqual([]);
  });

  it("exposes dangling and one-sided references instead of showing false pairs", () => {
    const view = byggMakkerpar(1, [link(1, 4, "T"), link(2, 3, "T"), link(3, 0)], members);
    expect(view.par).toEqual([]);
    expect(view.problemer.map((problem) => problem.person.memberID).sort()).toEqual([1, 2, 3]);
  });
});
