"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Activity } from "lucide-react";
import { LANDING_ASSETS } from "@/constants/assets";
import { fadeInSubtle, staggerContainer, buttonSpring } from "@/constants/animations";

export function Hero() {
  return (
    <header className="pt-32 pb-20 md:pt-48 md:pb-32 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          className="lg:col-span-7 space-y-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            variants={fadeInSubtle}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold tracking-wider uppercase"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse"></span>
            Next Generation Archive Management
          </motion.div>
          <motion.h1 
            variants={fadeInSubtle}
            className="text-5xl md:text-6xl font-bold text-on-surface tracking-tighter leading-[1.05] font-heading"
          >
            Modernize Your Physical Archives. <br />
            <span className="text-on-primary-container">Find Any Report in Seconds.</span>
          </motion.h1>
          <motion.p 
            variants={fadeInSubtle}
            className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed"
          >
            Bridge the gap between physical storage and digital efficiency. A customizable warehouse management system designed to track, locate, and manage hardcopy reports with precision.
          </motion.p>
          <motion.div 
            variants={fadeInSubtle}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <motion.button 
              {...buttonSpring}
              className="w-full sm:w-auto px-8 py-4 bg-tertiary-fixed text-on-tertiary-fixed text-lg font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            >
              Get Started for Free
            </motion.button>
            <motion.button 
              {...buttonSpring}
              className="w-full sm:w-auto px-8 py-4 bg-primary-container text-on-primary text-lg font-bold rounded-xl hover:bg-primary transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              View Demo
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="lg:col-span-5 relative group"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            y: [0, -10, 0] 
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <div className="absolute -inset-4 bg-primary-container/20 blur-3xl rounded-full"></div>
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/15 p-1 overflow-hidden">
            <Image
              className="rounded-xl w-full h-auto"
              src={LANDING_ASSETS.hero.dashboardMockup}
              alt="Dashboard mockup"
              width={800}
              height={600}
              priority
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <Activity className="w-5 h-5 text-on-tertiary-fixed" />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active View</p>
                  <p className="text-sm font-semibold text-primary">Warehouse A &gt; Rack 04</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
