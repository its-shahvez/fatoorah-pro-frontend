import type { DecodedTlvField, Invoice, Organization } from '../types';

export function formatSAR(amount: number): string {
  return `SAR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Converts a Gregorian YYYY-MM-DD string to an Islamic Hijri date string
 */
export function toHijriDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '1448 AH';
  }
}

/**
 * Encodes the 5 mandatory ZATCA fields into Tag-Length-Value (TLV) Base64 format
 */
export function generateZatcaTlvBase64(params: {
  sellerName: string;
  vatNumber: string;
  timestamp: string;
  totalWithVat: string;
  vatAmount: string;
}): string {
  const encoder = new TextEncoder();
  const entries = [
    { tag: 1, value: params.sellerName },
    { tag: 2, value: params.vatNumber },
    { tag: 3, value: params.timestamp },
    { tag: 4, value: params.totalWithVat },
    { tag: 5, value: params.vatAmount },
  ];

  const byteChunks: Uint8Array[] = [];
  let totalLength = 0;

  for (const entry of entries) {
    const valueBytes = encoder.encode(entry.value);
    const chunk = new Uint8Array(2 + valueBytes.length);
    chunk[0] = entry.tag;
    chunk[1] = valueBytes.length;
    chunk.set(valueBytes, 2);
    byteChunks.push(chunk);
    totalLength += chunk.length;
  }

  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of byteChunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  let binary = '';
  for (let i = 0; i < combined.byteLength; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a ZATCA Base64 TLV string back into human-readable Tag 1-5 rows
 */
export function decodeZatcaTlv(base64Str: string): DecodedTlvField[] {
  try {
    const binary = atob(base64Str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const decoder = new TextDecoder();
    const labels: Record<number, string> = {
      1: 'Seller Name',
      2: 'Seller VAT Number',
      3: 'ISO Timestamp',
      4: 'Invoice Total (with VAT)',
      5: 'VAT Total Amount',
    };

    const result: DecodedTlvField[] = [];
    let i = 0;
    while (i < bytes.length) {
      const tag = bytes[i];
      const length = bytes[i + 1];
      const valueBytes = bytes.slice(i + 2, i + 2 + length);
      const value = decoder.decode(valueBytes);
      result.push({
        tag,
        label: labels[tag] || `Tag ${tag}`,
        value,
        byteLength: length,
        hexTag: `0x0${tag}`,
      });
      i += 2 + length;
    }
    return result;
  } catch {
    return [];
  }
}

/**
 * Generates authentic ZATCA UBL 2.1 XML for any invoice
 */
export function generateUblXml(invoice: Invoice, org: Organization): string {
  const typeCode = invoice.type === 'Standard' || invoice.type === 'Credit' ? '388' : '383';
  const subType = invoice.type === 'Standard' ? '0100000' : '0200000';

  const linesXml = invoice.items
    .map(
      (item, idx) => `
  <cac:InvoiceLine>
    <cbc:ID>${idx + 1}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="PCE">${item.qty}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="SAR">${(item.qty * item.price - item.discount).toFixed(2)}</cbc:LineExtensionAmount>
    <cac:TaxTotal>
      <cbc:TaxAmount currencyID="SAR">${item.vatAmount.toFixed(2)}</cbc:TaxAmount>
      <cbc:RoundingAmount currencyID="SAR">${item.total.toFixed(2)}</cbc:RoundingAmount>
    </cac:TaxTotal>
    <cac:Item>
      <cbc:Name>${item.name}</cbc:Name>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>${item.vatCategory}</cbc:ID>
        <cbc:Percent>${item.vatCategory === 'S' ? '15.00' : '0.00'}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="SAR">${item.price.toFixed(2)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
  <cbc:ID>${invoice.number}</cbc:ID>
  <cbc:UUID>${invoice.uuid}</cbc:UUID>
  <cbc:IssueDate>${invoice.date}</cbc:IssueDate>
  <cbc:IssueTime>${invoice.time}</cbc:IssueTime>
  <cbc:InvoiceTypeCode name="${subType}">${typeCode}</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>
  <cac:AdditionalDocumentReference>
    <cbc:ID>ICV</cbc:ID>
    <cbc:UUID>${invoice.icv}</cbc:UUID>
  </cac:AdditionalDocumentReference>
  <cac:AdditionalDocumentReference>
    <cbc:ID>PIH</cbc:ID>
    <cac:Attachment>
      <cbc:EmbeddedDocumentBinaryObject mimeCode="text/plain">${invoice.previousHash}</cbc:EmbeddedDocumentBinaryObject>
    </cac:Attachment>
  </cac:AdditionalDocumentReference>
  <cac:AdditionalDocumentReference>
    <cbc:ID>QR</cbc:ID>
    <cac:Attachment>
      <cbc:EmbeddedDocumentBinaryObject mimeCode="text/plain">${invoice.qrTlvBase64}</cbc:EmbeddedDocumentBinaryObject>
    </cac:Attachment>
  </cac:AdditionalDocumentReference>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification><cbc:ID schemeID="CRN">${org.cr}</cbc:ID></cac:PartyIdentification>
      <cac:PostalAddress>
        <cbc:StreetName>${org.address}</cbc:StreetName>
        <cbc:BuildingNumber>${org.buildingNo}</cbc:BuildingNumber>
        <cbc:CityName>${org.city}</cbc:CityName>
        <cbc:PostalZone>${org.postalCode}</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>SA</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${org.vat}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${org.name} | ${org.nameAr}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyTaxScheme>
        <cbc:CompanyID>${invoice.customerVat}</cbc:CompanyID>
        <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
      </cac:PartyTaxScheme>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName>${invoice.customerName}</cbc:RegistrationName>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="SAR">${invoice.vatAmount.toFixed(2)}</cbc:TaxAmount>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="SAR">${invoice.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="SAR">${invoice.taxableAmount.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="SAR">${invoice.total.toFixed(2)}</cbc:TaxInclusiveAmount>
    <cbc:AllowanceTotalAmount currencyID="SAR">${invoice.discountTotal.toFixed(2)}</cbc:AllowanceTotalAmount>
    <cbc:PayableAmount currencyID="SAR">${invoice.total.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>${linesXml}
</Invoice>`;
}