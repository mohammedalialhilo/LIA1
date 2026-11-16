import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { refreshPartnerQueries } from "./usePartnerManagement";

describe("partner query refresh", () => {
  it("invalidates relationships, candidates, substitutes and member views", async () => {
    const client = new QueryClient();
    const keys = [
      ["bc3", "memberclubs", "9999"],
      ["bc3", "members", "9999"],
      ["bc3", "clubMembers", "9999", "1"],
      ["bc3", "partnerCandidates", "9999", "1", 51, "Åse"],
      ["bc3", "substitutes", "9999", "1", ""],
    ];
    keys.forEach((key) => client.setQueryData(key, []));
    await refreshPartnerQueries(client, "9999", 1);
    keys.forEach((key) => expect(client.getQueryState(key)?.isInvalidated).toBe(true));
  });
});
