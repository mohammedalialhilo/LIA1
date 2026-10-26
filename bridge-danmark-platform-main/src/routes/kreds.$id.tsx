import { createFileRoute, Link, Outlet, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgBreadcrumbs, OrgHero, OrgLocalNav } from "@/components/site/OrgShell";
import { getCircuit } from "@/lib/organization-data";
import { getCircuitContent } from "@/lib/organization-content";

export const Route = createFileRoute("/kreds/$id")({
  loader: ({ params }) => {
    const circuit = getCircuit(Number(params.id));
    if (!circuit) throw notFound();
    return { circuit };
  },
  component: KredsLayout,
});

const lokaleSider = [
  { to: "/kreds/$id", label: "Forside", exact: true },
  { to: "/kreds/$id/distrikter", label: "Distrikter" },
  { to: "/kreds/$id/klubber", label: "Klubber" },
  { to: "/kreds/$id/turneringer", label: "Turneringer" },
  { to: "/kreds/$id/nyheder", label: "Nyheder" },
  { to: "/kreds/$id/bestyrelse", label: "Bestyrelse" },
  { to: "/kreds/$id/dokumenter", label: "Dokumenter" },
] as const;

function KredsLayout() {
  const { circuit } = Route.useLoaderData();
  const { id } = Route.useParams();
  const indhold = getCircuitContent(circuit.id);

  return (
    <>
      <OrgBreadcrumbs
        trin={[
          <Link key="dbf" to="/" className="hover:text-accent">
            Danmarks Bridgeforbund
          </Link>,
          <span key="kreds">{circuit.name}</span>,
        ]}
      />

      <OrgHero
        titel={circuit.name}
        beskrivelse={indhold.about ?? circuit.description}
        handling={
          <Button asChild variant="hero" size="lg">
            <Link to="/kreds/$id/distrikter" params={{ id }}>
              Se distrikter i kredsen <ArrowRight />
            </Link>
          </Button>
        }
      />

      <OrgLocalNav
        punkter={lokaleSider.map((side) => (
          <Button key={side.to} asChild variant="ghost" size="sm">
            <Link
              to={side.to}
              params={{ id }}
              activeOptions={{ exact: Boolean((side as { exact?: boolean }).exact) }}
              activeProps={{ className: "bg-secondary font-bold" }}
            >
              {side.label}
            </Link>
          </Button>
        ))}
      />

      <Outlet />
    </>
  );
}
