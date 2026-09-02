import type {
    InputHTMLAttributes,
    ReactNode,
  } from "react";
  
  interface TextInputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    error?: string;
  }
  
  const TextInput = ({
    label,
    icon,
    error,
    id,
    className = "",
    ...props
  }: TextInputProps) => {
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
            className={`
              h-11 w-full rounded-md border
              border-slate-200 bg-white
              px-3 text-sm text-slate-900
              outline-none transition
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
  
        </div>
  
        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
  
      </div>
    );
  };
  
  export default TextInput;