import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/records?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 py-3 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 font-heading antialiased tracking-tight">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-lg lg:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-lg md:xl font-extrabold text-primary dark:text-white truncate hidden sm:block">Physical Records Management</span>
        <form onSubmit={handleSearch} className="flex items-center bg-slate-200/50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary/20 transition-all">
          <span className="material-symbols-outlined text-slate-500 text-sm">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-32 md:w-48 xl:w-64 placeholder-slate-400 outline-none" 
            placeholder="Cari arsip..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-1">
          <Link href="/profile" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-lg">
            <span className="material-symbols-outlined">settings</span>
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="p-2 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer rounded-lg"
            title="Keluar"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
        
        <Link href="/profile" className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800/50">
          <div className="hidden sm:block text-right">
            <div className="text-[11px] font-black text-slate-900 dark:text-white leading-tight truncate max-w-[100px]">
              {session?.user?.name || "User"}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{session?.user?.role}</div>
          </div>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20 relative hover:ring-2 hover:ring-primary/10 transition-all active:scale-90 cursor-pointer bg-slate-200 dark:bg-slate-800">
            {session?.user?.image ? (
              <Image 
                alt="Profile" 
                src={session.user.image}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-400">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  )
}
