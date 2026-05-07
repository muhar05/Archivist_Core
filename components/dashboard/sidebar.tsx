"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard", fillIcon: true },
  { name: "Records", href: "/records", icon: "inventory_2" },
  { name: "Locations", href: "/locations", icon: "location_on" },
  { name: "Loans", href: "/loans", icon: "assignment_return" },
]

const adminNavigation = [
  { name: "Approvals", href: "/admin/approvals", icon: "verified_user" },
  { name: "Architect", href: "/admin/architect", icon: "architecture" },
  { name: "Users", href: "/admin/users", icon: "group" },
  { name: "Master Laporan", href: "/admin/categories", icon: "category" },
]

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = (session?.user as { role?: string })?.role === "admin"

  const NavLink = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = pathname === item.href
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => onClose()}
        className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 scale-100 active:scale-[0.98] rounded-lg ${
          isActive
            ? "text-primary dark:text-blue-300 font-bold border-r-2 border-primary dark:border-blue-400 bg-slate-200/50 dark:bg-slate-800/50"
            : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
        }`}
      >
        <span 
          className="material-symbols-outlined"
          style={item.fillIcon ? { fontVariationSettings: "'FILL' 1" } : {}}
        >
          {item.icon}
        </span>
        {item.name}
      </Link>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/50 pt-4">
      <div className="px-6 py-8 flex flex-col gap-2 h-full">
        <div className="flex items-center justify-between gap-3 px-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 primary-gradient rounded-lg flex items-center justify-center text-white shadow-lg">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <div className="text-lg font-black tracking-tighter text-primary dark:text-white leading-tight">The Archivist</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Precision Records</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <nav className="flex flex-col gap-1">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-2">Main Menu</div>
          {navigation.map((item) => <NavLink key={item.name} item={item} />)}

          {isAdmin && (
            <div className="mt-6 flex flex-col gap-1">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-2">Admin Controls</div>
              {adminNavigation.map((item) => <NavLink key={item.name} item={item} />)}
            </div>
          )}
        </nav>
        
        <div className="mt-auto pt-6 pb-2 border-t border-slate-200 dark:border-slate-800/50">
          <div className="px-4 mb-4">
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {session?.user?.name || "User"}
                </div>
                <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  {isAdmin ? "Administrator" : "Staff"}
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
          >
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-64 font-heading font-medium text-sm">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-80 max-w-[85vw] font-heading font-medium text-sm shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}


