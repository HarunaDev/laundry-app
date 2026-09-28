// import type { JSX } from "react";
// import SectionCard from "./SectionCard";

// const revenueData = [
//   25,
//   45,
//   30,
//   70,
//   40,
//   55,
//   85,
//   35,
//   60,
//   100,
//   45,
//   75,
// ];

// const RevenueOverview = (): JSX.Element => {
//   return (
//     <SectionCard
//       title="Revenue Overview"
//       action={
//         <button
//           type="button"
//           className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600"
//         >
//           This Week
//         </button>
//       }
//     >
//       <div className="mb-5">
//         <p className="text-sm text-gray-500">
//           Total Revenue
//         </p>

//         <h3 className="mt-1 text-2xl font-semibold text-gray-900">
//           $2,450.00
//         </h3>

//         <p className="mt-2 text-xs text-green-600">
//           ↑ 15.5% from last week
//         </p>
//       </div>

//       <div className="flex h-40 items-end justify-between gap-2">
//         {revenueData.map((height, index) => (
//           <div
//             key={index}
//             className="flex flex-1 items-end"
//           >
//             <div
//               className="w-full rounded-t-sm bg-blue-500"
//               style={{
//                 height: `${height}%`,
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </SectionCard>
//   );
// };

// export default RevenueOverview;

import type { JSX } from "react";
import SectionCard from "../../../../components/ui/SectionCard";

import type {
  DashboardPeriod,
  RevenueOverviewItem,
  DashboardSummary,
} from "../../../../redux/slices/dashboardApiSlice";
interface RevenueOverviewProps {
  summary: DashboardSummary | null;
  data: RevenueOverviewItem[];
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
  isLoading: boolean;
  isFetching: boolean;
}

const RevenueOverview = ({
  summary,
  data,
  period,
  onPeriodChange,
  isLoading,
  isFetching,
}: RevenueOverviewProps): JSX.Element => {
  const periodLabel: Record<DashboardPeriod, string> = {
    week: "This Week",
    month: "This Month",
    year: "This Year",
  };

  const maxRevenue = Math.max(...data.map((item) => item.revenue), 0);

  return (
    <SectionCard
      title="Revenue Overview"
      action={
        <select
          value={period}
          onChange={(event) =>
            onPeriodChange(event.target.value as DashboardPeriod)
          }
          disabled={isLoading}
          className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 outline-none"
        >
          {" "}
          {/* <option value="day">Today</option>{" "} */}
          <option value="week">This Week</option>{" "}
          <option value="month">This Month</option>{" "}
          <option value="year">This Year</option>{" "}
        </select>
      }
    >
      {isLoading ? (
        <div className="py-10 text-center text-sm text-gray-400">
          {" "}
          Loading revenue...{" "}
        </div>
      ) : (
        <>
          {" "}
          <div className="mb-5">
            {" "}
            <p className="text-sm text-gray-500"> Total Revenue </p>{" "}
            <h3 className="mt-1 text-2xl font-semibold text-gray-900">
              {" "}
              ₦
              {(summary?.totalRevenue ?? 0).toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
            </h3>{" "}
            <p
              className={`mt-2 text-xs ${
                (summary?.revenueChangePercentage ?? 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {(summary?.revenueChangePercentage ?? 0) >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(summary?.revenueChangePercentage ?? 0).toFixed(1)}% from
              previous period
            </p>
          </div>{" "}
          {isFetching && (
            <p className="mb-2 text-xs text-gray-400"> Updating... </p>
          )}{" "}
          {data.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-gray-400">
              {" "}
              No revenue data available.{" "}
            </div>
          ) : (
            <div className="h-40 w-full overflow-x-auto">
              {" "}
              <div
                className="flex h-full w-full items-end gap-3"
                style={{
                  minWidth: `${Math.max(data.length * 48, 100)}px`,
                }}
              >
                {" "}
                {data.map((item) => {
                  // const maxRevenue = Math.max(
                  //   ...data.map((revenueItem) => revenueItem.revenue),
                  //   1,
                  // );

                  // const heightPercentage =
                  //   (item.revenue / maxRevenue) * 100;

                  const heightPercentage =
                    maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div
                      key={`${item.date}`}
                      className="flex h-full flex-1 items-end justify-center"
                      title={`₦${item.revenue.toLocaleString("en-NG", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                    >
                      {" "}
                      <div
                        className="w-8 rounded-t-sm bg-blue-500"
                        style={{ height: `${Math.max(heightPercentage, 2)}%` }}

                        // title={`₦${item.revenue.toLocaleString("en-NG", {
                        //   minimumFractionDigits: 2,
                        //   maximumFractionDigits: 2,
                        // })}`}
                      />
                    </div>
                  );
                })}{" "}
              </div>{" "}
            </div>
          )}{" "}
          <p className="mt-2 text-xs text-gray-400"> {periodLabel[period]} </p>{" "}
        </>
      )}
    </SectionCard>
  );
};

export default RevenueOverview;
