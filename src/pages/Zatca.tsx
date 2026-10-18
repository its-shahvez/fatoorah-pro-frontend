import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  Link2,
  ShieldAlert,
  Upload,
  Lock,
  Terminal,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatSAR } from '../lib/utils';

export const Zatca: React.FC = () => {
  const { invoices, org, lang } = useAppStore();

  const [env, setEnv] = useState<'MOCK' | 'SANDBOX' | 'PRODUCTION'>('MOCK');
  const [apiUrl, setApiUrl] = useState(
    'https://gw-fatoora.zatca.gov.sa/e-invoicing/developer-portal'
  );
  const [otp, setOtp] = useState('123345');
  const [csid, setCsid] = useState(
    'MIID3TCCAoWgAwIBAgIGAZK8f92xMAoGCCqGSM49BAMCMIGX...'
  );
  const [lastSync, setLastSync] = useState('Oct 15, 2026 — 14:42:19 UTC+3');

  // Blockchain Hash-Chain Tamper Simulator State
  const [isTampered, setIsTampered] = useState(false);

  const handleTestConnection = () => {
    setLastSync(new Date().toLocaleTimeString());
    toast.success('MOCK: ZATCA Fatoora Gateway Connection OK (Latency: 42ms)');
  };

  const handleGenerateCsid = () => {
    if (otp.length !== 6) {
      toast.error('ZATCA Onboarding requires a 6-digit Fatoora Portal OTP.');
      return;
    }
    setCsid(
      `MIID3TCCAoWgAwIBAgIGAZK_${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}==`
    );
    toast.success(
      'MOCK: Generated secp256k1 CSR & exchanged for Cryptographic Stamp (CSID)!'
    );
  };

  const chainInvoices = invoices.slice(0, 4).reverse();

  return (
    <div className="space-y-6">
      {/* Big Amber Warning Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-extrabold text-amber-950">
              ⚠️ Real ZATCA submission requires official Fatoora Portal onboarding
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              This environment runs a local cryptographic simulator (ECDSA secp256k1 +
              SHA-256 XML canonicalization). All clearances are marked as{' '}
              <strong>CLEARED (MOCK)</strong>.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-200 text-amber-950 shrink-0">
          PHASE 2 SIMULATOR
        </span>
      </div>

      {/* Row 1: Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Active Environment
            </span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-1">{env} MODE</h4>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              UBL 2.1 Schema Validator Active
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Gateway Status
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-lg font-extrabold text-slate-900">Ready & Online</h4>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Last Sync: {lastSync}</p>
          </div>
          <button
            onClick={handleTestConnection}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Test Ping
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400">
              Cryptographic Stamp
            </span>
            <h4 className="text-lg font-extrabold text-slate-900 mt-1">
              ECDSA secp256k1
            </h4>
            <p className="text-xs text-blue-600 font-mono mt-0.5">
              Device: 1-FATOORAH|2-PRO|3-V2
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <KeyRound className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* KILLER FEATURE: Interactive Blockchain Hash-Chain Verifier */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Live ZATCA Phase 2 Cryptographic Hash-Chain Ledger (PIH Verifier)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Every invoice embeds the SHA-256 hash of the previous invoice. Try
              simulating a database tamper below to see ZATCA anti-fraud detection in
              action!
            </p>
          </div>

          <button
            onClick={() => {
              setIsTampered(!isTampered);
              if (!isTampered) {
                toast.error(
                  'TAMPER DETECTED: Invoice #147 amount altered! Subsequent hash chain broken!'
                );
              } else {
                toast.success('Restored original immutable invoice hash-chain!');
              }
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm ${
              isTampered
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>
              {isTampered
                ? 'Restore Valid Hash Chain'
                : 'Simulate Database Tamper (Test)'}
            </span>
          </button>
        </div>

        {/* Visual Chain Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {chainInvoices.map((inv, idx) => {
            const isTargetTampered = isTampered && idx === 1;
            const isDownstreamBroken = isTampered && idx > 1;

            return (
              <div
                key={inv.id}
                className={`rounded-2xl border-2 p-4 space-y-3 transition-all relative ${
                  isTargetTampered
                    ? 'bg-red-50/90 border-red-500 shadow-lg shadow-red-500/10'
                    : isDownstreamBroken
                    ? 'bg-amber-50/70 border-red-300'
                    : 'bg-slate-50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-slate-900 text-white">
                    ICV #{inv.icv}
                  </span>
                  {isTargetTampered ? (
                    <span className="text-[10px] font-extrabold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      TAMPERED!
                    </span>
                  ) : isDownstreamBroken ? (
                    <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      PIH MISMATCH
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">{inv.number}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {inv.customerName}
                  </p>
                  <p
                    className={`text-sm font-extrabold mt-1 ${
                      isTargetTampered
                        ? 'text-red-600 line-through'
                        : 'text-emerald-700'
                    }`}
                  >
                    {formatSAR(inv.total)}
                  </p>
                  {isTargetTampered && (
                    <p className="text-xs font-extrabold text-red-700">
                      Altered to: SAR 1,000.00 ❌
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-400 block">Prev Hash (PIH):</span>
                    <span className="text-slate-700 break-all">
                      {inv.previousHash.slice(0, 22)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current XML Hash:</span>
                    <span
                      className={`font-bold break-all ${
                        isTargetTampered ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {isTargetTampered
                        ? 'ERR_INVALID_SHA256_99X=='
                        : `${inv.xmlHash.slice(0, 22)}...`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration & CSID Onboarding Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: API & Certificate Config */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            ZATCA Integration & CSID Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Target Environment
              </label>
              <select
                value={env}
                onChange={(e) =>
                  setEnv(e.target.value as 'MOCK' | 'SANDBOX' | 'PRODUCTION')
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold"
              >
                <option value="MOCK">MOCK (Local Cryptographic Simulator)</option>
                <option value="SANDBOX">SANDBOX (ZATCA Developer Portal)</option>
                <option value="PRODUCTION">PRODUCTION (Fatoora Core)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Taxpayer 15-Digit VAT Number
              </label>
              <input
                type="text"
                readOnly
                value={org.vat}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              ZATCA Fatoora Gateway Endpoint URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Cryptographic Stamp Identifier (CSID / X.509 Binary Security Token)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                value={csid}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() =>
                  toast.success('Uploaded X.509 Certificate & Private Key (Mock)')
                }
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" /> Upload .pem
              </button>
            </div>
          </div>

          {/* OTP Onboarding Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Onboard New POS / EGS Device via Fatoora OTP
              </p>
              <p className="text-[11px] text-slate-400">
                Enter 6-digit OTP from ZATCA portal to generate CSR & fetch CSID
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123345"
                className="w-28 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center font-mono text-sm font-bold tracking-widest"
              />
              <button
                type="button"
                onClick={handleGenerateCsid}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold whitespace-nowrap"
              >
                Issue CSID
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent ZATCA Submissions Table */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
            Recent Gateway Submissions
          </h3>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{inv.number}</span>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ICV #{inv.icv} • {inv.type}
                  </p>
                </div>
                <StatusBadge status={inv.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};