"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Package, CheckCircle, Clock } from "lucide-react";
import { LANDING_ASSETS } from "@/constants/assets";

export function Workflow() {
  return (
    <section className="py-24 px-8 bg-surface-container">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tighter text-on-surface mb-6 font-heading">Streamlined Document Lifecycle</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">From intake to archival, we&apos;ve optimized every step to ensure 100% accountability.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-8 bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div>
              <div className="text-xs font-bold text-on-tertiary-container mb-4">STEP 01</div>
              <h3 className="text-3xl font-bold text-on-surface mb-4 font-heading">Register Reports</h3>
              <p className="text-on-surface-variant max-w-md">Input report metadata including Report Number, Date, and Client name. Integration-ready for high-volume ingestion.</p>
            </div>
            <div className="mt-8 transform group-hover:translate-y-[-10px] transition-transform duration-500">
              <Image
                className="rounded-xl shadow-2xl border border-slate-100 w-full h-auto"
                src={LANDING_ASSETS.workflow.registrationForm}
                alt="Registration form UI"
                width={800}
                height={500}
              />
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-4 bg-primary-container p-10 rounded-2xl text-on-primary flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="text-xs font-bold text-tertiary-fixed-dim mb-4">STEP 02</div>
              <h3 className="text-3xl font-bold mb-4 font-heading">Assign Slots</h3>
              <p className="text-on-primary-container">Select a physical slot from your custom hierarchy. No more guesswork; the system suggests locations.</p>
            </div>
            <div className="flex items-center justify-center pt-8">
              <Package className="w-32 h-32 text-primary-fixed-dim opacity-20" />
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-12 bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/10 flex flex-col md:flex-row items-center gap-12 overflow-hidden"
          >
            <div className="flex-1">
              <div className="text-xs font-bold text-on-tertiary-container mb-4">STEP 03</div>
              <h3 className="text-3xl font-bold text-on-surface mb-4 font-heading">Track Real-time Loans</h3>
              <p className="text-on-surface-variant">Monitor loans and returns with an automated audit log. Every movement is recorded with millisecond precision.</p>
              <div className="mt-8 flex gap-4">
                <AnimatePresence>
                  <motion.div 
                    key="checked-out"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Checked Out
                  </motion.div>
                  <motion.div 
                    key="returned"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-2 bg-slate-50 text-slate-500 rounded-lg text-sm font-bold border border-slate-100 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> Returned
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex-1">
              <Image
                className="rounded-xl w-full h-auto"
                src={LANDING_ASSETS.workflow.activityFeed}
                alt="Real-time activity feed"
                width={800}
                height={400}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
