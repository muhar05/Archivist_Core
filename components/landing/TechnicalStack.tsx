"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, RefreshCcw } from "lucide-react";
import { LANDING_ASSETS } from "@/constants/assets";

export function TechnicalStack() {
  return (
    <section className="py-24 px-8 bg-primary text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2"
        >
          <h4 className="text-tertiary-fixed-dim font-bold tracking-widest text-sm uppercase mb-6">Technical Reliability</h4>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter leading-tight mb-8 font-heading">Built for Speed and Reliability.</h2>
          <p className="text-on-primary-container text-lg mb-12 max-w-xl">
            Archivist Core is engineered on top of industry-leading technologies to ensure your data is secure and blazing fast.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg">
                <Shield className="w-6 h-6 text-tertiary-fixed-dim" />
              </div>
              <div>
                <h5 className="text-white font-bold mb-1">Security Highlight</h5>
                <p className="text-sm text-on-primary-container">Enterprise-grade security with Row Level Security (RLS).</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/5 rounded-lg">
                <RefreshCcw className="w-6 h-6 text-tertiary-fixed-dim" />
              </div>
              <div>
                <h5 className="text-white font-bold mb-1">Real-time Sync</h5>
                <p className="text-sm text-on-primary-container">Instant data replication across all client terminals.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8 py-6 px-8 bg-white/5 rounded-2xl border border-white/10 w-fit">
            <span className="text-white/40 font-bold text-sm tracking-widest uppercase">Stack:</span>
            <div className="flex gap-6 items-center flex-wrap">
              {["Next.js", "Supabase", "PostgreSQL"].map((tech) => (
                <span key={tech} className="text-sm font-bold text-white/80">{tech}</span>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:w-1/2 relative"
        >
          <div className="absolute inset-0 bg-tertiary-fixed/20 blur-[120px]"></div>
          <Image
            className="relative z-10 w-full h-auto rounded-xl"
            src={LANDING_ASSETS.technical.securityVisual}
            alt="Security Visual"
            width={600}
            height={500}
          />
        </motion.div>
      </div>
    </section>
  );
}
