import type { JSX } from "react";
import SectionCard from "../../../../components/ui/SectionCard";

const OrdersOverview = (): JSX.Element => {
  return (
    <SectionCard
      title="Orders Overview"
      action={
        <button
          type="button"
          className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600"
        >
          This Week
        </button>
      }
    >
      <div className="h-56">
        <svg
          viewBox="0 0 500 220"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="ordersGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#3B82F6"
                stopOpacity="0.25"
              />

              <stop
                offset="100%"
                stopColor="#3B82F6"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path
            d="
              M0,180
              L30,150
              L60,135
              L90,100
              L120,90
              L150,115
              L180,145
              L210,130
              L240,105
              L270,105
              L300,100
              L330,75
              L360,60
              L390,85
              L420,125
              L450,135
              L480,110
              L500,85
              L500,220
              L0,220
              Z
            "
            fill="url(#ordersGradient)"
          />

          <path
            d="
              M0,180
              L30,150
              L60,135
              L90,100
              L120,90
              L150,115
              L180,145
              L210,130
              L240,105
              L270,105
              L300,100
              L330,75
              L360,60
              L390,85
              L420,125
              L450,135
              L480,110
              L500,85
            "
            fill="none"
            stroke="#2563EB"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>May 12</span>
        <span>May 13</span>
        <span>May 14</span>
        <span>May 15</span>
        <span>May 16</span>
        <span>May 17</span>
        <span>May 18</span>
      </div>
    </SectionCard>
  );
};

export default OrdersOverview;