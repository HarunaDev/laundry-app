import type { JSX, ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: ReactNode;
}

const PageHeader = ({
  title,
  description,
  breadcrumb,
}: PageHeaderProps): JSX.Element => {
  return (
    <div className="mb-2">
      {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>

      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
