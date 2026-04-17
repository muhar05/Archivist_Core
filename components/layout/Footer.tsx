import Link from "next/link";
import { Warehouse, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 w-full py-16 border-t border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto px-8 font-body text-sm antialiased">
        <div className="space-y-6">
          <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tighter">
            <Warehouse className="w-5 h-5" /> Archivist Core
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            © 2024 Archivist Core. <br /> Built for Speed and Reliability.
          </p>
        </div>
        <div>
          <h6 className="font-bold text-slate-900 dark:text-white mb-6">Explore</h6>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 hover:text-primary transition-colors" href="#">How it Works</Link></li>
            <li><Link className="text-slate-500 hover:text-primary transition-colors" href="#">Features</Link></li>
            <li><Link className="text-slate-500 hover:text-primary transition-colors" href="#">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-slate-900 dark:text-white mb-6">Product</h6>
          <ul className="space-y-4">
            <li><Link className="text-slate-500 hover:text-primary transition-colors" href="#">Documentation</Link></li>
            <li><Link className="text-slate-500 hover:text-primary transition-colors" href="#">API Reference</Link></li>
            <li><Link className="text-slate-500 hover:text-primary transition-colors" href="#">System Status</Link></li>
          </ul>
        </div>
        <div>
          <h6 className="font-bold text-slate-900 dark:text-white mb-6">Connect</h6>
          <div className="flex gap-4">
            <Link href="#" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
