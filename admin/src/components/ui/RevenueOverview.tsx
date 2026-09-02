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
import SectionCard from "./SectionCard";

const revenueData = [
  25,
  45,
  30,
  70,
  40,
  55,
  85,
  35,
  60,
  100,
  45,
  75,
];

const RevenueOverview = (): JSX.Element => {
  return (
    <SectionCard
      title="Revenue Overview"
      action={
        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600"
        >
          This Week
        </button>
      }
    >
      <div className="mb-5">
        <p className="text-sm text-gray-500">
          Total Revenue
        </p>

        <h3 className="mt-1 text-2xl font-semibold text-gray-900">
          $2,450.00
        </h3>

        <p className="mt-2 text-xs text-green-600">
          ↑ 15.5% from last week
        </p>
      </div>

      {/* Chart */}
      <div className="h-40 w-full">
        <div className="flex h-full w-full items-end gap-2">
          {revenueData.map((height, index) => (
            <div
              key={index}
              className="flex h-full flex-1 items-end"
            >
              <div
                className="w-full rounded-t-sm bg-blue-500"
                style={{
                  height: `${height}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
};

export default RevenueOverview;