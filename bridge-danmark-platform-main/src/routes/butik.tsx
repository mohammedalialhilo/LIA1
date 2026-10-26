import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/site/Bits";
import { butikKategorier, varer } from "@/lib/demo-data";
import butikBillede from "@/assets/butik.jpg";
import { ShoppingBag, Truck, Headset } from "lucide-react";

export const Route = createFileRoute("/butik")({
  head: () => ({
    meta: [
      { title: "Bridgebutikken – bridge.dk" },
      {
        name: "description",
        content:
          "Spillekort, bridgeborde, Bridgemate-udstyr, bøger, undervisningsmateriale og gaver til klubben og spilleren.",
      },
      { property: "og:title", content: "Bridgebutikken – bridge.dk" },
      {
        property: "og:description",
        content: "Alt til bridgeklubben og spilleren — en del af bridge.dk.",
      },
    ],
  }),
  component: Butik,
});

function Butik() {
  const [kategori, setKategori] = useState("Alle");
  const liste = varer.filter((v) => kategori === "Alle" || v.kategori === kategori);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={butikBillede}
          alt="Bridgekort, meldekasser og bøger"
          width={1400}
          height={900}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="hero-gradient absolute inset-0 opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground lg:px-8">
          <p className="section-label mb-3">Bridgebutikken</p>
          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
            Alt til klubben og spillebordet
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/85">
            Kort, borde, Bridgemate-udstyr, bøger, undervisningsmateriale og gaver — leveret af
            Danmarks Bridgeforbund. Klubber får automatisk klubpriser ved login.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Truck className="size-4 text-accent" /> Levering 2–4 hverdage
            </span>
            <span className="flex items-center gap-2">
              <Headset className="size-4 text-accent" /> Rådgivning til klubber
            </span>
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-accent" /> Klubpriser ved login
            </span>
          </div>
        </div>
      </section>

      <Section titel="Kategorier" beskrivelse="Demokategorier — varesortimentet er ikke koblet til en rigtig webshop endnu.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {butikKategorier.map((k) => (
            <button key={k.navn} onClick={() => setKategori(k.navn)} className="text-left">
              <Card className="h-full transition-shadow hover:lift-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold">{k.navn}</h3>
                    <Badge variant="secondary">{k.antal} varer</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{k.beskrivelse}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </Section>

      <Section
        titel={kategori === "Alle" ? "Udvalgte varer" : kategori}
        className="pt-0"
        handling={
          kategori !== "Alle" ? (
            <Button variant="outline" onClick={() => setKategori("Alle")}>
              Vis alle varer
            </Button>
          ) : undefined
        }
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {liste.map((v) => (
            <Card key={v.id} className="flex flex-col overflow-hidden">
              <div className="grid aspect-[4/3] place-items-center bg-secondary/60 font-display text-4xl text-muted-foreground">
                ♠
              </div>
              <CardContent className="flex flex-1 flex-col p-5">
                {v.maerkat && (
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {v.maerkat}
                  </Badge>
                )}
                <h3 className="font-bold leading-snug">{v.navn}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {v.kategori}
                </p>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{v.beskrivelse}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg font-bold text-accent">{v.pris}</span>
                  <Button size="sm" variant="accent">
                    Læg i kurv
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!liste.length && (
            <p className="text-muted-foreground">Ingen demovarer i denne kategori endnu.</p>
          )}
        </div>
      </Section>
    </>
  );
}
