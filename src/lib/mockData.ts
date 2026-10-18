import type { Customer, Invoice, Organization, Product } from '../types';
import { generateZatcaTlvBase64 } from './utils';

export const INITIAL_ORG: Organization = {
  name: 'Al Faisal Trading Est.',
  nameAr: 'مؤسسة الفيصل التجارية',
  vat: '310122393500003',
  cr: '1010123456',
  city: 'Riyadh',
  address: 'King Fahd Road, Al Olaya District',
  buildingNo: '7428',
  postalCode: '12214',
  shortAddress: 'RRRD2929',
  defaultVatRate: 15,
  invoicePrefix: 'INV',
};

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Al Noor Trading',
    nameAr: 'شركة النور للتجارة',
    vat: '300455612900003',
    city: 'Riyadh',
    shortAddress: 'RYLD1122',
    email: 'finance@alnoortrading.sa',
    phone: '+966 11 450 9821',
    totalInvoiced: 68400,
  },
  {
    id: 'cust-2',
    name: 'Saudi Tech Solutions',
    nameAr: 'الحلول التقنية السعودية',
    vat: '300891234500003',
    city: 'Jeddah',
    shortAddress: 'JEDH4433',
    email: 'ap@sauditech.com.sa',
    phone: '+966 12 661 3340',
    totalInvoiced: 52900,
  },
  {
    id: 'cust-3',
    name: 'Desert Rose LLC',
    nameAr: 'شركة وردة الصحراء المحدودة',
    vat: '301122987600003',
    city: 'Dammam',
    shortAddress: 'DAMM9988',
    email: 'accounts@desertrose.sa',
    phone: '+966 13 882 1190',
    totalInvoiced: 31200,
  },
  {
    id: 'cust-4',
    name: 'Riyadh Logistics',
    nameAr: 'الرياض للخدمات اللوجستية',
    vat: '300998877600003',
    city: 'Riyadh',
    shortAddress: 'RYLD5566',
    email: 'billing@riyadhlogistics.sa',
    phone: '+966 11 210 7744',
    totalInvoiced: 44150,
  },
  {
    id: 'cust-5',
    name: 'Jeddah Imports',
    nameAr: 'جدة للاستيراد والتصدير',
    vat: '300554433200003',
    city: 'Jeddah',
    shortAddress: 'JEDH7788',
    email: 'invoices@jeddahimports.sa',
    phone: '+966 12 609 4411',
    totalInvoiced: 23800,
  },
  {
    id: 'cust-6',
    name: 'Arabian Steel Co.',
    nameAr: 'الشركة العربية للحديد والصلب',
    vat: '300776655400003',
    city: 'Jubail',
    shortAddress: 'JUBL2211',
    email: 'procurement@arabiansteel.sa',
    phone: '+966 13 341 9000',
    totalInvoiced: 89500,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'prod-1', sku: 'HW-LAP-01', name: 'Laptop', nameAr: 'جهاز حاسب محمول', unit: 'PCE', price: 3500, vatCategory: 'S', status: 'Active' },
  { id: 'prod-2', sku: 'FN-CHR-02', name: 'Office Chair', nameAr: 'كرسي مكتبي مريح', unit: 'PCE', price: 450, vatCategory: 'S', status: 'Active' },
  { id: 'prod-3', sku: 'HW-PRN-03', name: 'Printer', nameAr: 'طابعة ليزر مكتبية', unit: 'PCE', price: 1200, vatCategory: 'S', status: 'Active' },
  { id: 'prod-4', sku: 'SV-CNS-04', name: 'Consulting Hour', nameAr: 'ساعة استشارات تقنية', unit: 'HUR', price: 500, vatCategory: 'S', status: 'Active' },
  { id: 'prod-5', sku: 'SW-LIC-05', name: 'Software License', nameAr: 'ترخيص برنامج سحابي', unit: 'PCE', price: 2500, vatCategory: 'S', status: 'Active' },
  { id: 'prod-6', sku: 'FN-DSK-06', name: 'Desk', nameAr: 'مكتب تنفيذي خشبي', unit: 'PCE', price: 800, vatCategory: 'S', status: 'Active' },
  { id: 'prod-7', sku: 'HW-MON-07', name: 'Monitor', nameAr: 'شاشة عرض 27 بوصة', unit: 'PCE', price: 900, vatCategory: 'Z', status: 'Active' },
  { id: 'prod-8', sku: 'SV-TRN-08', name: 'Training Session', nameAr: 'دورة تدريبية للموظفين', unit: 'DAY', price: 1500, vatCategory: 'E', status: 'Active' },
];

