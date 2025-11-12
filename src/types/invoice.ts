export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Layer {
  id: string;
  title: string;
  responsibilityPercent: number;
  items: InvoiceItem[];
  subtotal: number;
  remarks: string;
}

// Signature metadata stored temporarily during editing session
export interface Signature {
  id: string;
  name: string;
  src: string; // data URL for preview
  type: string; // MIME type
  size: number; // bytes
  width: number;
  height: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  /** Sales Order / S.No separate from invoice number */
  soNumber: string;
  invoiceDate: string;
  dueDate: string;
  companyName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  signatoryName: string;
  signatoryRole: string;
  /** Legacy single signature field (kept for backward compatibility) */
  signatureImage: string;
  /** Up to 4 signatures uploaded during session */
  signatures?: Signature[];
  /** Name of the signature to display in preview */
  selectedSignatureName?: string;
  layers: Layer[];
  /** Amount remaining to be paid */
  dueAmount: number;
  /** Amount already paid */
  paidAmount: number;
  /** Control visibility of due amount in preview */
  showDueAmount: boolean;
  /** Control visibility of paid amount in preview */
  showPaidAmount: boolean;
  /** Free-form notes displayed in preview */
  notes: string;
  grandTotal: number;
}
