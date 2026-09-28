import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gov-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.99]';

  const variants = {
    primary: 'bg-gov-600 text-white hover:bg-gov-700 active:bg-gov-800 shadow-xs hover:shadow',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-2xs',
    outline: 'border border-gov-600 text-gov-600 hover:bg-gov-50 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-slate-800 active:bg-gov-100',
    ghost: 'text-gov-700 hover:bg-gov-50 dark:text-sky-400 dark:hover:bg-slate-800 active:bg-gov-100',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4.5 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3 gap-2.5 rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current flex-shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
