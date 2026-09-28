import {
    useGetDashboardMetricsQuery,
    type DashboardPeriod,
  } from "../../../redux/slices/dashboardApiSlice";
  
  export const useDashboardMetrics = (
    period: DashboardPeriod = "week"
  ) => {
    const query = useGetDashboardMetricsQuery(period);
  
    return {
      data: query.data?.data ?? null,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      error: query.error,
      refetch: query.refetch,
    };
  };