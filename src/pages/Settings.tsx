import React, { useState } from 'react';
import {
  Building2,
  FileText,
  Percent,
  Users,
  Bell,
  Save,
  Upload,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';

type SettingsTab = 'company' | 'invoice' | 'tax' | 'users' | 'notifications';

export const Settings: React.FC = () => {
  const { org, updateOrg, lang } = useAppStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');

  const [formState, setFormState] = useState(org);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrg(formState);
    toast.success('Organization & ZATCA Taxpayer settings updated!');
  };

  const teamUsers = [
    {
      name: 'Ahmed Al-Faisal',
      email: 'ahmed@fatoorah.pro',
      role: 'Super Admin',
      status: 'Active',
    },
    {
      name: 'Fatima Al-Harbi',
      email: 'fatima.finance@fatoorah.pro',
      role: 'VAT Accountant',
      status: 'Active',
    },
    {
      name: 'Omar Al-Qahtani',
      email: 'omar.pos@fatoorah.pro',
      role: 'POS Cashier',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {lang === 'en' ? 'Organization & ZATCA Settings' : 'إعدادات المنشأة والضريبة'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your legal Saudi entity details, VAT registration, and role
            permissions
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 px-6 pt-3 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'company', label: 'Company Profile', icon: Building2 },
            { id: 'invoice', label: 'Invoice Numbering', icon: FileText },
            { id: 'tax', label: 'VAT & ZATCA Rules', icon: Percent },
            { id: 'users', label: 'Users & Roles', icon: Users },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
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

        {/* TAB 1, 2, 3: COMPANY / INVOICE / TAX FORM */}
        {(activeTab === 'company' ||
          activeTab === 'invoice' ||
          activeTab === 'tax') && (
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                ف
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{formState.name}</h4>
                <p className="text-xs font-arabic text-slate-500">
                  {formState.nameAr}
                </p>
                <button
                  type="button"
                  onClick={() => toast.success('Company logo updated!')}
                  className="mt-2 px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Legal Name (English)
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Legal Name (Arabic / الاسم الرسمي)
                </label>
                <input
                  type="text"
                  value={formState.nameAr}
                  onChange={(e) =>
                    setFormState({ ...formState, nameAr: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-arabic font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  15-Digit ZATCA VAT Registration No.
                </label>
                <input
                  type="text"
                  maxLength={15}
                  value={formState.vat}
                  onChange={(e) =>
                    setFormState({ ...formState, vat: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Commercial Registration (CRN)
                </label>
                <input
                  type="text"
                  value={formState.cr}
                  onChange={(e) =>
                    setFormState({ ...formState, cr: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  City & District Street
                </label>
                <input
                  type="text"
                  value={formState.address}
                  onChange={(e) =>
                    setFormState({ ...formState, address: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Building No / Postal Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formState.buildingNo}
                    onChange={(e) =>
                      setFormState({ ...formState, buildingNo: e.target.value })
                    }
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                  />
                  <input
                    type="text"
                    value={formState.postalCode}
                    onChange={(e) =>
                      setFormState({ ...formState, postalCode: e.target.value })
                    }
                    className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Invoice Number Prefix
                </label>
                <input
                  type="text"
                  value={formState.invoicePrefix}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      invoicePrefix: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Default Saudi VAT Rate (%)
                </label>
                <input
                  type="number"
                  value={formState.defaultVatRate}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      defaultVatRate: Number(e.target.value),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: USERS & ROLES */}
        {activeTab === 'users' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Authorized Users & ZATCA Signing Roles
              </h3>
              <button
                onClick={() => toast.success('Invitation email sent!')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                + Invite User
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-bold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamUsers.map((u, i) => (
                    <tr key={i}>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {u.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <select
                          defaultValue={u.role}
                          onChange={() => toast.success(`Updated role for ${u.name}`)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-700"
                        >
                          <option>Super Admin</option>
                          <option>VAT Accountant</option>
                          <option>POS Cashier</option>
                          <option>Auditor (Read-Only)</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-4">
            {[
              {
                title: 'ZATCA Rejection Alerts',
                desc: 'Notify immediately via email/SMS if an invoice fails UBL 2.1 validation',
              },
              {
                title: '24-Hour Simplified B2C Sync Reminder',
                desc: 'Alert if POS simplified invoices have not been reported within 20 hours',
              },
              {
                title: 'CSID Certificate Expiry Warning',
                desc: 'Notify 30 days before X.509 cryptographic stamp expires',
              },
            ].map((item, i) => (
              <label
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  onChange={() => toast.success('Notification preference saved')}
                  className="w-4 h-4 accent-emerald-600"
                />
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};