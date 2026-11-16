import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { refreshAssignedMemberQueries } from "./useExistingMembers";

describe("member assignment cache refresh", () => {
  it("invalidates the destination, member profile, and search views", async () => {
    const client = new QueryClient();
    const relevantKeys = [
      ["bc3", "clubMembers", "9999", "2"],
      ["bc3", "memberclubs", "9999"],
      ["bc3", "members", "9999"],
      ["bc3", "existingMemberCandidates", "9999", "2", "Fætter"],
    ];
    const otherClub = ["bc3", "clubMembers", "9999", "1"];
    for (const key of [...relevantKeys, otherClub]) client.setQueryData(key, []);

    await refreshAssignedMemberQueries(client, "9999", "2");

    for (const key of relevantKeys) {
      expect(client.getQueryState(key)?.isInvalidated).toBe(true);
    }
    expect(client.getQueryState(otherClub)?.isInvalidated).toBe(false);
  });
});
