"use client";

import React from "react";

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      {label && <label className="mb-1 text-gray-700">{label}</label>}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="px-4 py-3 w-full rounded-lg disabled:cursor-not-allowed bg-white text-gray-800 border border-gray-300 placeholder-gray-500 transition duration-150 
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
