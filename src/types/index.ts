export type InvoiceStatus = 'DRAFT' | 'VALIDATED' | 'PENDING' | 'CLEARED' | 'REJECTED';
export type InvoiceType = 'Standard' | 'Simplified' | 'Credit' | 'Debit';
export type VatCategory = 'S' | 'Z' | 'E' | 'O'; // S=15% Standard, Z=Zero, E=Exempt, O=Out-of-scope

export interface Organization {
  name: string;
  nameAr: string;
  vat: string;
  cr: string;
  city: string;
  address: string;
  buildingNo: string;
  postalCode: string;
  shortAddress: string;
  defaultVatRate: number;
  invoicePrefix: string;
}

export interface Customer {
  id: string;
  name: string;
  nameAr: string;
  vat: string;
  city: string;
  shortAddress?: string;
  email: string;
  phone: string;
  totalInvoiced: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameAr: string;
  unit: string;
  price: number;
  vatCategory: VatCategory;
  status: 'Active' | 'Archived';
}

export interface InvoiceLineItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
  vatCategory: VatCategory;
  vatAmount: number;
  total: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
}

export interface Invoice {
  id: string;
  number: string;
  type: InvoiceType;
  customerId: string;
  customerName: string;
  customerNameAr: string;
  customerVat: string;
  date: string;
  time: string;
  dueDate: string;
  subtotal: number;
  discountTotal: number;
  taxableAmount: number;
  vatAmount: number;
  total: number;
  status: InvoiceStatus;
  notes: string;
  paymentTerms: string;
  icv: number; // Invoice Counter Value (ZATCA Phase 2)
  uuid: string;
  previousHash: string; // PIH - Previous Invoice Hash
  xmlHash: string; // Current Invoice SHA-256 Hash
  qrTlvBase64: string;
  items: InvoiceLineItem[];
  auditTrail: AuditEntry[];
}

export interface DecodedTlvField {
  tag: number;
  label: string;
  value: string;
  byteLength: number;
  hexTag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  draftInvoice?: {
    customerName: string;
    type: InvoiceType;
    items: { name: string; qty: number; price: number }[];
    subtotal: number;
    vat: number;
    total: number;
  };
}