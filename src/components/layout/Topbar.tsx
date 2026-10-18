import React from 'react';
import { Search, Bell, Menu, Globe, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from '../../store/useAppStore';

interface TopbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang } = useAppStore();

  const getBreadcrumb = () => {
    const path = location.pathname.replace('/', '');
    if (!path || path === 'dashboard') return lang === 'en' ? 'Dashboard' : 'لوحة التحكم';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const handleLogout = () => {
    toast.success(
      lang === 'en' ? 'Signed out successfully!' : 'تم تسجيل الخروج بنجاح'
    );
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden text-slate-600 hover:text-slate-900"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 capitalize">{getBreadcrumb()}</h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            Home / <span className="text-slate-600">{getBreadcrumb()}</span>
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              lang === 'en'
                ? 'Search invoices, customers, products... (Ctrl+K)'
                : 'بحث في الفواتير والعملاء...'
            }
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-600" />
          <span>{lang === 'en' ? 'عربي' : 'English'}</span>
        </button>

        <button className="relative p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-emerald-600/20">
            AF
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-tight">Ahmed Al-Faisal</p>
            <p className="text-[10px] text-slate-400">Super Admin</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out to Landing Page"
            className="p-2 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-all ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};