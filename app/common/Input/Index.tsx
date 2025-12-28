import { forwardRef } from "react";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  description?: string;
  error?: string;
  label?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      onChange,
      onKeyDown,
      value,
      name,
      id,
      description,
      placeholder,
      error,
      disabled,
      className,
      label,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {description && (
          <label
            htmlFor={id || name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {description}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...rest}
          className={`px-4 py-3 rounded-lg disabled:cursor-not-allowed bg-white text-gray-800 border border-gray-300 placeholder-gray-500 transition duration-150 
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50
            ${className ?? ""}`}
        />

        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
