import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { Bc3ApiError } from "@/api/firebirdApi";
import { membershipChangeError, refreshMembershipQueries } from "./membershipActionsModel";

describe("membership change state", () => {
  it("invalidates member lists, both subclubs and assignment candidates", async () => {
    const client = new QueryClient();
    const keys = [
      ["bc3", "memberclubs", "9999"],
      ["bc3", "members", "9999"],
      ["bc3", "clubMembers", "9999", "1"],
      ["bc3", "clubMembers", "9999", "2"],
      ["bc3", "existingMemberCandidates", "9999", "1", "And"],
    ];
    keys.forEach((key) => client.setQueryData(key, []));

    await refreshMembershipQueries(client, "9999", 1, 2);

    keys.forEach((key) => expect(client.getQueryState(key)?.isInvalidated).toBe(true));
  });

  it("shows an actionable Danish partner conflict", () => {
    expect(membershipChangeError(new Bc3ApiError("Conflict", 409, "partner_attached"))).toContain(
      "Fjern makkerforholdet i BC3 først",
    );
  });
});
