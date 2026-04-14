"use client"

import React, { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
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
        router.push("/")
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
    <div className="bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full bg-slate-50 flex justify-between items-center px-6 h-16 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">inventory_2</span>
          <span className="text-xl font-bold tracking-tight text-blue-900">Archival Core</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <a className="text-slate-500 hover:bg-slate-200/50 transition-colors px-3 py-1 rounded-lg text-sm font-medium" href="#">About</a>
            <a className="text-slate-500 hover:bg-slate-200/50 transition-colors px-3 py-1 rounded-lg text-sm font-medium" href="#">Security</a>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:bg-slate-200/50 transition-colors rounded-full">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-200/50 transition-colors rounded-full">
              <span className="material-symbols-outlined">language</span>
            </button>
            <button className="ml-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">Support</button>
          </div>
        </div>
      </nav>

      {/* Main Content: Login Shell */}
      <main className="min-h-screen flex items-center justify-center pt-16 pb-20 relative overflow-hidden">
        {/* Ambient Background Pattern */}
        <div className="absolute inset-0 z-0">
          <Image 
            className="w-full h-full object-cover opacity-10 grayscale" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABfHDwdA8EWEPVlTf8nx-k0Iy_vXstUbIu3KFIinj4KeEyHjMyoRE01L_hdhs3DxLQQlhALOzfDaCbP4DjkdLkcqGTFoRtT8GDzn9HatQrRmgVoBuwsRjE_b8HSYXnR8GQ644fkOw4JN2-U1_6htcRlwIpOkLXEqmDPW5LwWjRzw_Tu7hwU9ny_uN27ob27tWUU4x-ZRFgx0xsubztNhwympTvTQnm8mi6uV9LcdlFOnayACiVsCIGq-zbWQoGL3SAz2zqnsVDhvNI"
            alt="archive background"
            fill
            priority
          />
          <div className="absolute inset-0 bg-linear-to-tr from-surface via-surface/90 to-transparent"></div>
        </div>

        <section className="relative z-10 w-full max-w-md px-4">
          {/* Login Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_0_32px_0_rgba(26,27,30,0.06)] border border-outline-variant/10 p-8 md:p-10">
            {/* Branding & Welcome */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-fixed rounded-full mb-4">
                <span className="material-symbols-outlined text-primary text-3xl">account_balance</span>
              </div>
              <h1 className="font-headline text-2xl font-extrabold tracking-tight text-primary mb-2">Archival Core</h1>
              <p className="text-on-surface-variant text-sm font-medium">Secure Access to Physical Archives</p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold tracking-wider text-primary uppercase ml-1" htmlFor="email">Username or Email</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">person</span>
                  <input 
                    className="w-full pl-8 py-3 bg-transparent ghost-border-bottom border-x-0 border-t-0 focus:ring-0 focus:border-primary transition-colors text-sm placeholder:text-outline/50 outline-none" 
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
              <div className="space-y-1">
                <label className="block text-[11px] font-bold tracking-wider text-primary uppercase ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">lock</span>
                  <input 
                    className="w-full pl-8 py-3 bg-transparent ghost-border-bottom border-x-0 border-t-0 focus:ring-0 focus:border-primary transition-colors text-sm placeholder:text-outline/50 outline-none" 
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary" 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input className="peer h-4 w-4 rounded-sm border-outline-variant text-primary focus:ring-primary focus:ring-offset-0" type="checkbox"/>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
                </label>
                <a className="text-xs font-bold text-primary hover:underline decoration-primary/30 transition-all" href="#">Forgot Password?</a>
              </div>

              <button 
                className="w-full py-3 primary-gradient text-white font-bold rounded-lg shadow-lg hover:shadow-primary/20 hover:opacity-95 transition-all scale-100 active:scale-[0.98] duration-150 flex items-center justify-center gap-2" 
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Signing In..." : "Sign In"}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>

            {/* Footer Note inside Card */}
            <div className="mt-8 pt-6 border-t border-surface-variant/50">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-error text-xl shrink-0">gpp_maybe</span>
                <p className="text-[11px] leading-relaxed text-on-surface-variant/80 font-medium italic">
                  Authorized Personnel Only. System usage is monitored and logged for audit purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Help Links below card */}
          <div className="mt-8 flex justify-center space-x-6">
            <a className="flex items-center gap-1 text-[11px] font-bold text-on-secondary-fixed-variant uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity" href="#">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Security Standards
            </a>
            <a className="flex items-center gap-1 text-[11px] font-bold text-on-secondary-fixed-variant uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity" href="#">
              <span className="material-symbols-outlined text-sm">terminal</span>
              System Status
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-transparent flex flex-row justify-center space-x-8 py-6 z-50">
        <span className="text-xs font-medium text-slate-500 opacity-80">© 2024 Archival Core. All rights reserved. Precision Digital Archiving.</span>
        <div className="hidden md:flex flex-row space-x-6">
          <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">Security Standards</a>
          <a className="text-xs font-medium text-slate-500 hover:text-blue-700 transition-opacity opacity-80 hover:opacity-100" href="#">System Status</a>
        </div>
      </footer>
    </div>
  )
}