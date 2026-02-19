import React from 'react';
import { useToast, ToastType } from '../context/ToastContext';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-white dark:bg-slate-800 border-l-4 border-emerald-500 text-slate-800 dark:text-slate-100 shadow-lg shadow-emerald-500/10';
      case 'error':
        return 'bg-white dark:bg-slate-800 border-l-4 border-rose-500 text-slate-800 dark:text-slate-100 shadow-lg shadow-rose-500/10';
      case 'warning':
        return 'bg-white dark:bg-slate-800 border-l-4 border-amber-500 text-slate-800 dark:text-slate-100 shadow-lg shadow-amber-500/10';
      case 'info':
      default:
        return 'bg-white dark:bg-slate-800 border-l-4 border-blue-500 text-slate-800 dark:text-slate-100 shadow-lg shadow-blue-500/10';
    }
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  const getIconColor = (type: ToastType) => {
     switch (type) {
      case 'success': return 'text-emerald-500';
      case 'error': return 'text-rose-500';
      case 'warning': return 'text-amber-500';
      case 'info': return 'text-blue-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[60] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg transform transition-all duration-300 animate-in slide-in-from-right-10 fade-in ${getStyles(toast.type)}`}
        >
          <span className={`material-symbols-outlined text-xl mt-0.5 ${getIconColor(toast.type)}`}>
            {getIcon(toast.type)}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;