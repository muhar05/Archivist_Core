"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileQuestion, Home, LayoutDashboard } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { buttonSpring, fadeInSubtle, staggerContainer } from "@/constants/animations";

export default function NotFound() {
  return (
    <div className="bg-background-custom min-h-screen font-body selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden antialiased flex flex-col">
      <Navbar />
      
      <main className="grow flex items-center justify-center pt-32 pb-20 px-8">
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-2xl w-full text-center space-y-12"
        >
          {/* Illustration Area */}
          <motion.div 
            variants={fadeInSubtle}
            className="relative inline-block"
          >
            <div className="absolute -inset-8 bg-primary-container/20 blur-3xl rounded-full animate-pulse"></div>
            <div className="relative bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 shadow-2xl">
              <FileQuestion className="w-24 h-24 text-primary" />
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -top-2 -right-2 bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold px-3 py-1 rounded-full shadow-lg"
              >
                Misplaced
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-6">
            <motion.h1 
              variants={fadeInSubtle}
              className="text-6xl md:text-7xl font-bold tracking-tighter text-on-surface font-heading leading-none"
            >
              Archive <span className="text-primary-container">404</span>
            </motion.h1>
            <motion.p 
              variants={fadeInSubtle}
              className="text-xl text-on-surface-variant leading-relaxed max-w-lg mx-auto"
            >
              The document you are looking for has been misplaced or never existed in our warehouse records. 
            </motion.p>
          </div>

          {/* Recovery Actions */}
          <motion.div 
            variants={fadeInSubtle}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div {...buttonSpring}>
              <Link 
                href="/" 
                className="flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/20 transition-all"
              >
                <Home className="w-5 h-5" />
                Return Home
              </Link>
            </motion.div>
            <motion.div {...buttonSpring}>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-8 py-4 bg-surface-container-low text-on-surface font-bold border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to Dashboard
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={fadeInSubtle}
            className="pt-8 flex items-center justify-center gap-8 border-t border-outline-variant/10 opacity-40 grayscale"
          >
            <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              System Online
            </div>
            <div className="flex items-center gap-2 font-bold text-sm tracking-widest uppercase">
              Database Synced
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
