// import type { JSX } from "react";
// import SectionCard from "../../../../components/ui/SectionCard";
// import type {
//   DashboardPeriod,
//   OrdersOverviewItem,
// } from "../../../../redux/slices/dashboardApiSlice";
// import { formatChartDate } from "../../../../utils/formatDate";

// interface OrdersOverviewProps {
//   data: OrdersOverviewItem[];
//   period: DashboardPeriod;
//   onPeriodChange: (period: DashboardPeriod) => void;
//   isLoading: boolean;
//   isFetching: boolean;
// }

// const OrdersOverview = ({
//   data,
//   period,
//   onPeriodChange,
//   isLoading,
//   isFetching,
// }: OrdersOverviewProps): JSX.Element => {
//   const periodLabel: Record<DashboardPeriod, string> = {
//     week: "This Week",
//     month: "This Month",
//     year: "This Year",
//   };
//   return (
//     <SectionCard
//       title="Orders Overview"
//       action={
//         <select
//           value={period}
//           onChange={(event) =>
//             onPeriodChange(event.target.value as DashboardPeriod)
//           }
//           disabled={isLoading}
//           className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 outline-none"
//         >
//           {" "}
//           <option value="week">This Week</option>{" "}
//           <option value="month">This Month</option>{" "}
//           <option value="year">This Year</option>{" "}
//         </select>
//       }
//     >

//       <div className="relative">
//         {" "}
//         {isFetching && !isLoading && (
//           <div className="absolute right-0 top-0 text-xs text-gray-400">
//             {" "}
//             Updating...{" "}
//           </div>
//         )}{" "}
//         {isLoading ? (
//           <div className="flex h-56 items-center justify-center text-sm text-gray-400">
//             {" "}
//             Loading orders...{" "}
//           </div>
//         ) : data.length === 0 ? (
//           <div className="flex h-56 items-center justify-center text-sm text-gray-400">
//             {" "}
//             No order data available.{" "}
//           </div>
//         ) : (
//           <>
//             {" "}
//             <div className="h-56">
//               {" "}
//               <svg
//                 viewBox="0 0 500 220"
//                 className="h-full w-full"
//                 preserveAspectRatio="none"
//               >
//                 {" "}
//                 <defs>
//                   {" "}
//                   <linearGradient
//                     id="ordersGradient"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     {" "}
//                     <stop
//                       offset="0%"
//                       stopColor="#3B82F6"
//                       stopOpacity="0.25"
//                     />{" "}
//                     <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />{" "}
//                   </linearGradient>{" "}
//                 </defs>{" "}
//                 {/* Keep your existing chart rendering here. The important change is that the chart should eventually be generated from `data`. */}{" "}
//                 <path
//                   d=" M0,180 L30,150 L60,135 L90,100 L120,90 L150,115 L180,145 L210,130 L240,105 L270,105 L300,100 L330,75 L360,60 L390,85 L420,125 L450,135 L480,110 L500,85 L500,220 L0,220 Z "
//                   fill="url(#ordersGradient)"
//                 />{" "}
//                 <path
//                   d=" M0,180 L30,150 L60,135 L90,100 L120,90 L150,115 L180,145 L210,130 L240,105 L270,105 L300,100 L330,75 L360,60 L390,85 L420,125 L450,135 L480,110 L500,85 "
//                   fill="none"
//                   stroke="#2563EB"
//                   strokeWidth="3"
//                 />{" "}
//               </svg>{" "}
//             </div>{" "}
//             <div className="mt-2 flex justify-between text-xs text-gray-400">
//               {" "}
//               {data.map((item) => (
//                 <span key={item.date}> {formatChartDate(item.date)} </span>
//               ))}{" "}
//             </div>{" "}
//           </>
//         )}{" "}
//         <p className="mt-2 text-xs text-gray-400"> {periodLabel[period]} </p>{" "}
//       </div>
//     </SectionCard>
//   );
// };

// export default OrdersOverview;

import type { JSX } from "react";
import SectionCard from "../../../../components/ui/SectionCard";
import type {
  DashboardPeriod,
  OrdersOverviewItem,
} from "../../../../redux/slices/dashboardApiSlice";
import { formatChartDate } from "../../../../utils/formatDate";

interface OrdersOverviewProps {
  data: OrdersOverviewItem[];
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  isLoading: boolean;
  isFetching: boolean;
}

const OrdersOverview = ({
  data,
  period,
  onPeriodChange,
  isLoading,
  isFetching,
}: OrdersOverviewProps): JSX.Element => {
  const periodLabel: Record<DashboardPeriod, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
  };

  const chartWidth = 500;
  const chartHeight = 220;
  const chartPadding = 20;

  const maxOrderCount = Math.max(...data.map((item) => item.orderCount), 1);

  const getX = (index: number): number => {
    if (data.length === 1) {
      return chartPadding;
    }

    return (
      chartPadding +
      (index / (data.length - 1)) * (chartWidth - chartPadding * 2)
    );
  };

  const getY = (orderCount: number): number => {
    const chartBottom = chartHeight - chartPadding;
    const chartTop = chartPadding;

    return (
      chartBottom - (orderCount / maxOrderCount) * (chartBottom - chartTop)
    );
  };

  const linePath = data
    .map((item, index) => {
      const x = getX(index);
      const y = getY(item.orderCount);

      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  const areaPath =
    data.length > 0
      ? `${linePath} L${getX(data.length - 1)},${
          chartHeight - chartPadding
        } L${getX(0)},${chartHeight - chartPadding} Z`
      : "";

  return (
    <SectionCard
      title="Orders Overview"
      action={
        <select
          value={period}
          onChange={(event) =>
            onPeriodChange(event.target.value as DashboardPeriod)
          }
          disabled={isLoading}
          className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 outline-none"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      }
    >
      <div className="relative">
        {isFetching && !isLoading && (
          <div className="absolute right-0 top-0 z-10 text-xs text-gray-400">
            Updating...
          </div>
        )}

        {isLoading ? (
          <div className="flex h-56 items-center justify-center text-sm text-gray-400">
            Loading orders...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-sm text-gray-400">
            No order data available.
          </div>
        ) : (
          <>
            <div className="h-56 w-full">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-full w-full"
                preserveAspectRatio="none"
                role="img"
                aria-label="Orders overview chart"
              >
                <defs>
                  <linearGradient
                    id="ordersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />

                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {data.length > 1 && (
                  <>
                    <path d={areaPath} fill="url(#ordersGradient)" />

                    <path
                      d={linePath}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {data.map((item, index) => {
                  const x = getX(index);
                  const y = getY(item.orderCount);

                  return (
                    <circle key={item.date} cx={x} cy={y} r="4" fill="#2563EB">
                      <title>
                        {`${formatChartDate(item.date)}: ${item.orderCount} ${
                          item.orderCount === 1 ? "order" : "orders"
                        }`}
                      </title>
                    </circle>
                  );
                })}
              </svg>
            </div>

            <div className="mt-2 flex justify-between gap-2 overflow-hidden text-xs text-gray-400">
              {data.map((item) => (
                <span key={item.date} className="min-w-0 truncate text-center">
                  {formatChartDate(item.date)}
                </span>
              ))}
            </div>
          </>
        )}

        <p className="mt-2 text-xs text-gray-400">{periodLabel[period]}</p>
      </div>
    </SectionCard>
  );
};

export default OrdersOverview;
