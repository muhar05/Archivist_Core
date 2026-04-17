"use client"

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Warehouse, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  HelpCircle, 
  Globe, 
  ShieldAlert,
  Activity
} from "lucide-react"
import { LANDING_ASSETS } from "@/constants/assets"
import { buttonSpring } from "@/constants/animations"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error("Gagal Login", { description: error.message })
        return
      }

      if (data.user) {
        toast.success("Berhasil Masuk", { description: "Mengarahkan ke dashboard..." })
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen antialiased">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full bg-slate-50/80 backdrop-blur-md border-b border-outline-variant/5 flex justify-between items-center px-8 h-16 z-50">
        <div className="flex items-center gap-3">
          <Warehouse className="text-primary w-6 h-6" />
          <Link href="/" className="text-xl font-bold tracking-tighter text-slate-900">Archivist Core</Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <Link className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold" href="#">About</Link>
            <Link className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold" href="#">Security</Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-200/50 transition-colors rounded-full">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-200/50 transition-colors rounded-full">
              <Globe className="w-5 h-5" />
            </button>
            <motion.button 
              {...buttonSpring}
              className="ml-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-95 transition-all shadow-sm"
            >
              Support
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Main Content: Login Shell */}
      <main className="min-h-screen flex items-center justify-center pt-16 pb-20 relative overflow-hidden">
        {/* Ambient Background Pattern */}
        <div className="absolute inset-0 z-0">
          <Image 
            className="w-full h-full object-cover opacity-10 grayscale" 
            src={LANDING_ASSETS.auth.loginBackground}
            alt="archive background"
            fill
            priority
          />
          <div className="absolute inset-0 bg-linear-to-tr from-surface via-surface/90 to-transparent"></div>
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md px-4"
        >
          {/* Login Card */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
            {/* Branding & Welcome */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container/30 rounded-full mb-4">
                <Warehouse className="text-primary w-8 h-8" />
              </div>
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 mb-2">Welcome Back</h1>
              <p className="text-slate-500 text-sm font-medium">Secure Access to Physical Archives</p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-1.5 focus-within:text-primary transition-colors">
                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1" htmlFor="email">Username or Email</label>
                <div className="relative group">
                  <User className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                  <input 
                    className="w-full pl-8 py-3 bg-transparent border-b border-slate-200 focus:border-primary transition-all text-sm placeholder:text-slate-300 outline-none" 
                    id="email" 
                    name="email" 
                    placeholder="e.g. archivist_01" 
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="space-y-1.5 focus-within:text-primary transition-colors">
                <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase ml-1" htmlFor="password">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-primary" />
                  <input 
                    className="w-full pl-8 py-3 bg-transparent border-b border-slate-200 focus:border-primary transition-all text-sm placeholder:text-slate-300 outline-none" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••••••" 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button 
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input className="peer h-4 w-4 rounded-md border-slate-300 text-primary focus:ring-primary/20 transition-all" type="checkbox"/>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">Remember Me</span>
                </label>
                <Link className="text-xs font-bold text-primary hover:text-primary/80 transition-all font-heading" href="#">Forgot Password?</Link>
              </div>

              <motion.button 
                {...buttonSpring}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:grayscale" 
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </form>

            {/* Footer Note inside Card */}
            <div className="mt-10 pt-6 border-t border-slate-100">
              <div className="flex gap-3 px-2">
                <ShieldAlert className="text-amber-500 w-5 h-5 shrink-0" />
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                  Authorized Personnel Only. System usage is monitored and logged for security audit purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Help Links below card */}
          <div className="mt-8 flex justify-center space-x-8">
            <Link className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-all" href="#">
              <Lock className="w-3.5 h-3.5" />
              Security
            </Link>
            <Link className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-all" href="#">
              <Activity className="w-3.5 h-3.5" />
              Status
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white/50 backdrop-blur-sm border-t border-slate-100/50 hidden md:flex flex-row justify-between items-center px-10 py-5 z-50">
        <span className="text-xs font-medium text-slate-400 opacity-80">© 2024 Archival Core. Precision Digital Archiving.</span>
        <div className="flex flex-row space-x-6">
          <Link className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Privacy</Link>
          <Link className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Terms</Link>
          <Link className="text-xs font-medium text-slate-400 hover:text-primary transition-colors" href="#">Security</Link>
        </div>
      </footer>
    </div>
  )
}