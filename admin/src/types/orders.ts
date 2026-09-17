export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Cancelled"
  | string;

export interface LaundryOrder {
  id: number;
  customerId: string;
  customerName: string;
  deliveryMethod: string;
  laundryLocation: string;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  deliveryPrice: number;
  itemsTotal: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
}

export interface LaundryOrderItem {
  laundryItemId: number;
  laundryItemName: string;
  laundryServiceName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface LaundryOrderDetails
  extends LaundryOrder {
  items: LaundryOrderItem[];
}

export interface FilterOrdersRequest {
  status: string;
  pageNumber: number;
  pageSize: number;
}

export interface OrdersMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  items: unknown[];
}

export interface FilterOrdersResponse {
  items: LaundryOrder[];
  meta: OrdersMeta;
}