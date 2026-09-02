import type {
    ButtonHTMLAttributes,
    ReactNode,
  } from "react";
  
  interface PrimaryButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
  }
  
  const PrimaryButton = ({
    children,
    className = "",
    ...props
  }: PrimaryButtonProps) => {
    return (
      <button
        className={`
          flex h-11 w-full items-center
          justify-center rounded-md
          bg-blue-600 px-4
          text-sm font-medium text-white
          shadow-sm transition
          hover:bg-blue-700
          focus:outline-none
          focus:ring-4
          focus:ring-blue-200
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default PrimaryButton;