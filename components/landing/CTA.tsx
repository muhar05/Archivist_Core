"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonSpring } from "@/constants/animations";

export function CTA() {
  return (
    <section className="py-24 px-8 text-center bg-background-custom">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 text-on-surface font-heading">Ready to reclaim your archive space?</h2>
        <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
          Join hundreds of document-heavy enterprises that have traded chaotic storage rooms for digital precision.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button 
            {...buttonSpring}
            className="w-full sm:w-auto px-10 py-5 bg-tertiary-fixed text-on-tertiary-fixed text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all active:scale-95"
          >
            Start Your Free Trial
          </motion.button>
          <motion.button 
            {...buttonSpring}
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white text-xl font-bold rounded-xl hover:bg-primary-container transition-all flex items-center gap-2 justify-center"
          >
            Talk to Sales <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
