import React, { forwardRef } from 'react';

const Select = forwardRef(
  ({ label, error, helperText, options = [], id, required, className = '', children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 mb-1">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-3 py-2 bg-white border rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:border-gov-600 transition-colors ${
            error ? 'border-rose-300' : 'border-slate-300'
          } ${className}`}
          {...props}
        >
          {children ||
            options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
