"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Warehouse, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { buttonSpring } from "@/constants/animations";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-2xl border-none">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Warehouse className="w-6 h-6 text-primary" />
          <Link href="/" className="text-xl font-bold text-slate-900 tracking-tighter hover:text-primary transition-colors">Archivist Core</Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <AnimatePresence mode="wait">
            {!loading && (
              user ? (
                <motion.div 
                  key="auth-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  <motion.div {...buttonSpring}>
                    <Link 
                      className="flex items-center gap-2 px-6 py-2.5 text-slate-700 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm" 
                      href="/dashboard"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      Dashboard
                    </Link>
                  </motion.div>
                  <motion.button 
                    {...buttonSpring}
                    onClick={handleSignOut}
                    className="p-2.5 text-slate-500 hover:text-error hover:bg-error/10 rounded-xl transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  key="guest-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4"
                >
                  <motion.div {...buttonSpring}>
                    <Link 
                      className="hidden md:block px-6 py-2.5 text-slate-700 font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm" 
                      href="/auth/login"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.button 
                    {...buttonSpring}
                    className="hidden md:block px-6 py-2.5 bg-tertiary-fixed text-on-tertiary-fixed rounded-xl font-semibold hover:bg-tertiary-fixed-dim shadow-sm active:scale-95 transition-all outline-none"
                  >
                    Get Started
                  </motion.button>
                </motion.div>
              )
            )}
          </AnimatePresence>

          <button className="md:hidden p-2 text-primary">
            <Menu className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </nav>
  );
}
