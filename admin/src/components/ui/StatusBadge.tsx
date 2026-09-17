import type { JSX } from "react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({
  status,
}: StatusBadgeProps): JSX.Element => {
  const normalizedStatus =
    status.toLowerCase();

  const statusStyles: Record<
    string,
    string
  > = {
    pending:
      "bg-orange-50 text-orange-600",

    processing:
      "bg-blue-50 text-blue-600",

    completed:
      "bg-green-50 text-green-600",

    cancelled:
      "bg-red-50 text-red-600",
  };

  const style =
    statusStyles[normalizedStatus] ??
    "bg-gray-100 text-gray-600";

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-medium
        ${style}
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;