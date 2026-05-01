import React from "react"
import Image from "next/image"
import Link from "next/link"

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex justify-between items-center w-full px-4 md:px-6 py-3 sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/50 font-heading antialiased tracking-tight">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-lg lg:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-lg md:xl font-extrabold text-primary dark:text-white truncate">Physical Records Management</span>
        <div className="hidden lg:flex items-center bg-slate-200/50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-transparent focus-within:border-primary/20 transition-all">
          <span className="material-symbols-outlined text-slate-500 text-sm">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm w-48 xl:w-64 placeholder-slate-400 outline-none" 
            placeholder="Search archives..." 
            type="text"
          />
        </div>
      </div>

      
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-lg">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-lg">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer rounded-lg">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        
        <Link href="/profile" className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant/30 relative hover:ring-2 hover:ring-primary/20 transition-all active:scale-90 cursor-pointer">
          <Image 
            alt="Administrator Profile" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOW-1IqVwBzIOa0YJpcyGGRtFecljvKcAKGG-rH4e5tekuFOnNfE8qOze9R4NVd4GkRmA077fX5JH6Pu_atjwAyjmOyXnNpgKG0nTJHTaYXDOJ4HkYqpdo0e13LI8i9cT8B6oJbBq6qOuAbnbyQvDu7PeHut2wReFFe7B9I4VKjvbntW3SA-HK-V7wGixBruohwGXw5OujITz6dA94z8G3KpmIBLW76zz2-bQ7QAVdUiV7uDqk2c4Sm3fznZ_yzVA3JK7bWNVdj-JQ"
            fill
            className="object-cover"
          />
        </Link>
      </div>
    </header>
  )
}
