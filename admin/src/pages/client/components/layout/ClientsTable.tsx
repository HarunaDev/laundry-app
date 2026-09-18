// import type { JSX } from "react";
// import { MoreHorizontal } from "lucide-react";
// import type { User } from "../../../../redux/slices/usersApiSlice";

// interface ClientsTableProps {
//   users: User[];
//   isLoading: boolean;
// }

// const ClientsTable = ({
//   users,
//   isLoading,
// }: ClientsTableProps): JSX.Element => {
//   if (isLoading) {
//     return (
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-gray-100 bg-gray-50">
//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Client
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Email
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Phone
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Total Orders
//               </th>

//               <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Status
//               </th>

//               <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {Array.from({ length: 5 }).map((_, index) => (
//               <tr
//                 key={index}
//                 className="border-b border-gray-100"
//               >
//                 <td className="px-6 py-4">
//                   <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="h-4 w-10 animate-pulse rounded bg-gray-200" />
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
//                 </td>

//                 <td className="px-6 py-4">
//                   <div className="ml-auto h-8 w-8 animate-pulse rounded bg-gray-200" />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   }

//   if (users.length === 0) {
//     return (
//       <div className="flex min-h-60 items-center justify-center px-6">
//         <div className="text-center">
//           <p className="text-sm font-medium text-gray-700">
//             No clients found.
//           </p>

//           <p className="mt-1 text-sm text-gray-500">
//             There are currently no clients to display.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[900px]">
//         <thead>
//           <tr className="border-b border-gray-100 bg-gray-50">
//             <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//               Client
//             </th>

//             <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//               Email
//             </th>

//             <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//               Phone
//             </th>

//             <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//               Total Orders
//             </th>

//             <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
//               Status
//             </th>

//             <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
//               Actions
//             </th>
//           </tr>
//         </thead>

//         <tbody>
//           {users.map((user) => (
//             <tr
//               key={user.id}
//               className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
//             >
//               <td className="px-6 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
//                     {user.userName.charAt(0).toUpperCase()}
//                   </div>

//                   <div>
//                     <p className="text-sm font-medium text-gray-900">
//                       {user.userName}
//                     </p>

//                     {/* <p className="text-xs text-gray-500">
//                       ID: {user.id}
//                     </p> */}
//                   </div>
//                 </div>
//               </td>

//               <td className="px-6 py-4 text-sm text-gray-600">
//                 {user.email}
//               </td>

//               <td className="px-6 py-4 text-sm text-gray-600">
//                 {user.phoneNumber || "Not provided"}
//               </td>

//               <td className="px-6 py-4">
//                 <span className="text-sm font-medium text-gray-900">
//                   {user.totalOrders}
//                 </span>
//               </td>

//               <td className="px-6 py-4">
//                 <span
//                   className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
//                     user.status === "Active"
//                       ? "bg-green-100 text-green-700"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {user.status}
//                 </span>
//               </td>

//               <td className="px-6 py-4 text-right">
//                 <button
//                   type="button"
//                   aria-label={`Actions for ${user.userName}`}
//                   className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
//                   onClick={() => {
//                     console.log("Client actions:", user.id);
//                   }}
//                 >
//                   <MoreHorizontal size={18} />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ClientsTable;

import { MoreHorizontal } from "lucide-react";

import DataTable, {
  type TableColumn,
} from "../../../../components/layout/DataTable";

import type { User } from "../../../../redux/slices/usersApiSlice";

interface ClientsTableProps {
  users: User[];
  isLoading: boolean;
}

const ClientsTable = ({
  users,
  isLoading,
}: ClientsTableProps) => {
  const columns: TableColumn<User>[] = [
    {
      key: "client",
      header: "Client",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
            {user.userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.userName}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "email",
      header: "Email",
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.email}
        </span>
      ),
    },

    {
      key: "phone",
      header: "Phone",
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.phoneNumber || "Not provided"}
        </span>
      ),
    },

    {
      key: "totalOrders",
      header: "Total Orders",
      render: (user) => (
        <span className="text-sm font-medium text-gray-900">
          {user.totalOrders}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",
      render: (user) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            user.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.status}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={`Actions for ${user.userName}`}
            className="
              inline-flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
            onClick={() => {
              console.log("Client actions:", user.id);
            }}
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowKey={(user) => user.id}
      isLoading={isLoading}
      emptyMessage="No clients found."
    />
  );
};

export default ClientsTable;