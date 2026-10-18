import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Code2, ExternalLink } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DemoBanner } from '../ui/DemoBanner';

export const AppShell: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col lg:pl-[260px]">
        <DemoBanner />
        <Topbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* Global Developer Attribution Footer */}
        <footer className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-600" />
            <span>
              Developed by{' '}
              <strong className="text-slate-900 font-bold">Mohd Shahvez</strong>{' '}
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] ml-1">
                2.9 Years Exp @ JPR Technosoft LLP
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <a
              href="https://www.linkedin.com/in/mohdshahvez1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <span>LinkedIn (mohdshahvez1)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="https://github.com/its-shahvez"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-800 hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <span>GitHub (its-shahvez)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};