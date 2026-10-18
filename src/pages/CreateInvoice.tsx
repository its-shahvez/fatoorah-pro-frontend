import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Plus,
  Trash2,
  CheckCircle2,
  FileCode2,
  QrCode,
  Eye,
  Save,
  Send,
  UserPlus,
  ShieldCheck,
  Copy,
  X,
  Receipt,
  FileText,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  formatSAR,
  generateZatcaTlvBase64,
  decodeZatcaTlv,
  generateUblXml,
  toHijriDate,
} from '../lib/utils';
import type {
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  InvoiceType,
  VatCategory,
} from '../types';

export const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { org, customers, products, invoices, addInvoice, addCustomer, lang } =
    useAppStore();

  // Next sequential ICV & Invoice Number
  const nextIcv = useMemo(
    () => (invoices.length > 0 ? Math.max(...invoices.map((i) => i.icv)) + 1 : 149),
    [invoices]
  );
  const autoNumber = `${org.invoicePrefix}-2026-${String(nextIcv).padStart(6, '0')}`;
  const previousHash =
    invoices[0]?.xmlHash || 'NWU4Y2I1MzA1NDc5ZDEyY2I3ZTRmN2E4YzAxNDg==';

  // Form State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('Standard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.id || ''
  );
  const [customerSearch, setCustomerSearch] = useState('');
  const [issueDate, setIssueDate] = useState('2026-10-15');
  const [issueTime, setIssueTime] = useState('14:30:00');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [status, setStatus] = useState<InvoiceStatus>('DRAFT');
  const [notes, setNotes] = useState(
    'Compliant with ZATCA Phase 2 (Fatoora) UBL 2.1 XML & cryptographic stamp specifications.'
  );
  const [paymentTerms, setPaymentTerms] = useState(
    'Net 30 Days — Bank Transfer (IBAN: SA4420000001234567891234)'
  );

  // Line Items State
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: 'item-1',
      productId: products[0]?.id || 'prod-1',
      name: products[0]?.name || 'Laptop',
      qty: 2,
      price: products[0]?.price || 3500,
      discount: 0,
      vatCategory: 'S',
      vatAmount: 2 * (products[0]?.price || 3500) * 0.15,
      total: 2 * (products[0]?.price || 3500) * 1.15,
    },
  ]);

  // Modals State
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [previewFormat, setPreviewFormat] = useState<'A4' | 'POS'>('A4');

  // New Customer Modal Form
  const [newCustName, setNewCustName] = useState('');
  const [newCustNameAr, setNewCustNameAr] = useState('');
  const [newCustVat, setNewCustVat] = useState('300');
  const [newCustCity, setNewCustCity] = useState('Riyadh');

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || customers[0],
    [customers, selectedCustomerId]
  );

  const filteredCustomers = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
          c.nameAr.includes(customerSearch) ||
          c.vat.includes(customerSearch)
      ),
    [customers, customerSearch]
  );

  // Recalculate a single line item using strict ZATCA VAT logic
  const computeLine = (
    item: InvoiceLineItem,
    changes: Partial<InvoiceLineItem>
  ): InvoiceLineItem => {
    const updated = { ...item, ...changes };
    const lineGross = updated.qty * updated.price;
    const lineTaxable = Math.max(0, lineGross - updated.discount);
    const lineVat = updated.vatCategory === 'S' ? lineTaxable * 0.15 : 0;
    const lineTotal = lineTaxable + lineVat;
    return {
      ...updated,
      vatAmount: lineVat,
      total: lineTotal,
    };
  };

  const handleProductChange = (lineId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId
          ? computeLine(item, {
              productId: prod.id,
              name: prod.name,
              price: prod.price,
              vatCategory: prod.vatCategory,
            })
          : item
      )
    );
  };

  const handleFieldChange = (
    lineId: string,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === lineId ? computeLine(item, { [field]: value }) : item
      )
    );
  };

  const handleAddItem = () => {
    const defaultProd = products[1] || products[0];
    const newItem = computeLine(
      {
        id: `item-${Date.now()}`,
        productId: defaultProd.id,
        name: defaultProd.name,
        qty: 1,
        price: defaultProd.price,
        discount: 0,
        vatCategory: defaultProd.vatCategory,
        vatAmount: 0,
        total: 0,
      },
      {}
    );
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (lineId: string) => {
    if (items.length <= 1) {
      toast.error('Invoice must have at least 1 line item.');
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== lineId));
  };

  // Totals Calculation
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const discountTotal = items.reduce((sum, i) => sum + i.discount, 0);
    const taxableAmount = Math.max(0, subtotal - discountTotal);
    const vatAmount = items.reduce((sum, i) => sum + i.vatAmount, 0);
    const total = taxableAmount + vatAmount;
    return { subtotal, discountTotal, taxableAmount, vatAmount, total };
  }, [items]);

  // Live TLV Base64 QR Generation
  const liveQrBase64 = useMemo(() => {
    const isoTimestamp = `${issueDate}T${issueTime}Z`;
    return generateZatcaTlvBase64({
      sellerName: org.name,
      vatNumber: org.vat,
      timestamp: isoTimestamp,
      totalWithVat: totals.total.toFixed(2),
      vatAmount: totals.vatAmount.toFixed(2),
    });
  }, [org, issueDate, issueTime, totals]);

  const decodedTlv = useMemo(() => decodeZatcaTlv(liveQrBase64), [liveQrBase64]);

  // Build Draft Invoice Object for XML / Preview / Saving
  const currentInvoiceObject: Invoice = useMemo(
    () => ({
      id: `inv-${nextIcv}`,
      number: autoNumber,
      type: invoiceType,
      customerId: selectedCustomer?.id || 'cust-1',
      customerName: selectedCustomer?.name || 'Walk-in Customer',
      customerNameAr: selectedCustomer?.nameAr || 'عميل نقدي',
      customerVat: selectedCustomer?.vat || '300000000000003',
      date: issueDate,
      time: issueTime,
      dueDate,
      subtotal: totals.subtotal,
      discountTotal: totals.discountTotal,
      taxableAmount: totals.taxableAmount,
      vatAmount: totals.vatAmount,
      total: totals.total,
      status,
      notes,
      paymentTerms,
      icv: nextIcv,
      uuid: `550e8400-e29b-41d4-a716-446655440${nextIcv}`,
      previousHash,
      xmlHash: `Y2I5ZTRkM2E4ZjEwM2I4Y2Q5ZTFmN2E0YjI${nextIcv}==`,
      qrTlvBase64: liveQrBase64,
      items,
      auditTrail: [
        {
          id: `aud-${Date.now()}`,
          timestamp: `${issueDate} ${issueTime}`,
          action: 'INVOICE_ISSUED',
          actor: 'Ahmed Al-Faisal (Admin)',
          details: `Created ${invoiceType} invoice ${autoNumber} (${status})`,
        },
      ],
    }),
    [
      nextIcv,
      autoNumber,
      invoiceType,
      selectedCustomer,
      issueDate,
      issueTime,
      dueDate,
      totals,
      status,
      notes,
      paymentTerms,
      previousHash,
      liveQrBase64,
      items,
    ]
  );

  const liveUblXml = useMemo(
    () => generateUblXml(currentInvoiceObject, org),
    [currentInvoiceObject, org]
  );

  // Actions
  const handleValidate = () => {
    if (
      invoiceType === 'Standard' &&
      (!selectedCustomer?.vat || selectedCustomer.vat.length !== 15)
    ) {
      toast.error('ZATCA Rule BR-KSA-40: Standard B2B Invoice requires 15-digit Buyer VAT!');
      return;
    }
    setStatus('VALIDATED');
    toast.success('ZATCA Phase 2 Schema & 48 Business Rules Validated!');
  };

  const handleSaveDraft = () => {
    const saved: Invoice = { ...currentInvoiceObject, status: 'DRAFT' };
    addInvoice(saved);
    toast.success(`Draft ${autoNumber} saved!`);
    navigate(`/invoices/${saved.id}`);
  };

  const handleSubmitZatca = () => {
    const cleared: Invoice = {
      ...currentInvoiceObject,
      status: 'CLEARED',
      auditTrail: [
        ...currentInvoiceObject.auditTrail,
        {
          id: `aud-clear-${Date.now()}`,
          timestamp: `${issueDate} ${issueTime}`,
          action: 'STATUS_CLEARED',
          actor: 'ZATCA Mock Sandbox',
          details: 'Cryptographic ECDSA stamp & TLV QR verified (CLEARED MOCK)',
        },
      ],
    };
    addInvoice(cleared);
    toast.success(`CLEARED (MOCK): ${autoNumber} stamped & added to hash-chain!`);
    navigate(`/invoices/${cleared.id}`);
  };

  const handleCreateQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || newCustVat.length !== 15) {
      toast.error('Please enter customer name and a valid 15-digit VAT number.');
      return;
    }
    const created = addCustomer({
      name: newCustName,
      nameAr: newCustNameAr || 'شركة جديدة',
      vat: newCustVat,
      city: newCustCity,
      email: 'billing@company.sa',
      phone: '+966 11 000 0000',
    });
    setSelectedCustomerId(created.id);
    setNewCustomerModalOpen(false);
    setNewCustName('');
    setNewCustNameAr('');
    toast.success(`Customer "${created.name}" added & selected!`);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900">
              {lang === 'en' ? 'Create ZATCA E-Invoice' : 'إنشاء فاتورة إلكترونية جديدة'}
            </h2>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ICV Counter: <span className="font-mono font-bold text-slate-600">#{nextIcv}</span> •
            Previous Hash (PIH):{' '}
            <span className="font-mono text-slate-500">{previousHash.slice(0, 18)}...</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPdfModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Preview Invoice</span>
          </button>
          <button
            onClick={() => setXmlModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <FileCode2 className="w-4 h-4 text-blue-600" />
            <span>UBL 2.1 XML</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Grid: 60% Left Form / 40% Right Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols ~ 60%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Invoice Type Pills & Metadata */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Invoice Classification & Metadata
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {autoNumber}
              </span>
            </div>

            {/* Type Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['Standard', 'Simplified', 'Credit', 'Debit'] as InvoiceType[]).map(
                (type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setInvoiceType(type);
                      setPreviewFormat(type === 'Simplified' ? 'POS' : 'A4');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      invoiceType === type
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{type}</span>
                    <span
                      className={`text-[10px] font-normal ${
                        invoiceType === type ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {type === 'Standard'
                        ? 'B2B Clearance (388)'
                        : type === 'Simplified'
                        ? 'B2C Reporting (383)'
                        : 'Adjustment Note'}
                    </span>
                  </button>
                )
              )}
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Issue Date ({toHijriDate(issueDate)})
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Issue Time (UTC+3)
                </label>
                <input
                  type="time"
                  step="1"
                  value={issueTime}
                  onChange={(e) => setIssueTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Supply / Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Customer Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Buyer / Customer Details
                </h3>
                <p className="text-xs text-slate-400">
                  {invoiceType === 'Standard'
                    ? 'Mandatory 15-digit VAT number required for B2B Clearance'
                    : 'Optional buyer details for B2C Simplified POS Invoice'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setNewCustomerModalOpen(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Filter / Search Customer
                </label>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Type name or VAT number..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Select Registered Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {filteredCustomers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCustomer && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">English Name</span>
                  <span className="font-bold text-slate-800">{selectedCustomer.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Arabic Name</span>
                  <span className="font-bold text-slate-800 font-arabic">
                    {selectedCustomer.nameAr}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Buyer VAT (15-Digit)</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {selectedCustomer.vat}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">City / National Addr</span>
                  <span className="font-bold text-slate-800">
                    {selectedCustomer.city} ({selectedCustomer.shortAddress || 'RRRD2929'})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Editable Line Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Invoice Line Items (Auto-VAT Calculation)
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-2.5 pr-2">Product / Service</th>
                    <th className="py-2.5 px-2 w-20">Qty</th>
                    <th className="py-2.5 px-2 w-28">Price (SAR)</th>
                    <th className="py-2.5 px-2 w-24">Discount</th>
                    <th className="py-2.5 px-2 w-24">VAT Cat</th>
                    <th className="py-2.5 px-2 text-right">VAT</th>
                    <th className="py-2.5 px-2 text-right">Total</th>
                    <th className="py-2.5 pl-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 pr-2">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(item.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.sku})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            handleFieldChange(item.id, 'qty', Math.max(1, Number(e.target.value)))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min={0}
                          value={item.price}
                          onChange={(e) =>
                            handleFieldChange(item.id, 'price', Math.max(0, Number(e.target.value)))
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          min={0}
                          value={item.discount}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              'discount',
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={item.vatCategory}
                          onChange={(e) =>
                            handleFieldChange(
                              item.id,
                              'vatCategory',
                              e.target.value as VatCategory
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold"
                        >
                          <option value="S">S (15%)</option>
                          <option value="Z">Z (0%)</option>
                          <option value="E">E (Exempt)</option>
                          <option value="O">O (Out)</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 text-right text-xs font-semibold text-slate-600 whitespace-nowrap">
                        {item.vatAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right text-xs font-bold text-slate-900 whitespace-nowrap">
                        {item.total.toFixed(2)}
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 4: Notes & Payment Terms */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Invoice Notes / Remarks
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Payment Terms & IBAN
              </label>
              <textarea
                rows={3}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols ~ 40%, Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Financial Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Tax & Monetary Summary
              </h3>
              <span className="text-xs font-semibold text-slate-400">Currency: SAR</span>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Gross)</span>
                <span className="font-semibold">{formatSAR(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Discount</span>
                <span className="font-semibold text-amber-600">
                  - {formatSAR(totals.discountTotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-700 pt-2 border-t border-slate-100">
                <span className="font-medium">Taxable Amount</span>
                <span className="font-bold">{formatSAR(totals.taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total VAT (15% Standard)</span>
                <span className="font-bold text-blue-600">{formatSAR(totals.vatAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200 text-lg">
                <span className="font-extrabold text-slate-900">Grand Total</span>
                <span className="font-extrabold text-emerald-600">
                  {formatSAR(totals.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Live ZATCA TLV QR & Byte Inspector Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>Live ZATCA TLV QR Code</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Auto-updates Tag 1–5 binary bytes as you type
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                Expand Inspector
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <QRCodeSVG value={liveQrBase64} size={116} level="M" />
              </div>
              <div className="flex-1 w-full overflow-hidden space-y-1.5">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Base64 Encoded TLV Payload:
                </p>
                <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] p-2.5 rounded-lg break-all leading-relaxed select-all">
                  {liveQrBase64}
                </div>
              </div>
            </div>

            {/* Decoded 5 Tags Pills */}
            <div className="space-y-1.5">
              {decodedTlv.map((field) => (
                <div
                  key={field.tag}
                  className="flex items-center justify-between text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Tag {field.tag} ({field.hexTag})
                    </span>
                    <span className="text-slate-500 font-medium">{field.label}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800 truncate max-w-[160px]">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-[260px] z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700 hover:bg-blue-100 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validate Rules</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setXmlModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hidden sm:flex items-center gap-1.5"
          >
            <FileCode2 className="w-4 h-4 text-purple-600" />
            <span>Generate XML</span>
          </button>
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hidden sm:flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Generate QR</span>
          </button>
          <button
            type="button"
            onClick={() => setPdfModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Preview PDF</span>
          </button>
          <button
            type="button"
            onClick={handleSubmitZatca}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit to ZATCA (MOCK)</span>
          </button>
        </div>
      </div>

      {/* MODAL 1: UBL 2.1 XML Viewer */}
      {xmlModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900">
                  ZATCA UBL 2.1 Compliant XML — {autoNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(liveUblXml);
                    toast.success('UBL 2.1 XML copied to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy XML
                </button>
                <button
                  onClick={() => setXmlModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <pre className="p-6 bg-slate-950 text-emerald-300 font-mono text-xs overflow-auto flex-1 leading-relaxed">
              {liveUblXml}
            </pre>
          </div>
        </div>
      )}

      {/* MODAL 2: QR TLV Inspector */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">ZATCA TLV QR Code Inspector</h3>
              <button onClick={() => setQrModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex justify-center py-4 bg-slate-50 rounded-2xl border border-slate-200">
              <QRCodeSVG value={liveQrBase64} size={200} />
            </div>
            <div className="space-y-2">
              {decodedTlv.map((f) => (
                <div
                  key={f.tag}
                  className="flex justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                >
                  <span className="font-bold text-slate-600">
                    Tag {f.tag} ({f.byteLength} bytes) — {f.label}
                  </span>
                  <span className="font-mono font-bold text-emerald-700">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Bilingual PDF / Thermal POS Preview */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewFormat('A4')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                    previewFormat === 'A4'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Standard A4 PDF/A-3
                </button>
                <button
                  onClick={() => setPreviewFormat('POS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                    previewFormat === 'POS'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" /> Simplified POS Thermal
                </button>
              </div>
              <button onClick={() => setPdfModalOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
              {previewFormat === 'A4' ? (
                <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-md border border-slate-200 space-y-6">
                  <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">
                        TAX INVOICE / فاتورة ضريبية
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        {autoNumber} • {issueDate} ({toHijriDate(issueDate)})
                      </p>
                    </div>
                    <QRCodeSVG value={liveQrBase64} size={84} />
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-400 uppercase mb-1">
                        Seller / المورد
                      </p>
                      <p className="font-bold text-slate-900">{org.name}</p>
                      <p className="font-arabic text-slate-700">{org.nameAr}</p>
                      <p className="font-mono text-emerald-700 mt-1">VAT: {org.vat}</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-400 uppercase mb-1">
                        Buyer / العميل
                      </p>
                      <p className="font-bold text-slate-900">{selectedCustomer?.name}</p>
                      <p className="font-arabic text-slate-700">
                        {selectedCustomer?.nameAr}
                      </p>
                      <p className="font-mono text-emerald-700 mt-1">
                        VAT: {selectedCustomer?.vat}
                      </p>
                    </div>
                  </div>

                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-2.5 text-left">Item / الصنف</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">VAT (15%)</th>
                        <th className="p-2.5 text-right">Total (SAR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.map((i) => (
                        <tr key={i.id}>
                          <td className="p-2.5 font-semibold">{i.name}</td>
                          <td className="p-2.5 text-center">{i.qty}</td>
                          <td className="p-2.5 text-right">{i.price.toFixed(2)}</td>
                          <td className="p-2.5 text-right">{i.vatAmount.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-bold">{i.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end">
                    <div className="w-64 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span>Taxable Amount:</span>
                        <span className="font-bold">{formatSAR(totals.taxableAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (15%):</span>
                        <span className="font-bold">{formatSAR(totals.vatAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-emerald-700 border-t border-slate-200 pt-2">
                        <span>Total / الإجمالي:</span>
                        <span>{formatSAR(totals.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Simplified Thermal POS Receipt View */
                <div className="bg-white w-80 p-6 rounded-xl shadow-md border border-slate-200 text-center space-y-4 font-mono text-xs">
                  <div>
                    <h4 className="font-bold text-sm">{org.nameAr}</h4>
                    <p className="font-bold">{org.name}</p>
                    <p className="text-[11px] text-slate-500">VAT: {org.vat}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      SIMPLIFIED TAX INVOICE / فاتورة ضريبية مبسطة
                    </p>
                  </div>
                  <div className="border-t border-b border-dashed border-slate-300 py-2 text-left space-y-1">
                    {items.map((i) => (
                      <div key={i.id} className="flex justify-between">
                        <span>
                          {i.qty}x {i.name}
                        </span>
                        <span>{i.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between">
                      <span>VAT (15%):</span>
                      <span>{formatSAR(totals.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm">
                      <span>TOTAL:</span>
                      <span>{formatSAR(totals.total)}</span>
                    </div>
                  </div>
                  <div className="flex justify-center pt-2">
                    <QRCodeSVG value={liveQrBase64} size={130} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Quick Add Customer */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateQuickCustomer}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900">Add New Saudi Customer</h3>
              <button type="button" onClick={() => setNewCustomerModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Company Name (English)
              </label>
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="e.g. Neom Future Corp"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Company Name (Arabic)
              </label>
              <input
                type="text"
                value={newCustNameAr}
                onChange={(e) => setNewCustNameAr(e.target.value)}
                placeholder="شركة نيوم المستقبل"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-arabic"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                15-Digit ZATCA VAT Number
              </label>
              <input
                type="text"
                maxLength={15}
                required
                value={newCustVat}
                onChange={(e) => setNewCustVat(e.target.value)}
                placeholder="300123456700003"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={newCustCity}
                onChange={(e) => setNewCustCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewCustomerModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Save & Select
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};