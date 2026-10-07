export interface StoreRef {
  name: string;
}

export interface CustomerRef {
  name: string;
  phone: string | null;
  email: string | null;
}

export interface PaymentRef {
  status: string;
  paidAmount: number;
}

export interface ReceiptItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

/**
 * Receipt data contract — single source of truth for receipt shape (AD-5).
 * All money fields are raw numbers; formatting happens at consumption via formatMXN.
 * @format iso8601 generatedAt
 * @pattern ^ORD-\d+$ folio
 */
export interface Receipt {
  /** Folio in format ORD-<orderId> */
  folio: string;
  store: StoreRef;
  customer: CustomerRef | null;
  items: ReceiptItem[];
  totals: {
    subtotal: number;
    total: number;
    paid: number;
  };
  paymentStatus: string;
  /** ISO-8601 timestamp */
  generatedAt: string;
}