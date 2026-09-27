import React from 'react';

const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#111a2e] rounded-lg border border-slate-200 dark:border-[#1e2c45] shadow-subtle transition-colors duration-200 ${
        hover ? 'transition-all duration-200 hover:shadow-elevation hover:border-gov-300 dark:hover:border-sky-500/40 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
