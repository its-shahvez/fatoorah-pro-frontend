import { create } from 'zustand';
import type { AuditEntry, Customer, Invoice, Organization, Product } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const DEFAULT_ORG: Organization = {
  name: 'Al-Madinah Tech Solutions Co.',
  nameAr: 'شركة المدينة للحلول التقنية',
  vat: '300075588900003',
  cr: '1010998877',
  city: 'Riyadh',
  address: 'King Fahd Road, Olaya District',
  buildingNo: '7428',
  postalCode: '12214',
  shortAddress: 'RRRD2929',
  defaultVatRate: 15,
  invoicePrefix: 'INV-2026-',
};

// Helper: Backend InvoiceEntity + AuditLogEntity ko Frontend Invoice type mein map karne ke liye
function mapBackendInvoice(raw: any, allAuditLogs: any[] = []): Invoice {
  const invNumber = raw.number || '';
  const matchingLogs: AuditEntry[] = allAuditLogs
    .filter((log) => log.invoiceNumber === invNumber || String(log.invoiceId) === String(raw.id))
    .map((log) => ({
      id: String(log.id),
      timestamp: log.timestamp || `${raw.date} ${raw.time}`,
      action: log.action || 'CLEARED_BY_ZATCA',
      actor: log.actor || 'ZATCA Phase 2 Engine',
      details: log.details || 'Signed with ECDSA secp256k1',
    }));

  if (matchingLogs.length === 0) {
    matchingLogs.push({
      id: `audit-${raw.id || Date.now()}`,
      timestamp: `${raw.date || ''} ${raw.time || ''}`,
      action: raw.status === 'CLEARED' ? 'ZATCA Phase 2 Cleared' : 'Invoice Registered',
      actor: 'Spring Boot ZATCA Engine (secp256k1)',
      details: `ICV #${raw.icv || 1} | SHA-256 Hash: ${(raw.xmlHash || '').substring(0, 20)}...`,
    });
  }

  return {
    id: String(raw.id ?? raw.number),
    number: raw.number || 'INV-2026-000001',
    type: raw.type || 'Standard',
    customerId: String(raw.customerId || '1'),
    customerName: raw.customerName || 'Walk-in Customer',
    customerNameAr: raw.customerNameAr || 'عميل نقدي',
    customerVat: raw.customerVat || '300000000000003',
    date: raw.date || new Date().toISOString().split('T')[0],
    time: raw.time || '12:00:00',
    dueDate: raw.dueDate || raw.date || new Date().toISOString().split('T')[0],
    subtotal: Number(raw.subtotal ?? 0),
    discountTotal: Number(raw.discountTotal ?? 0),
    taxableAmount: Number(raw.taxableAmount ?? 0),
    vatAmount: Number(raw.vatAmount ?? 0),
    total: Number(raw.total ?? 0),
    status: raw.status || 'CLEARED',
    notes: raw.notes || '',
    paymentTerms: raw.paymentTerms || 'Net 30',
    icv: Number(raw.icv ?? 1),
    uuid: raw.uuid || '',
    previousHash: raw.previousHash || '',
    xmlHash: raw.xmlHash || '',
    qrTlvBase64: raw.qrTlvBase64 || '',
    items: Array.isArray(raw.items)
      ? raw.items.map((item: any, idx: number) => ({
          id: String(item.id ?? `item-${idx}`),
          productId: String(item.productId ?? idx + 1),
          name: item.name || 'Item',
          qty: Number(item.qty ?? 1),
          price: Number(item.price ?? 0),
          discount: Number(item.discount ?? 0),
          vatCategory: item.vatCategory || 'S',
          vatAmount: Number(item.vatAmount ?? 0),
          total: Number(item.total ?? 0),
        }))
      : [],
    auditTrail: matchingLogs,
  };
}

