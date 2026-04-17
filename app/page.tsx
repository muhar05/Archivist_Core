"use client"

export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { DataRibbon } from "@/components/landing/DataRibbon";
import { Features } from "@/components/landing/Features";
import { Workflow } from "@/components/landing/Workflow";
import { TechnicalStack } from "@/components/landing/TechnicalStack";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="bg-background-custom min-h-screen font-body selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
      <Navbar />
      <Hero />
      <DataRibbon />
      <Features />
      <Workflow />
      <TechnicalStack />
      <CTA />
      <Footer />
    </div>
  );
}
