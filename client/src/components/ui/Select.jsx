import React, { forwardRef } from 'react';

const Select = forwardRef(
  ({ label, error, helperText, options = [], id, required, className = '', children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString();

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/90 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-gov-600 focus:border-gov-600 transition-colors shadow-2xs ${
            error ? 'border-rose-400' : 'border-slate-300 dark:border-slate-700'
          } ${className}`}
          {...props}
        >
          {children ||
            options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const lbl = typeof opt === 'object' ? opt.label : opt;
              return (
                <option key={val} value={val} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {lbl}
                </option>
              );
            })}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
