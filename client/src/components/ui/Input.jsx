import React, { forwardRef } from 'react';

const Input = forwardRef(
  ({ label, error, helperText, id, className = '', required, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:border-gov-600 transition-colors ${
            error
              ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500'
              : 'border-slate-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
