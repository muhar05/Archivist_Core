"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Search, History } from "lucide-react";
import { fadeInSubtle, staggerContainer, cardHover } from "@/constants/animations";

const features = [
  { 
    icon: LayoutGrid, 
    title: "Customizable Storage", 
    desc: "Build your own digital warehouse. Define rooms, racks, and boxes to match your physical layout with precision.",
    color: "bg-primary-container"
  },
  { 
    icon: Search, 
    title: "Smart Search & Locating", 
    desc: "Never lose a document again. Use global search with autocomplete to get precise breadcrumb locations instantly.",
    color: "bg-tertiary-container"
  },
  { 
    icon: History, 
    title: "Loan & Activity Tracking", 
    desc: "Complete visibility on document movement. Track who borrowed which report with automated overdue alerts.",
    color: "bg-primary"
  }
];

export function Features() {
  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 space-y-4"
        >
          <p className="text-on-tertiary-container font-bold tracking-widest text-sm uppercase">Infrastructure</p>
          <h2 className="text-4xl font-bold tracking-tighter text-on-surface font-heading">The Pillars of Archivist Core</h2>
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeInSubtle}
              {...cardHover}
              className="p-8 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors group cursor-default"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-4 font-heading">{feature.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
