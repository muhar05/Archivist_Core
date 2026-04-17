"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, Database, RefreshCcw } from "lucide-react";

export function DataRibbon() {
  return (
    <div className="bg-surface-container-high py-8 border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8 overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-12 grayscale opacity-60"
        >
          <div className="flex items-center gap-2 font-bold text-primary text-lg"><ShieldCheck className="w-5 h-5" /> SECURITY FIRST</div>
          <div className="flex items-center gap-2 font-bold text-primary text-lg"><Zap className="w-5 h-5" /> HIGH PERFORMANCE</div>
          <div className="flex items-center gap-2 font-bold text-primary text-lg"><Database className="w-5 h-5" /> DATA INTEGRITY</div>
          <div className="flex items-center gap-2 font-bold text-primary text-lg"><RefreshCcw className="w-5 h-5" /> REAL-TIME SYNC</div>
        </motion.div>
      </div>
    </div>
  );
}
