import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({
  items,
}: BreadcrumbProps): ReactNode => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-gray-500"
    >
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex items-center gap-2"
        >
          <span
            className={
              index === items.length - 1
                ? "font-medium text-gray-700"
                : ""
            }
          >
            {item.label}
          </span>

          {index < items.length - 1 && (
            <ChevronRight
              size={14}
              className="text-gray-400"
            />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;