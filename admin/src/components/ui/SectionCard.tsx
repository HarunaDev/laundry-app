import type { JSX, ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

const SectionCard = ({
  title,
  children,
  action,
}: SectionCardProps): JSX.Element => {
  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          {title}
        </h2>

        {action}
      </div>

      {children}
    </section>
  );
};

export default SectionCard;