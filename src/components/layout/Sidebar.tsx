import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FileMinus,
  FilePlus,
  Users,
  Truck,
  Package,
  CreditCard,
  BarChart3,
  Percent,
  ShieldCheck,
  Sparkles,
  Settings,
  X,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../../store/useAppStore';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
  greenDot?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoices, customers, products, lang } = useAppStore();

  const handleLogout = () => {
    setMobileOpen(false);
    toast.success(
      lang === 'en'
        ? 'Logged out safely. Redirecting to landing page...'
        : 'تم تسجيل الخروج بنجاح'
    );
    navigate('/login');
  };

  const navGroups: NavGroup[] = [
    {
      title: lang === 'en' ? 'MAIN' : 'الرئيسية',
      items: [
        { label: lang === 'en' ? 'Dashboard' : 'لوحة التحكم', path: '/dashboard', icon: LayoutDashboard },
        { label: lang === 'en' ? 'Invoices' : 'الفواتير', path: '/invoices', icon: FileText, badge: String(invoices.length + 133) },
        { label: lang === 'en' ? 'Credit Notes' : 'إشعارات دائنة', path: '/invoices?type=Credit', icon: FileMinus },
        { label: lang === 'en' ? 'Debit Notes' : 'إشعارات مدينة', path: '/invoices?type=Debit', icon: FilePlus },
      ],
    },
    {
      title: lang === 'en' ? 'SALES' : 'المبيعات',
      items: [
        { label: lang === 'en' ? 'Customers' : 'العملاء', path: '/customers', icon: Users, badge: String(customers.length + 18) },
        { label: lang === 'en' ? 'Suppliers' : 'الموردين', path: '/customers?tab=suppliers', icon: Truck },
        { label: lang === 'en' ? 'Products' : 'المنتجات', path: '/products', icon: Package, badge: String(products.length) },
        { label: lang === 'en' ? 'Payments' : 'المدفوعات', path: '/reports?tab=payments', icon: CreditCard },
      ],
    },
    {
      title: lang === 'en' ? 'FINANCE' : 'المالية والزكاة',
      items: [
        { label: lang === 'en' ? 'Reports' : 'التقارير', path: '/reports', icon: BarChart3 },
        { label: lang === 'en' ? 'VAT Return' : 'إقرار الضريبة', path: '/reports?tab=vat', icon: Percent },
        { label: lang === 'en' ? 'ZATCA Integration' : 'ربط فاتورة ZATCA', path: '/zatca', icon: ShieldCheck, greenDot: true },
      ],
    },
    {
      title: lang === 'en' ? 'SYSTEM' : 'النظام',
      items: [
        { label: lang === 'en' ? 'AI Assistant' : 'المساعد الذكي', path: '/ai-assistant', icon: Sparkles, badge: 'NEW' },
        { label: lang === 'en' ? 'Settings' : 'الإعدادات', path: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-600/20">
              ف
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Fatoorah Pro</h1>
              <p className="text-[11px] text-slate-400 font-medium">Saudi E-Invoicing</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, i) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname + location.search === item.path ||
                    (location.pathname === item.path && !location.search);
                  return (
                    <Link
                      key={i}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.greenDot && !item.badge && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Organization Card + Logout Button */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
              SA
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-900 truncate">Al Faisal Trading</p>
              <p className="text-[10px] text-emerald-700 font-medium">ZATCA Phase 2 Ready</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{lang === 'en' ? 'Sign Out / Logout' : 'تسجيل الخروج'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};