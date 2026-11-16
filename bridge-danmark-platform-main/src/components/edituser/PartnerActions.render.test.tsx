import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { Member, MemberClub } from "@/api/firebirdApi";
import { PartnerActions } from "./PartnerActions";

const member = { memberID: 1, memberNo: 101, name: "Åse" } as Member;
const partner = { memberID: 2, memberNo: 102, name: "Bjørn" } as Member;

function render(links: MemberClub[]) {
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <PartnerActions
        fdbNo="9999"
        clubId={1}
        clubName="Mandagsklubben"
        member={member}
        link={links[0]!}
        allLinks={links}
        members={[member, partner]}
      />
    </QueryClientProvider>,
  );
}

describe("partner controls", () => {
  it("offers assignment and substitute registration for an unpaired member", () => {
    const html = render([
      {
        memberClubID: 1,
        memberID: 1,
        clubID: 1,
        partnerID: 0,
        partnerFirst: "F",
        isSubstitute: "F",
        groupIndex: 0,
      },
    ] as MemberClub[]);
    expect(html).toContain("Tildel makker");
    expect(html).toContain("Registrer som substitut");
    expect(html).not.toContain("Fjern makker</button>");
  });

  it("offers change and removal for a reciprocal pair", () => {
    const html = render([
      {
        memberClubID: 1,
        memberID: 1,
        clubID: 1,
        partnerID: 2,
        partnerFirst: "T",
        isSubstitute: "T",
        groupIndex: 0,
      },
      {
        memberClubID: 2,
        memberID: 2,
        clubID: 1,
        partnerID: 1,
        partnerFirst: "F",
        isSubstitute: "F",
        groupIndex: 0,
      },
    ] as MemberClub[]);
    expect(html).toContain("Skift makker");
    expect(html).toContain("Fjern makker");
    expect(html).toContain("Fjern substitutstatus");
  });
});
