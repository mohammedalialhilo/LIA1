import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { MemberClub, SubClub } from "@/api/firebirdApi";
import { MembershipActions } from "./MembershipActions";

const subClubs = [
  { clubID: 1, clubName: "Mandagsklubben" },
  { clubID: 2, clubName: "Torsdagsklubben" },
] as SubClub[];

function render(memberClubs: MemberClub[]) {
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <MembershipActions
        fdbNo="9999"
        memberId={51}
        memberName="Anders And"
        memberNo={32724}
        sourceClubId={1}
        sourceClubName="Mandagsklubben"
        memberClubs={memberClubs}
        subClubs={subClubs}
      />
    </QueryClientProvider>,
  );
}

describe("membership actions", () => {
  it("shows both actions for an actual source membership", () => {
    const html = render([
      { memberClubID: 7, memberID: 51, clubID: 1, partnerID: 0, groupIndex: 0 },
    ] as MemberClub[]);
    expect(html).toContain("Fjern fra underklub");
    expect(html).toContain("Flyt til anden underklub");
  });

  it("shows no actions when the source membership is absent", () => {
    expect(render([])).not.toContain("Fjern fra underklub");
  });
});