const rawSeeds = [
  { num: 148, custIdx: 0, type: 'Standard', status: 'CLEARED', date: '2026-10-14', qty1: 4, p1: 0, qty2: 2, p2: 4 },
  { num: 147, custIdx: 1, type: 'Standard', status: 'CLEARED', date: '2026-10-13', qty1: 5, p1: 4, qty2: 10, p2: 3 },
  { num: 146, custIdx: 5, type: 'Standard', status: 'PENDING', date: '2026-10-12', qty1: 8, p1: 0, qty2: 5, p2: 2 },
  { num: 145, custIdx: 2, type: 'Simplified', status: 'CLEARED', date: '2026-10-11', qty1: 6, p1: 1, qty2: 3, p2: 5 },
  { num: 144, custIdx: 3, type: 'Standard', status: 'VALIDATED', date: '2026-10-10', qty1: 3, p1: 0, qty2: 4, p2: 6 },
  { num: 143, custIdx: 4, type: 'Credit', status: 'CLEARED', date: '2026-10-08', qty1: 1, p1: 4, qty2: 2, p2: 3 },
  { num: 142, custIdx: 0, type: 'Standard', status: 'REJECTED', date: '2026-10-07', qty1: 2, p1: 2, qty2: 1, p2: 7 },
  { num: 141, custIdx: 5, type: 'Standard', status: 'CLEARED', date: '2026-10-05', qty1: 10, p1: 0, qty2: 4, p2: 4 },
  { num: 140, custIdx: 1, type: 'Simplified', status: 'DRAFT', date: '2026-10-04', qty1: 2, p1: 1, qty2: 2, p2: 5 },
  { num: 139, custIdx: 3, type: 'Debit', status: 'CLEARED', date: '2026-10-02', qty1: 6, p1: 3, qty2: 1, p2: 2 },
] as const;

export const INITIAL_INVOICES: Invoice[] = rawSeeds.map((seed, index) => {
  const customer = INITIAL_CUSTOMERS[seed.custIdx];
  const prodA = INITIAL_PRODUCTS[seed.p1];
  const prodB = INITIAL_PRODUCTS[seed.p2];

  const grossA = seed.qty1 * prodA.price;
  const vatA = prodA.vatCategory === 'S' ? grossA * 0.15 : 0;

  const grossB = seed.qty2 * prodB.price;
  const vatB = prodB.vatCategory === 'S' ? grossB * 0.15 : 0;

  const subtotal = grossA + grossB;
  const vatAmount = vatA + vatB;
  const total = subtotal + vatAmount;
  const number = `INV-2026-${String(seed.num).padStart(6, '0')}`;
  const time = '14:22:10';
  const isoTimestamp = `${seed.date}T${time}Z`;

  const qrTlvBase64 = generateZatcaTlvBase64({
    sellerName: INITIAL_ORG.name,
    vatNumber: INITIAL_ORG.vat,
    timestamp: isoTimestamp,
    totalWithVat: total.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
  });

  return {
    id: `inv-${seed.num}`,
    number,
    type: seed.type as any,
    customerId: customer.id,
    customerName: customer.name,
    customerNameAr: customer.nameAr,
    customerVat: customer.vat,
    date: seed.date,
    time,
    dueDate: '2026-11-15',
    subtotal,
    discountTotal: 0,
    taxableAmount: subtotal,
    vatAmount,
    total,
    status: seed.status as any,
    notes: 'Thank you for your business. Compliant with ZATCA Phase 2 UBL 2.1 specifications.',
    paymentTerms: 'Net 30 Days (Bank Transfer)',
    icv: seed.num,
    uuid: `550e8400-e29b-41d4-a716-446655440${seed.num}`,
    previousHash: `NWU4Y2I1MzA1NDc5ZDEyY2I3ZTRmN2E4YzB${seed.num - 1}==`,
    xmlHash: `Y2I5ZTRkM2E4ZjEwM2I4Y2Q5ZTFmN2E0YjI${seed.num}==`,
    qrTlvBase64,
    items: [
      {
        id: `line-${index}-1`,
        productId: prodA.id,
        name: prodA.name,
        qty: seed.qty1,
        price: prodA.price,
        discount: 0,
        vatCategory: prodA.vatCategory,
        vatAmount: vatA,
        total: grossA + vatA,
      },
      {
        id: `line-${index}-2`,
        productId: prodB.id,
        name: prodB.name,
        qty: seed.qty2,
        price: prodB.price,
        discount: 0,
        vatCategory: prodB.vatCategory,
        vatAmount: vatB,
        total: grossB + vatB,
      },
    ],
    auditTrail: [
      {
        id: `aud-${seed.num}-1`,
        timestamp: `${seed.date} 14:20:05`,
        action: 'INVOICE_CREATED',
        actor: 'Ahmed Al-Faisal (Admin)',
        details: `Created ${seed.type} invoice ${number}`,
      },
      {
        id: `aud-${seed.num}-2`,
        timestamp: `${seed.date} 14:22:10`,
        action: `STATUS_${seed.status}`,
        actor: 'ZATCA Mock Gateway',
        details: `Cryptographic stamp & TLV QR generated (${seed.status} MOCK)`,
      },
    ],
  };
  
});
export const MONTHLY_SALES_DATA = [
  { month: 'Nov', sales: 142000, vat: 21300 },
  { month: 'Dec', sales: 168000, vat: 25200 },
  { month: 'Jan', sales: 155000, vat: 23250 },
  { month: 'Feb', sales: 179000, vat: 26850 },
  { month: 'Mar', sales: 192000, vat: 28800 },
  { month: 'Apr', sales: 184000, vat: 27600 },
  { month: 'May', sales: 205000, vat: 30750 },
  { month: 'Jun', sales: 218000, vat: 32700 },
  { month: 'Jul', sales: 211000, vat: 31650 },
  { month: 'Aug', sales: 229000, vat: 34350 },
  { month: 'Sep', sales: 238000, vat: 35700 },
  { month: 'Oct', sales: 245800, vat: 32100 },
];