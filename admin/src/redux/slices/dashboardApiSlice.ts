import { generalApiSlice } from "../apiSlice";

export type DashboardPeriod =
  | "week"
  | "month"
  | "year";

export type DashboardOrderStatus =
  | "Pending"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | (string & {});

export interface DashboardSummary {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  newCustomers: number;
  ordersChangePercentage: number;
  completedOrdersChangePercentage: number;
  revenueChangePercentage: number;
  newCustomersChangePercentage: number;
}

export interface OrdersOverviewItem {
  date: string;
  orderCount: number;
}

export interface RecentOrder {
  orderId: number;
  customerName: string;
  createdAt: string;
  status: DashboardOrderStatus;
  grandTotal: number;
}

export interface RevenueOverviewItem {
  date: string;
  revenue: number;
}

export interface DashboardMetrics {
  summary: DashboardSummary;
  ordersOverview: OrdersOverviewItem[];
  recentOrders: RecentOrder[];
  revenueOverview: RevenueOverviewItem[];
}

export interface DashboardMetricsResponse {
  success: boolean;
  message: string;
  data: DashboardMetrics;
}

const dashboardApiSlice = generalApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardMetrics: builder.query<
      DashboardMetricsResponse,
      DashboardPeriod
    >({
      query: (period) => ({
        url: `/dashboard/metrics?period=${period}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardMetricsQuery,
} = dashboardApiSlice;