import React from "react"

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
          <div className="text-on-surface-variant text-sm font-medium uppercase tracking-wider text-[10px]">Reports Across Rooms</div>
          <div className="text-2xl font-extrabold text-on-surface mt-1 font-heading">12,482</div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-12 gap-8 font-body">
        {/* Health and Activity */}
        <div className="col-span-12 space-y-8">
          {/* Warehouse Health Widget */}
          <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2 font-heading">
                <span className="material-symbols-outlined">analytics</span>
                Report Distribution by Room
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full primary-gradient"></span> Stored Reports
                </span>
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span> Total Capacity
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { zone: "Vault Alpha", label: "High Density Storage", value: 4120, percent: 92 },
                { zone: "Vault Beta", label: "Standard Shelving", value: 3450, percent: 64 },
                { zone: "Annex Room", label: "Climate Controlled", value: 4912, percent: 38 },
              ].map((room) => (
                <div key={room.zone} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">{room.zone}</span>
                    <span className="text-sm font-black">{room.value.toLocaleString()} <span className="text-[10px] text-slate-400 font-medium italic">Items</span></span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden mb-2">
                    <div className="primary-gradient h-full transition-all duration-1000" style={{ width: `${room.percent}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-on-surface-variant italic">{room.label}</p>
                    <span className="text-[10px] font-bold text-primary">{room.percent}% Fill</span>
                  </div>
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

      </div>
    </>
  )
}
