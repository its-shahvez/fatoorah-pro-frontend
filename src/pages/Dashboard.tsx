import React from 'react';
import {
  FileText,
  Percent,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAppStore } from '../store/useAppStore';
import{ MONTHLY_SALES_DATA } from '../lib/mockData';
import { formatSAR } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, lang } = useAppStore();

  const totalSales = 245800;
  const vatCollected = 32100;
  const pendingCount = invoices.filter((i) => i.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {lang === 'en' ? 'Welcome back, Ahmed 👋' : 'أهلاً بك، أحمد 👋'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en'
              ? 'Here is your ZATCA e-invoicing fiscal performance overview for October 2026.'
              : 'نظرة عامة على أداء الفوترة الإلكترونية لشهر أكتوبر 2026'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/invoices/new')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'en' ? 'New Invoice' : 'فاتورة جديدة'}</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={lang === 'en' ? 'Total Sales' : 'إجمالي المبيعات'}
          value={formatSAR(totalSales)}
          change="+12.5%"
          isPositive={true}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title={lang === 'en' ? 'VAT Collected' : 'ضريبة القيمة المضافة'}
          value={formatSAR(vatCollected)}
          change="+8.2%"
          isPositive={true}
          icon={Percent}
          color="blue"
        />
        <StatCard
          title={lang === 'en' ? 'Total Invoices' : 'إجمالي الفواتير'}
          value={String(invoices.length + 133)}
          change="+5.1%"
          isPositive={true}
          icon={FileText}
          color="purple"
        />
        <StatCard
          title={lang === 'en' ? 'Pending Clearance' : 'قيد التدقيق'}
          value={String(pendingCount + 2)}
          change="-3.4%"
          isPositive={false}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Row 2: 2 Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Monthly Sales Trend (SAR)' : 'اتجاه المبيعات الشهري'}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              2026 FY
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'VAT Collected per Month' : 'الضريبة المحصلة شهرياً'}
            </h3>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              15% Standard
            </span>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="vat" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'en' ? 'Recent ZATCA Invoices' : 'أحدث الفواتير'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en' ? 'Latest generated standard and simplified tax invoices' : 'آخر الفواتير الضريبية المنشأة'}
            </p>
          </div>
          <button
            onClick={() => navigate('/invoices')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase font-semibold border-b border-slate-200">
                <th className="py-3 px-6">Invoice #</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Total (SAR)</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {invoices.slice(0, 5).map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => navigate(`/invoices`)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6 font-semibold text-slate-900">{inv.number}</td>
                  <td className="py-4 px-6 font-medium text-slate-700">{inv.customerName}</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{inv.date}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">{formatSAR(inv.total)}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: AI Assistant Promo Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg">Fatoorah AI Assistant (New)</h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Upload unstructured PDFs or type natural prompts to automatically draft compliant ZATCA invoices in seconds.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/ai-assistant')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all shrink-0"
        >
          Try AI Assistant
        </button>
      </div>
    </div>
  );
};
 
 
 
 
 
 
 
 
 
 
 
 
 

