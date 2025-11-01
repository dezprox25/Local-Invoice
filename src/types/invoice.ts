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

export interface InvoiceData {
  invoiceNumber: string;
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
  signatureImage: string;
  layers: Layer[];
  /** Amount remaining to be paid */
  dueAmount: number;
  /** Amount already paid */
  paidAmount: number;
  /** Control visibility of due amount in preview */
  showDueAmount: boolean;
  /** Control visibility of paid amount in preview */
  showPaidAmount: boolean;
  grandTotal: number;
}
