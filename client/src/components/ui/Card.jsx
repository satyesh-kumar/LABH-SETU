import React from 'react';

const Card = ({ children, className = '', hover = false, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-slate-200 shadow-subtle ${
        hover ? 'transition-all duration-200 hover:shadow-elevation hover:border-gov-300 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
