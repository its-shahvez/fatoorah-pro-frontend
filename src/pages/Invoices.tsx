import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Download,
  QrCode,
  FileCode2,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatSAR, toHijriDate } from '../lib/utils';
import type { InvoiceStatus, InvoiceType } from '../types';

export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTypeParam = searchParams.get('type') as InvoiceType | null;

  const { invoices, updateInvoiceStatus, lang } = useAppStore();

  const [activeTab, setActiveTab] = useState<'ALL' | InvoiceType>(
    initialTypeParam || 'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');

  const tabs: ('ALL' | InvoiceType)[] = [
    'ALL',
    'Standard',
    'Simplified',
    'Credit',
    'Debit',
  ];

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesTab = activeTab === 'ALL' || inv.type === activeTab;
      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchesSearch =
        inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customerNameAr.includes(searchQuery);
      return matchesTab && matchesStatus && matchesSearch;
    });
  }, [invoices, activeTab, statusFilter, searchQuery]);

  const handleQuickClear = (e: React.MouseEvent, id: string, number: string) => {
    e.stopPropagation();
    updateInvoiceStatus(id, 'CLEARED');
    toast.success(`MOCK: ${number} stamped & cleared with ZATCA Sandbox!`);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-slate-900">
                {lang === 'en' ? 'E-Invoices Ledger' : 'سجل الفواتير الإلكترونية'}
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {filteredInvoices.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'en'
                ? 'ZATCA Phase 2 UBL 2.1 XML & Cryptographic Hash-Chain Ledger'
                : 'فواتير ضريبية ومبسطة متوافقة مع المرحلة الثانية لهيئة الزكاة'}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/invoices/new')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'en' ? 'New Invoice' : 'إنشاء فاتورة جديدة'}</span>
        </button>
      </div>

      {/* Tabs + Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Type Tabs */}
        <div className="border-b border-slate-200 px-6 pt-4 flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab === 'ALL' ? (lang === 'en' ? 'All Invoices' : 'جميع الفواتير') : tab}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Search by Invoice # or Customer name...'
                  : 'بحث برقم الفاتورة أو اسم العميل...'
              }
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | InvoiceStatus)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
            >
              <option value="ALL">All Statuses</option>
              <option value="CLEARED">CLEARED (MOCK)</option>
              <option value="VALIDATED">VALIDATED</option>
              <option value="PENDING">PENDING</option>
              <option value="DRAFT">DRAFT</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold border-b border-slate-200">
                <th className="py-3.5 px-6">ICV / Invoice #</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Type</th>
                <th className="py-3.5 px-6">Issue Date (Gregorian / Hijri)</th>
                <th className="py-3.5 px-6">VAT (15%)</th>
                <th className="py-3.5 px-6">Total</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                  className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                        #{inv.icv}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {inv.number}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-800">{inv.customerName}</p>
                    <p className="text-xs text-slate-400 font-arabic">{inv.customerNameAr}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                        inv.type === 'Standard'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          : inv.type === 'Simplified'
                          ? 'bg-teal-50 text-teal-700 border-teal-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-xs font-semibold text-slate-700">{inv.date}</p>
                    <p className="text-[11px] text-slate-400">{toHijriDate(inv.date)}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {formatSAR(inv.vatAmount)}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {formatSAR(inv.total)}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inv.status !== 'CLEARED' && (
                        <button
                          onClick={(e) => handleQuickClear(e, inv.id, inv.number)}
                          title="Quick Clear with ZATCA (Mock)"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/invoices/${inv.id}?tab=qr`);
                        }}
                        title="Inspect TLV QR"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/invoices/${inv.id}?tab=xml`);
                        }}
                        title="View UBL 2.1 XML"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                      >
                        <FileCode2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/invoices/${inv.id}`);
                        }}
                        title="Open Invoice"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-emerald-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Downloading PDF/A-3 for ${inv.number}...`);
                        }}
                        title="Download PDF/A-3"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredInvoices.length} of {invoices.length} ZATCA records</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toast('Page 1 selected')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold"
            >
              1
            </button>
            <button
              onClick={() => toast('All demo records are displayed on Page 1')}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 font-semibold"
            >
              2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};