interface AppState {
  lang: 'en' | 'ar';
  toggleLang: () => void;
  isLoading: boolean;
  backendConnected: boolean;
  fetchBootstrapData: () => Promise<void>;
  org: Organization;
  updateOrg: (org: Partial<Organization>) => void;
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'totalInvoiced'>) => Customer;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  lang: 'en',
  isLoading: false,
  backendConnected: false,

  toggleLang: () =>
    set((state) => {
      const next = state.lang === 'en' ? 'ar' : 'en';
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = next;
      return { lang: next };
    }),

  org: DEFAULT_ORG,
  customers: [],
  products: [],
  invoices: [],

  // 1. Load Live Data from Spring Boot /api/v1/bootstrap
  fetchBootstrapData: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_BASE}/bootstrap`);
      if (!res.ok) throw new Error('Failed to fetch bootstrap data');
      const data = await res.json();

      const auditLogs = Array.isArray(data.auditLogs) ? data.auditLogs : [];

      const mappedOrg: Organization = data.org
        ? {
            name: data.org.name || DEFAULT_ORG.name,
            nameAr: data.org.nameAr || DEFAULT_ORG.nameAr,
            vat: data.org.vat || DEFAULT_ORG.vat,
            cr: data.org.cr || DEFAULT_ORG.cr,
            city: data.org.city || DEFAULT_ORG.city,
            address: data.org.address || DEFAULT_ORG.address,
            buildingNo: data.org.buildingNo || DEFAULT_ORG.buildingNo,
            postalCode: data.org.postalCode || DEFAULT_ORG.postalCode,
            shortAddress: data.org.shortAddress || 'RRRD2929',
            defaultVatRate: Number(data.org.defaultVatRate ?? 15),
            invoicePrefix: data.org.invoicePrefix || 'INV-2026-',
          }
        : DEFAULT_ORG;

      const mappedCustomers: Customer[] = Array.isArray(data.customers)
        ? data.customers.map((c: any) => ({
            id: String(c.id),
            name: c.name || '',
            nameAr: c.nameAr || '',
            vat: c.vat || '',
            city: c.city || 'Riyadh',
            shortAddress: c.shortAddress || 'RRRD2929',
            email: c.email || '',
            phone: c.phone || '',
            totalInvoiced: Number(c.totalInvoiced ?? 0),
          }))
        : [];

      const mappedProducts: Product[] = Array.isArray(data.products)
        ? data.products.map((p: any) => ({
            id: String(p.id),
            sku: p.sku || '',
            name: p.name || '',
            nameAr: p.nameAr || '',
            unit: p.unit || 'PCE',
            price: Number(p.price ?? 0),
            vatCategory: p.vatCategory || 'S',
            status: p.status === 'Archived' ? 'Archived' : 'Active',
          }))
        : [];

      const mappedInvoices: Invoice[] = Array.isArray(data.invoices)
        ? data.invoices.map((inv: any) => mapBackendInvoice(inv, auditLogs))
        : [];

      set({
        org: mappedOrg,
        customers: mappedCustomers,
        products: mappedProducts,
        invoices: mappedInvoices,
        backendConnected: true,
        isLoading: false,
      });
    } catch (err) {
      console.error('Spring Boot Backend connection error:', err);
      set({ backendConnected: false, isLoading: false });
    }
  },

  // 2. Update Organization in Spring Boot DB
  updateOrg: (updated) => {
    const nextOrg = { ...get().org, ...updated };
    set({ org: nextOrg });
    fetch(`${API_BASE}/organization`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextOrg),
    }).catch((err) => console.error('Failed to update org in DB:', err));
  },

  // 3. Add Customer in Spring Boot DB
  addCustomer: (newCust) => {
    const tempCustomer: Customer = {
      ...newCust,
      id: `cust-${Date.now()}`,
      totalInvoiced: 0,
    };
    set((state) => ({ customers: [tempCustomer, ...state.customers] }));

    fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCust),
    })
      .then((res) => res.json())
      .then((saved) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === tempCustomer.id
              ? { ...tempCustomer, id: String(saved.id), totalInvoiced: Number(saved.totalInvoiced ?? 0) }
              : c
          ),
        }));
      })
      .catch((err) => console.error('Failed to save customer in DB:', err));

    return tempCustomer;
  },

  // 4. Add Product in Spring Boot DB
  addProduct: (newProd) => {
    const tempId = `prod-${Date.now()}`;
    const optimistic: Product = { ...newProd, id: tempId };
    set((state) => ({ products: [optimistic, ...state.products] }));

    fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd),
    })
      .then((res) => res.json())
      .then((saved) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === tempId ? { ...optimistic, id: String(saved.id) } : p
          ),
        }));
      })
      .catch((err) => console.error('Failed to save product in DB:', err));
  },

  // 5. Update Product
  updateProduct: (id, updated) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  },

  // 6. Create & Cryptographically Sign Invoice in Spring Boot (ECDSA secp256k1 + SHA-256 + TLV QR)
  addInvoice: (invoice) => {
    // Optimistically add so UI navigates immediately
    set((state) => ({ invoices: [invoice, ...state.invoices] }));

    fetch(`${API_BASE}/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice),
    })
      .then((res) => res.json())
      .then((savedBackendInv) => {
        const mapped = mapBackendInvoice(savedBackendInv);
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoice.id || inv.number === invoice.number ? mapped : inv
          ),
        }));
        // Refresh bootstrap so customer totalInvoiced & audit logs stay in sync
        get().fetchBootstrapData();
      })
      .catch((err) => console.error('Failed to create & sign invoice in backend:', err));
  },

  // 7. Clear / Validate Invoice with ZATCA Gateway via Spring Boot
  updateInvoiceStatus: (id, status) => {
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    }));

    if (status === 'CLEARED' || status === 'VALIDATED') {
      fetch(`${API_BASE}/invoices/${encodeURIComponent(id)}/clear`, {
        method: 'POST',
      })
        .then((res) => res.json())
        .then((clearedInv) => {
          const mapped = mapBackendInvoice(clearedInv);
          set((state) => ({
            invoices: state.invoices.map((inv) =>
              inv.id === id || inv.number === mapped.number ? mapped : inv
            ),
          }));
        })
        .catch((err) => console.error('Failed to clear invoice in backend:', err));
    }
  },
}));

// Auto-fetch live data from Spring Boot as soon as the store loads!
useAppStore.getState().fetchBootstrapData();