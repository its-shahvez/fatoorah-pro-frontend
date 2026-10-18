import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  Edit3,
  Trash2,
  ShieldAlert,
  MessageSquare,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { formatSAR, generateZatcaTlvBase64 } from '../lib/utils';
import type { ChatMessage, Invoice } from '../types';

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const { org, customers, invoices, addInvoice } = useAppStore();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      timestamp: '14:30',
      text: 'Marhaba! 👋 I am your Fatoorah Pro AI Fiscal Assistant. Paste any WhatsApp order, email text, or tell me which customer and items to bill — I will calculate the 15% Saudi VAT and prepare a ZATCA Phase 2 draft for your confirmation.',
    },
  ]);

  const suggestedPrompts = [
    'Create Standard B2B invoice for Al Noor Trading with 3 Laptops and 2 Monitors',
    'Draft Simplified POS invoice for Desert Rose LLC for 5 Consulting Hours',
    'Bill Arabian Steel Co. for 4 Software Licenses and 6 Office Chairs',
    'Explain ZATCA Phase 2 TLV QR Tag 1 to Tag 9 requirements',
  ];

  const handleSend = (promptText?: string) => {
    const query = (promptText ?? input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const lower = query.toLowerCase();

      if (lower.includes('tag') || lower.includes('explain')) {
        const infoReply: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          text: 'Under ZATCA Phase 2 (Fatoora), every TLV Base64 QR code encodes: Tag 1 (Seller Name), Tag 2 (15-digit VAT Number), Tag 3 (ISO-8601 Timestamp), Tag 4 (Invoice Total with VAT), Tag 5 (VAT Amount), plus cryptographic ECDSA tags (Tags 6–9). Would you like me to draft a sample invoice to inspect its live QR?',
        };
        setMessages((prev) => [...prev, infoReply]);
        return;
      }

      // Smart Entity Extraction for Invoice Drafting
      const matchedCustomer =
        customers.find((c) => lower.includes(c.name.toLowerCase().split(' ')[0])) ||
        customers[0];

      const isSimplified = lower.includes('simplified') || lower.includes('pos');
      const draftItems = lower.includes('consulting')
        ? [{ name: 'Consulting Hour', qty: 5, price: 500 }]
        : lower.includes('software')
        ? [
            { name: 'Software License', qty: 4, price: 2500 },
            { name: 'Office Chair', qty: 6, price: 450 },
          ]
        : [
            { name: 'Laptop', qty: 3, price: 3500 },
            { name: 'Printer', qty: 2, price: 1200 },
          ];

      const subtotal = draftItems.reduce((s, i) => s + i.qty * i.price, 0);
      const vat = subtotal * 0.15;
      const total = subtotal + vat;

      const aiDraftMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: `I have prepared a ${
          isSimplified ? 'Simplified (B2C)' : 'Standard (B2B)'
        } ZATCA Tax Invoice draft for "${
          matchedCustomer.name
        }" with 15% VAT calculated. Please review and confirm below:`,
        draftInvoice: {
          customerName: matchedCustomer.name,
          type: isSimplified ? 'Simplified' : 'Standard',
          items: draftItems,
          subtotal,
          vat,
          total,
        },
      };

      setMessages((prev) => [...prev, aiDraftMsg]);
    }, 450);
  };

  const handleConfirmDraft = (draft: NonNullable<ChatMessage['draftInvoice']>) => {
    const nextIcv =
      invoices.length > 0 ? Math.max(...invoices.map((i) => i.icv)) + 1 : 149;
    const number = `${org.invoicePrefix}-2026-${String(nextIcv).padStart(6, '0')}`;
    const customer =
      customers.find((c) => c.name === draft.customerName) || customers[0];

    const qrTlvBase64 = generateZatcaTlvBase64({
      sellerName: org.name,
      vatNumber: org.vat,
      timestamp: '2026-10-15T15:00:00Z',
      totalWithVat: draft.total.toFixed(2),
      vatAmount: draft.vat.toFixed(2),
    });

    const newInv: Invoice = {
      id: `inv-${nextIcv}`,
      number,
      type: draft.type,
      customerId: customer.id,
      customerName: customer.name,
      customerNameAr: customer.nameAr,
      customerVat: customer.vat,
      date: '2026-10-15',
      time: '15:00:00',
      dueDate: '2026-11-15',
      subtotal: draft.subtotal,
      discountTotal: 0,
      taxableAmount: draft.subtotal,
      vatAmount: draft.vat,
      total: draft.total,
      status: 'CLEARED',
      notes: 'Generated via Fatoorah Pro AI Assistant and confirmed by user.',
      paymentTerms: 'Net 30 Days',
      icv: nextIcv,
      uuid: `550e8400-e29b-41d4-a716-446655440${nextIcv}`,
      previousHash: invoices[0]?.xmlHash || 'NWU4Y2I1MzA1NDc5ZDEy==',
      xmlHash: `Y2I5ZTRkM2E4ZjEwM2I4Y2Q5ZTFmN2E0YjI${nextIcv}==`,
      qrTlvBase64,
      items: draft.items.map((it, idx) => ({
        id: `ai-line-${idx}`,
        productId: 'prod-1',
        name: it.name,
        qty: it.qty,
        price: it.price,
        discount: 0,
        vatCategory: 'S',
        vatAmount: it.qty * it.price * 0.15,
        total: it.qty * it.price * 1.15,
      })),
      auditTrail: [
        {
          id: `aud-ai-${Date.now()}`,
          timestamp: '2026-10-15 15:00:00',
          action: 'AI_DRAFT_CONFIRMED',
          actor: 'Ahmed Al-Faisal (Admin)',
          details: `Confirmed AI-generated invoice ${number} (CLEARED MOCK)`,
        },
      ],
    };

    addInvoice(newInv);
    toast.success(`Invoice ${number} created & CLEARED (MOCK)!`);
    navigate(`/invoices/${newInv.id}`);
  };

  return (
    <div className="space-y-4">
      {/* Safety Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900 font-medium">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Human-in-the-Loop Guarantee:</strong> AI never finalizes or
            submits an invoice to ZATCA without your explicit confirmation.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] bg-emerald-200/60 px-2 py-0.5 rounded font-bold">
          ZATCA AI COPILOT
        </span>
      </div>

      {/* Main Two-Column Chat Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[560px]">
        {/* Left Sidebar: Conversation History */}
        <div className="hidden lg:flex lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  AI Copilot Sessions
                </h3>
                <p className="text-[11px] text-slate-400">
                  Natural Language to UBL 2.1 XML
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[
                { title: 'Al Noor Trading B2B Draft', time: 'Just now', active: true },
                { title: 'VAT Rule BR-KSA-40 Check', time: 'Yesterday', active: false },
                { title: 'September Input VAT Summary', time: 'Oct 12', active: false },
              ].map((sess, i) => (
                <div
                  key={i}
                  onClick={() => toast(`Loaded session: ${sess.title}`)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    sess.active
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 font-bold'
                      : 'bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{sess.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{sess.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Zap className="w-4 h-4" />
              <span>Pro Tip: WhatsApp Order Paste</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Paste any messy client message and the AI will automatically map SKUs,
              15-digit VAT numbers, and calculate 15% tax.
            </p>
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Suggested Prompts Row */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-xs font-medium text-slate-700 whitespace-nowrap transition-all shadow-sm"
              >
                ✨ {prompt}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-sm space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="leading-relaxed text-xs sm:text-sm">{m.text}</p>

                  {/* Interactive Invoice Draft Card inside AI Message */}
                  {m.draftInvoice && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs text-slate-800">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div>
                          <span className="font-extrabold text-emerald-700 uppercase">
                            ZATCA {m.draftInvoice.type} Draft
                          </span>
                          <p className="font-bold text-slate-900">
                            Customer: {m.draftInvoice.customerName}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          AWAITING CONFIRMATION
                        </span>
                      </div>

                      <div className="space-y-1">
                        {m.draftInvoice.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              {it.qty}x {it.name} (@ {formatSAR(it.price)})
                            </span>
                            <span className="font-bold">
                              {formatSAR(it.qty * it.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-200 pt-2 space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal:</span>
                          <span>{formatSAR(m.draftInvoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-blue-600 font-semibold">
                          <span>Saudi VAT (15%):</span>
                          <span>{formatSAR(m.draftInvoice.vat)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold text-emerald-700">
                          <span>Total Payable:</span>
                          <span>{formatSAR(m.draftInvoice.total)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <button
                          onClick={() => handleConfirmDraft(m.draftInvoice!)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm & Issue (MOCK)</span>
                        </button>
                        <button
                          onClick={() => navigate('/invoices/new')}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 font-bold text-slate-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit in Studio
                        </button>
                        <button
                          onClick={() => toast('Draft discarded')}
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI to draft an invoice (e.g. 'Invoice Al Noor Trading for 3 Laptops')..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};