import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Download,
  Copy,
  CheckCircle2,
  FileCode2,
  QrCode,
  ShieldCheck,
  History,
  FileText,
  Printer,
  AlertTriangle,
  Link2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  formatSAR,
  decodeZatcaTlv,
  generateUblXml,
  toHijriDate,
} from '../lib/utils';

type DetailTab = 'overview' | 'xml' | 'qr' | 'zatca' | 'audit';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as DetailTab) || 'overview';

  const { invoices, org, updateInvoiceStatus } = useAppStore();
  const [activeTab, setActiveTab] = useState<DetailTab>(initialTab);

  const invoice = useMemo(
    () => invoices.find((inv) => inv.id === id) || invoices[0],
    [invoices, id]
  );

  const decodedTlv = useMemo(
    () => (invoice ? decodeZatcaTlv(invoice.qrTlvBase64) : []),
    [invoice]
  );

  const ublXml = useMemo(
    () => (invoice ? generateUblXml(invoice, org) : ''),
    [invoice, org]
  );

  if (!invoice) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-slate-600 font-semibold">Invoice not found.</p>
        <button
          onClick={() => navigate('/invoices')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  const zatcaMockJson = {
    validationResults: {
      infoMessages: [
        {
          type: 'INFO',
          code: 'XSD_ZATCA_VALID',
          category: 'XSD validation',
          message:
            'Complied with UBL 2.1 standards in line with ZATCA specifications',
          status: 'PASS',
        },
      ],
      warningMessages: [],
      errorMessages: [],
      status: 'PASS',
    },
    clearanceStatus:
      invoice.type === 'Standard' ? 'CLEARED (MOCK)' : 'REPORTED (MOCK)',
    clearedInvoiceXmlBase64: btoa(ublXml.slice(0, 240)) + '...',
    cryptographicStamp: {
      algorithm: 'ECDSA-secp256k1-SHA256',
      icv: invoice.icv,
      uuid: invoice.uuid,
      previousInvoiceHash: invoice.previousHash,
      currentInvoiceHash: invoice.xmlHash,
      qrCodePayload: invoice.qrTlvBase64,
    },
    environment: 'ZATCA_SANDBOX_SIMULATOR_V2',
  };

  const handleDownloadXml = () => {
    const blob = new Blob([ublXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.number}_ZATCA_UBL21.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${invoice.number}_ZATCA_UBL21.xml`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/invoices')}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-extrabold text-slate-900">
                {invoice.number}
              </h2>
              <StatusBadge status={invoice.status} />
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                ICV #{invoice.icv}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              UUID: <span className="font-mono">{invoice.uuid}</span> • Issued{' '}
              {invoice.date} ({toHijriDate(invoice.date)})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {invoice.status !== 'CLEARED' && (
            <button
              onClick={() => {
                updateInvoiceStatus(invoice.id, 'CLEARED');
                toast.success(
                  `MOCK: ${invoice.number} stamped & cleared with ZATCA!`
                );
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit to ZATCA (MOCK)</span>
            </button>
          )}
          <button
            onClick={() => {
              window.print();
              toast.success('Opening print/PDF dialog...');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print / PDF-A3</span>
          </button>
          <button
            onClick={handleDownloadXml}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export XML</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 pt-3 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview (PDF View)', icon: FileText },
            { id: 'xml', label: 'UBL 2.1 XML', icon: FileCode2 },
            { id: 'qr', label: 'TLV QR Inspector', icon: QrCode },
            { id: 'zatca', label: 'ZATCA Response', icon: ShieldCheck },
            { id: 'audit', label: 'Audit & Hash Trail', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DetailTab)}
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

        {/* TAB 1: OVERVIEW (Bilingual A4 Tax Invoice) */}
        {activeTab === 'overview' && (
          <div className="p-6 sm:p-10 bg-slate-100/70 flex justify-center">
            <div className="bg-white max-w-4xl w-full rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-10 space-y-8">
              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-emerald-600 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg">
                      ف
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {invoice.type === 'Standard'
                          ? 'TAX INVOICE / فاتورة ضريبية'
                          : 'SIMPLIFIED TAX INVOICE / فاتورة ضريبية مبسطة'}
                      </h3>
                      <p className="text-xs text-slate-400">
                        ZATCA Phase 2 (Fatoora) Compliant Document
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 space-y-1 text-xs text-slate-600">
                    <p>
                      <span className="font-bold text-slate-800">Invoice Number:</span>{' '}
                      {invoice.number}
                    </p>
                    <p>
                      <span className="font-bold text-slate-800">Issue Date:</span>{' '}
                      {invoice.date} {invoice.time} ({toHijriDate(invoice.date)})
                    </p>
                    <p>
                      <span className="font-bold text-slate-800">UUID:</span>{' '}
                      <span className="font-mono text-[11px]">{invoice.uuid}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <QRCodeSVG value={invoice.qrTlvBase64} size={112} />
                  <span className="text-[10px] font-mono text-slate-400 mt-1.5">
                    ZATCA TLV Base64 QR
                  </span>
                </div>
              </div>

              {/* Seller & Buyer Bilingual Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] font-bold uppercase text-emerald-700 border-b border-slate-200 pb-1.5 mb-2">
                    <span>Seller / Supplier</span>
                    <span className="font-arabic">بيانات المورد</span>
                  </div>
                  <p className="font-bold text-sm text-slate-900">{org.name}</p>
                  <p className="font-arabic font-bold text-sm text-slate-800">
                    {org.nameAr}
                  </p>
                  <p className="text-slate-600">
                    {org.buildingNo} {org.address}, {org.city} {org.postalCode}
                  </p>
                  <p className="font-mono font-bold text-slate-800 pt-1">
                    VAT Number: <span className="text-emerald-700">{org.vat}</span>
                  </p>
                  <p className="font-mono text-slate-500">CRN: {org.cr}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[11px] font-bold uppercase text-emerald-700 border-b border-slate-200 pb-1.5 mb-2">
                    <span>Buyer / Customer</span>
                    <span className="font-arabic">بيانات العميل</span>
                  </div>
                  <p className="font-bold text-sm text-slate-900">
                    {invoice.customerName}
                  </p>
                  <p className="font-arabic font-bold text-sm text-slate-800">
                    {invoice.customerNameAr}
                  </p>
                  <p className="text-slate-600">Kingdom of Saudi Arabia (KSA)</p>
                  <p className="font-mono font-bold text-slate-800 pt-1">
                    Buyer VAT:{' '}
                    <span className="text-emerald-700">{invoice.customerVat}</span>
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="py-3 px-4 rounded-tl-xl">#</th>
                      <th className="py-3 px-4">Description / البيان</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-center">VAT Cat</th>
                      <th className="py-3 px-4 text-right">VAT (15%)</th>
                      <th className="py-3 px-4 text-right rounded-tr-xl">
                        Subtotal (Inc. VAT)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 text-center font-semibold">
                          {item.qty}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {formatSAR(item.price)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                            {item.vatCategory}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-700">
                          {formatSAR(item.vatAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                          {formatSAR(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Hash Chain & Monetary Totals Footer */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-200">
                <div className="md:col-span-7 space-y-2 text-xs text-slate-500">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ZATCA Cryptographic Hash-Chain Stamp</span>
                    </p>
                    <p className="font-mono text-[10px] break-all">
                      <span className="font-bold text-slate-600">PIH (Prev):</span>{' '}
                      {invoice.previousHash}
                    </p>
                    <p className="font-mono text-[10px] break-all">
                      <span className="font-bold text-slate-600">XML Hash:</span>{' '}
                      {invoice.xmlHash}
                    </p>
                  </div>
                  <p className="italic">{invoice.notes}</p>
                </div>

                <div className="md:col-span-5 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal (Excl. VAT)</span>
                    <span className="font-semibold">
                      {formatSAR(invoice.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Discount / Allowance</span>
                    <span className="font-semibold">
                      {formatSAR(invoice.discountTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Total VAT (15% / ضريبة القيمة المضافة)</span>
                    <span className="font-bold text-blue-600">
                      {formatSAR(invoice.vatAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-emerald-700 pt-2.5 border-t border-slate-200">
                    <span>Total Payable / الإجمالي</span>
                    <span>{formatSAR(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: UBL 2.1 XML */}
        {activeTab === 'xml' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  ZATCA UBL 2.1 XML Payload (OASIS Standard)
                </h3>
                <p className="text-xs text-slate-400">
                  Includes cac:AdditionalDocumentReference for ICV, PIH, and TLV QR
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ublXml);
                  toast.success('UBL 2.1 XML copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy XML</span>
              </button>
            </div>
            <pre className="p-6 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {ublXml}
            </pre>
          </div>
        )}

        {/* TAB 3: QR & TLV DECODER */}
        {activeTab === 'qr' && (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                <QRCodeSVG value={invoice.qrTlvBase64} size={220} level="M" />
              </div>
              <div className="w-full">
                <p className="text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Raw Base64 TLV String:
                </p>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl break-all">
                  {invoice.qrTlvBase64}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Decoded Tag-Length-Value (TLV) Byte Structure
              </h3>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                      <th className="py-3 px-4">Tag (Hex)</th>
                      <th className="py-3 px-4">ZATCA Field Name</th>
                      <th className="py-3 px-4">Length (Bytes)</th>
                      <th className="py-3 px-4">UTF-8 Decoded Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {decodedTlv.map((row) => (
                      <tr key={row.tag}>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          Tag {row.tag} ({row.hexTag})
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {row.label}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">
                          {row.byteLength} bytes
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ZATCA RESPONSE */}
        {activeTab === 'zatca' && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-amber-900 text-xs font-medium">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>SANDBOX SIMULATION:</strong> This JSON payload represents a
                simulated clearance/reporting response from the ZATCA Fatoora portal. No
                live government submission occurred.
              </span>
            </div>
            <pre className="p-6 rounded-2xl bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {JSON.stringify(zatcaMockJson, null, 2)}
            </pre>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Immutable Cryptographic Event Log
            </h3>
            <div className="space-y-3">
              {invoice.auditTrail.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {entry.action}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {entry.details}
                    </p>
                    <p className="text-xs text-slate-400">Actor: {entry.actor}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {entry.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};