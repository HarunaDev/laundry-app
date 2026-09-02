import type { JSX, ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "positive" | "negative";
}

const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = "positive",
}: StatCardProps): JSX.Element => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            {value}
          </h3>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
          {icon}
        </div>
      </div>

      {change && (
        <p
          className={`mt-4 text-xs ${
            changeType === "positive"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
};

export default StatCard;