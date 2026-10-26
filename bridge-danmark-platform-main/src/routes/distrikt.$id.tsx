import { createFileRoute, Link, Outlet, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgBreadcrumbs, OrgHero, OrgLocalNav } from "@/components/site/OrgShell";
import { getCircuit, getDistrict } from "@/lib/organization-data";
import { getDistrictContent } from "@/lib/organization-content";

export const Route = createFileRoute("/distrikt/$id")({
  loader: ({ params }) => {
    const district = getDistrict(Number(params.id));
    if (!district) throw notFound();
    return { district };
  },
  component: DistriktLayout,
});

const lokaleSider = [
  { to: "/distrikt/$id", label: "Forside", exact: true },
  { to: "/distrikt/$id/klubber", label: "Klubber" },
  { to: "/distrikt/$id/turneringer", label: "Turneringer" },
  { to: "/distrikt/$id/nyheder", label: "Nyheder" },
  { to: "/distrikt/$id/bestyrelse", label: "Bestyrelse" },
  { to: "/distrikt/$id/dokumenter", label: "Dokumenter" },
] as const;

function DistriktLayout() {
  const { district } = Route.useLoaderData();
  const { id } = Route.useParams();
  const circuit = getCircuit(district.circuitId);
  const indhold = getDistrictContent(district.id);

  return (
    <>
      <OrgBreadcrumbs
        trin={[
          <Link key="dbf" to="/" className="hover:text-accent">
            Danmarks Bridgeforbund
          </Link>,
          circuit ? (
            <Link
              key="kreds"
              to="/kreds/$id"
              params={{ id: String(circuit.id) }}
              className="hover:text-accent"
            >
              {circuit.name}
            </Link>
          ) : (
            <span key="kreds">Kreds</span>
          ),
          <span key="distrikt">{district.name}</span>,
        ]}
      />

      <OrgHero
        titel={district.name}
        beskrivelse={indhold.about ?? district.description}
        handling={
          <Button asChild variant="hero" size="lg">
            <Link to="/distrikt/$id/klubber" params={{ id }}>
              Se klubber i distriktet <ArrowRight />
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
