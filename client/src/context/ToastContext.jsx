import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (msg) => addToast({ message: msg, type: 'success' });
  const error = (msg) => addToast({ message: msg, type: 'error' });
  const warning = (msg) => addToast({ message: msg, type: 'warning' });
  const info = (msg) => addToast({ message: msg, type: 'info' });

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bg = 'bg-slate-900 text-white';
          let Icon = Info;
          if (toast.type === 'success') {
            bg = 'bg-emerald-700 text-white';
            Icon = CheckCircle2;
          } else if (toast.type === 'error') {
            bg = 'bg-rose-700 text-white';
            Icon = AlertCircle;
          } else if (toast.type === 'warning') {
            bg = 'bg-amber-600 text-white';
            Icon = AlertTriangle;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg shadow-elevation ${bg} transition-all duration-300 transform translate-y-0`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-3 text-white/80 hover:text-white"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
