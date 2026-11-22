export type PaymentMethod = "Cash" | "Transfer";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Rejected";

export interface Payment {
  id: number;
  laundryOrderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  receiptFileName: string | null;
  receiptContentType: string | null;
  receiptFileSize: number | null;
  receiptUploadedAt: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
  rejectionReason: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  createdAt: string;
}

export interface PaymentReceipt {
    id: number;
    paymentId: number;
    fileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
    isCurrent: boolean;
    isRejected: boolean;
    rejectedBy: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    fileDeletedAt: string | null;
    isFileAvailable: boolean;
  }

export interface PaymentPagination {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  }
  
  export interface PaginatedPayments {
    items: Payment[];
    meta: PaymentPagination;
  }

export interface PaymentFilters {
  PageNumber: number;
  PageSize: number;
  PaymentStatus?: PaymentStatus;
  PaymentMethod?: PaymentMethod;
  LaundryOrderId?: number;
  FromDate?: string;
  ToDate?: string;
}

export interface PaymentApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type GetPaymentsResponse = PaymentApiResponse<{
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    items: Payment[];
  }>;
  

export interface UploadReceiptRequest {
  orderId: number;
  file: File;
}

export interface RejectPaymentRequest {
  orderId: number;
  reason: string;
}

export type PaymentReceiptHistoryResponse =
  PaymentApiResponse<PaymentReceipt[]>;

export interface DownloadPaymentReceiptRequest {
  orderId: number;
  receiptId?: number;
}