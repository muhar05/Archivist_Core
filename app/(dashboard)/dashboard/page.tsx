import React from "react"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight font-heading">System Dashboard</h1>
        <p className="text-on-surface-variant mt-1 text-sm font-body">Overview of archival movements and physical health metrics.</p>
      </header>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-body">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-primary/5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-fixed rounded-lg text-primary">
              <span className="material-symbols-outlined">database</span>
            </div>
            <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">+1.2%</span>
          </div>
          <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider text-[10px]">Total Records</div>
          <div className="text-2xl font-extrabold text-on-surface mt-1 font-heading">14,292</div>
        </div>
        
        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-primary/5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-secondary">
              <span className="material-symbols-outlined">outbox</span>
            </div>
            <span className="text-on-surface-variant text-xs font-medium">Active</span>
          </div>
          <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider text-[10px]">Active Loans</div>
          <div className="text-2xl font-extrabold text-on-surface mt-1 font-heading">482</div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-error/10 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error-container rounded-lg text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <span className="text-error text-xs font-bold bg-error-container px-2 py-0.5 rounded">High Priority</span>
          </div>
          <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider text-[10px]">Overdue Reports</div>
          <div className="text-2xl font-extrabold text-on-surface mt-1 font-heading">12</div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-primary/5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary">
              <span className="material-symbols-outlined">warehouse</span>
            </div>
            <span className="text-on-surface-variant text-xs font-medium">Optimal</span>
          </div>
          <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider text-[10px]">Warehouse Capacity</div>
          <div className="text-2xl font-extrabold text-on-surface mt-1 font-heading">84.2%</div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 gap-8 font-body">
        {/* Left: Health and Activity */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Warehouse Health Widget */}
          <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2 font-heading">
                <span className="material-symbols-outlined">analytics</span>
                Warehouse Utilization by Zone
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full primary-gradient"></span> Occupied
                </span>
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span> Available
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { zone: "Zone A", label: "High Density Storage", value: 92 },
                { zone: "Zone B", label: "Standard Shelving", value: 64 },
                { zone: "Zone C", label: "Cold Storage - Archive", value: 38 },
              ].map((zone) => (
                <div key={zone.zone} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{zone.zone}</span>
                    <span className="text-sm font-bold">{zone.value}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className="primary-gradient h-full transition-all duration-1000" style={{ width: `${zone.value}%` }}></div>
                  </div>
                  <p className="mt-3 text-xs text-on-surface-variant italic">{zone.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="px-8 py-6 border-b border-surface-container-high flex items-center justify-between">
              <h3 className="text-lg font-bold text-primary font-heading">Recent Activity Feed</h3>
              <button className="text-xs font-bold text-primary px-3 py-1.5 hover:bg-surface-container-low transition-colors rounded-lg">View All Logs</button>
            </div>
            <div className="divide-y divide-surface-container-high">
              {/* Activity Item 1 */}
              <div className="px-8 py-4 flex items-center gap-6 hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-on-surface"><span className="font-bold">Admin Sarah</span> created new record <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">#ARC-2024-001</span></div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Corporate Financials 2023 - Q4</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium text-on-surface">2 mins ago</div>
                  <div className="text-[10px] text-on-surface-variant">Office A - Sector 2</div>
                </div>
              </div>

              {/* Activity Item 2 */}
              <div className="px-8 py-4 flex items-center gap-6 hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-on-surface"><span className="font-bold">Loan Service</span> initiated movement for <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">#LIT-992-B</span></div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Legal Discovery Documents - Jenkins Case</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium text-on-surface">14 mins ago</div>
                  <div className="text-[10px] text-amber-600 font-bold">In Transit</div>
                </div>
              </div>

              {/* Activity Item 3 */}
              <div className="px-8 py-4 flex items-center gap-6 hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm">assignment_late</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-on-surface"><span className="font-bold">System Alert</span>: Record <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">#HR-772</span> is now overdue</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">Employee Onboarding Pack - Batch 2021</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-medium text-on-surface">1 hour ago</div>
                  <div className="text-[10px] text-error font-bold">Action Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions & Maps */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Quick Actions Grid */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <h3 className="text-sm text-on-surface-variant mb-4 flex items-center gap-2 font-heading font-black tracking-widest uppercase">
              <span className="material-symbols-outlined text-sm font-normal">bolt</span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { title: "New Record", desc: "Catalog physical assets", icon: "add_circle" },
                { title: "Initiate Loan", desc: "Request record checkout", icon: "output" },
                { title: "Generate Report", desc: "Inventory & audit logs", icon: "summarize" },
              ].map((action) => (
                <button key={action.title} className="flex items-center gap-4 p-4 bg-surface-container rounded-xl hover:bg-primary-container hover:text-white transition-all text-left group">
                  <div className="p-2 rounded-lg bg-surface-container-lowest group-hover:bg-primary-fixed-dim/20 transition-colors">
                    <span className="material-symbols-outlined">{action.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold">{action.title}</div>
                    <div className="text-[10px] opacity-70">{action.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Warehouse Location Mini Map */}
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="p-6 pb-2">
              <h3 className="text-sm text-on-surface-variant flex items-center gap-2 font-heading font-black tracking-widest uppercase">
                <span className="material-symbols-outlined text-sm font-normal">location_on</span>
                Central Repository
              </h3>
            </div>
            <div className="h-48 w-full relative">
              <div className="absolute inset-0 bg-slate-200 grayscale opacity-50 overflow-hidden">
                <Image 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYEMRxJHpeMibRiI6hKgQPJPTxVgVENanVeoUSy1GqVSWj9MJWtFpUmUTCkgezs4KlZ1sgM4baDsEp5iQyw73fuWUvElbpvb_YoeusuRKviL0zKWexWAG6deaE2x0AA-iTy2qUhmK8tDScSmzsTjZN5y6ZqAFn8-WUPPcnCYCWizK0nCX2gZTmqjvW7x4xf0eHWVq-pzbcxlr-yiRdxuqY8sAQgPfBtoYVcP34NpkF-lyOGcOZ5l434El_0TvOHZhGeEaJtD6ibBVp"
                  alt="modern warehouse floor plan"
                  fill
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 rounded-full primary-gradient"></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-primary text-white">
              <div className="flex justify-between items-center">
                <div className="text-xs">
                  <p className="font-bold font-heading">Main Distribution Center</p>
                  <p className="opacity-70 text-[10px]">Avenue 4, Warehouse Complex 2</p>
                </div>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                  <span className="material-symbols-outlined text-sm">directions</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-tertiary-container p-6 rounded-2xl text-on-tertiary-container border border-outline-variant/10 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined">thermostat</span>
              <span className="text-sm font-bold font-heading">Climate Integrity</span>
            </div>
            <div className="space-y-3 font-body">
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-80">Humidity</span>
                <span className="text-xs font-bold">42% (Normal)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-80">Temperature</span>
                <span className="text-xs font-bold">18°C (Normal)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
