import {
    useState,
    type InputHTMLAttributes,
    type ReactNode,
  } from "react";
  
  interface PasswordInputProps
    extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type"
    > {
    label: string;
    icon?: ReactNode;
  }
  
  const PasswordInput = ({
    label,
    icon,
    id,
    className = "",
    ...props
  }: PasswordInputProps) => {
    const [showPassword, setShowPassword] =
      useState(false);
  
    return (
      <div className="space-y-2">
  
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
  
        <div className="relative">
  
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              {icon}
            </div>
          )}
  
          <input
            id={id}
            type={
              showPassword
                ? "text"
                : "password"
            }
            className={`
              h-11 w-full rounded-md border
              border-slate-200 bg-white
              px-3 pr-12 text-sm
              text-slate-900 outline-none
              transition
              placeholder:text-slate-400
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              disabled:cursor-not-allowed
              disabled:bg-slate-100
              ${icon ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
  
          <button
            type="button"
            onClick={() =>
              setShowPassword(
                (previousValue) =>
                  !previousValue
              )
            }
            className="absolute inset-y-0 right-3 text-sm text-slate-400 transition hover:text-blue-600"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
          >
            {showPassword
              ? "Hide"
              : "Show"}
          </button>
  
        </div>
  
      </div>
    );
  };
  
  export default PasswordInput;