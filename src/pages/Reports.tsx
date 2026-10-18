import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Percent,
  CreditCard,
  FileSpreadsheet,
  FileText,
  Download,
  TrendingUp,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { formatSAR } from '../lib/utils';
import { MONTHLY_SALES_DATA } from '../lib/mockData';

export const Reports: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const { org, invoices, lang } = useAppStore();
  const [activeTab, setActiveTab] = useState<'sales' | 'vat' | 'payments'>('sales');

  useEffect(() => {
    if (tabParam === 'vat' || tabParam === 'payments' || tabParam === 'sales') {
      setActiveTab(tabParam);
    } else {
      setActiveTab('sales');
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'sales' | 'vat' | 'payments') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // VAT Return Calculations (ZATCA Form VAT-01)
  const clearedInvoices = invoices.filter((i) => i.status === 'CLEARED');
  const standardSales = clearedInvoices.reduce((s, i) => s + i.taxableAmount, 0);
  const outputVat = clearedInvoices.reduce((s, i) => s + i.vatAmount, 0);
  const inputPurchases = 42500;
  const inputVatRecoverable = inputPurchases * 0.15;
  const netVatPayable = Math.max(0, outputVat - inputVatRecoverable);

  const handleExport = (format: 'CSV' | 'Excel' | 'PDF') => {
    toast.success(`Exported ${activeTab.toUpperCase()} report as ${format}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              {lang === 'en'
                ? 'Fiscal Reports, VAT Returns & Payments'
                : 'التقارير المالية وإقرارات الضريبة والمدفوعات'}
            </h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Q4 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en'
              ? 'Automated ZATCA VAT Return Form 01 computations and payment collections ledger'
              : 'حسابات الإقرار الضريبي التلقائية وسجل التحصيل المالي'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Card with 3 Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 pt-3 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'sales', label: 'Sales & Revenue Analytics', icon: BarChart3 },
            { id: 'vat', label: 'ZATCA VAT Return (Form 01)', icon: Percent },
            { id: 'payments', label: 'Payments & Collections', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as 'sales' | 'vat' | 'payments')}
                className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-xl'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SALES REPORT */}
        {activeTab === 'sales' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 uppercase font-bold">
                  Cleared Taxable Sales
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {formatSAR(standardSales)}
                </h3>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs Q3
                </span>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 uppercase font-bold">
                  Output VAT (15%)
                </span>
                <h3 className="text-2xl font-extrabold text-blue-600 mt-1">
                  {formatSAR(outputVat)}
                </h3>
                <span className="text-xs text-slate-400 mt-1 block">
                  ZATCA Category S (Standard)
                </span>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-400 uppercase font-bold">
                  Gross Invoiced (Inc. VAT)
                </span>
                <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">
                  {formatSAR(standardSales + outputVat)}
                </h3>
                <span className="text-xs text-slate-400 mt-1 block">
                  Across {clearedInvoices.length} cleared invoices
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#059669"
                    fill="#10b981"
                    fillOpacity={0.15}
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: ZATCA VAT RETURN FORM 01 */}
        {activeTab === 'vat' && (
          <div className="p-6 space-y-6">
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg">
                  %
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    ZATCA Official VAT Return — الإقرار الضريبي
                  </h3>
                  <p className="text-xs text-slate-400">
                    Taxpayer: {org.name} ({org.nameAr}) • VAT: {org.vat}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  toast.success('MOCK: VAT Return Form 01 submitted to ZATCA Portal!')
                }
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>File VAT Return (MOCK)</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                    <th className="py-3.5 px-4">Box #</th>
                    <th className="py-3.5 px-4">ZATCA VAT Return Line Description</th>
                    <th className="py-3.5 px-4 text-right">Taxable Amount (SAR)</th>
                    <th className="py-3.5 px-4 text-right">Adjustment</th>
                    <th className="py-3.5 px-4 text-right">VAT Amount (SAR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                      Box 1
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Standard Rated Sales (15% — المبيعات الخاضعة للنسبة الأساسية)
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold">
                      {formatSAR(standardSales)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">SAR 0.00</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatSAR(outputVat)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      Box 2
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      Zero-Rated Domestic Sales (0% — المبيعات الخاضعة لنسبة الصفر)
                    </td>
                    <td className="py-3.5 px-4 text-right">SAR 3,600.00</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">SAR 0.00</td>
                    <td className="py-3.5 px-4 text-right font-bold">SAR 0.00</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                      Box 3
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      Exempt Sales (المبيعات المعفاة)
                    </td>
                    <td className="py-3.5 px-4 text-right">SAR 1,500.00</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">SAR 0.00</td>
                    <td className="py-3.5 px-4 text-right font-bold">SAR 0.00</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                      Box 7
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      Standard Rated Domestic Purchases (15% Input VAT — المشتريات)
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold">
                      {formatSAR(inputPurchases)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">SAR 0.00</td>
                    <td className="py-3.5 px-4 text-right font-bold text-blue-600">
                      - {formatSAR(inputVatRecoverable)}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/80 text-sm">
                    <td className="py-4 px-4 font-mono font-extrabold text-emerald-800">
                      Box 14
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-950" colSpan={3}>
                      Net VAT Due Payable to ZATCA (صافي الضريبة المستحقة)
                    </td>
                    <td className="py-4 px-4 text-right font-extrabold text-emerald-700">
                      {formatSAR(netVatPayable)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & COLLECTIONS */}
        {activeTab === 'payments' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Bank Transfers, SADAD & MADA Settlements
              </h3>
              <button
                onClick={() => toast.success('Recorded new bank receipt!')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                + Record Payment
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Invoice Reference</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Amount Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clearedInvoices.map((inv, idx) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        RCP-2026-0{idx + 11}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-700">
                        {inv.number}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {inv.customerName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {idx % 2 === 0 ? 'SARIE Bank Transfer' : 'SADAD Corporate'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">{inv.date}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                        {formatSAR(inv.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};