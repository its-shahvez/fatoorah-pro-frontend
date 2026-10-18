import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  MapPin,
  Mail,
  Phone,
  Building2,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { formatSAR } from '../lib/utils';

export const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { customers, addCustomer, lang } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [vat, setVat] = useState('300');
  const [city, setCity] = useState('Riyadh');
  const [shortAddress, setShortAddress] = useState('RRRD2929');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+966 11 ');

  const cities = useMemo(() => {
    const unique = Array.from(new Set(customers.map((c) => c.city)));
    return ['ALL', ...unique];
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesCity = cityFilter === 'ALL' || c.city === cityFilter;
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.nameAr.includes(searchQuery) ||
        c.vat.includes(searchQuery) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCity && matchesSearch;
    });
  }, [customers, cityFilter, searchQuery]);

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (vat.length !== 15 || !vat.startsWith('3') || !vat.endsWith('3')) {
      toast.error(
        'ZATCA Rule: Saudi VAT number must be 15 digits starting and ending with 3!'
      );
      return;
    }

    addCustomer({
      name,
      nameAr: nameAr || 'شركة سعودية',
      vat,
      city,
      shortAddress,
      email: email || 'accounts@company.sa',
      phone: phone || '+966 11 000 0000',
    });

    toast.success(`Customer "${name}" registered in ZATCA directory!`);
    setModalOpen(false);
    setName('');
    setNameAr('');
    setVat('300');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-slate-900">
              {lang === 'en' ? 'B2B Customers & Taxpayers' : 'العملاء والمكلفين الضريبيين'}
            </h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {customers.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en'
              ? 'Verified Saudi VAT numbers and National Short Addresses for ZATCA Phase 2 clearance'
              : 'سجل العملاء المعتمدين مع الأرقام الضريبية والعناوين الوطنية'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>{lang === 'en' ? '+ Add Customer' : '+ إضافة عميل'}</span>
        </button>
      </div>

      {/* Search & City Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name (EN/AR), 15-digit VAT, or city..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                cityFilter === c
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c === 'ALL' ? 'All Cities' : c}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                    {getInitials(cust.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-snug">
                      {cust.name}
                    </h3>
                    <p className="text-xs font-arabic text-slate-500 font-semibold mt-0.5">
                      {cust.nameAr}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> VAT Active
                </span>
              </div>

              {/* ZATCA VAT & Address Box */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">ZATCA VAT No:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {cust.vat}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> City / National Addr:
                  </span>
                  <span className="font-bold text-slate-700">
                    {cust.city} ({cust.shortAddress || 'RRRD2929'})
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cust.phone}</span>
                </div>
              </div>
            </div>

            {/* Card Footer: Total Invoiced + Quick Invoice Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Invoiced
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {formatSAR(cust.totalInvoiced)}
                </span>
              </div>
              <button
                onClick={() => navigate('/invoices/new')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Issue Invoice</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCustomer}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">
                  Add B2B Customer (ZATCA Taxpayer)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Company Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Red Sea Global LLC"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Company Name (Arabic) *
                </label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="شركة البحر الأحمر العالمية"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  15-Digit Saudi VAT Number *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={vat}
                  onChange={(e) => setVat(e.target.value)}
                  placeholder="300123456700003"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                />
                <span className="text-[10px] text-slate-400">
                  Must start with 3 and end with 3 (15 digits)
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  City & National Short Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Riyadh"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    maxLength={8}
                    value={shortAddress}
                    onChange={(e) => setShortAddress(e.target.value.toUpperCase())}
                    placeholder="RRRD2929"
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Billing Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ap@redseaglobal.sa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Save Customer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};