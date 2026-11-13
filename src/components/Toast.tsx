import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/90 text-white border-emerald-700',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-900/90 text-white border-rose-700',
          icon: <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-slate-900/90 text-white border-slate-700',
          icon: <Info className="w-5 h-5 text-indigo-300 shrink-0" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${style.bg} animate-in slide-in-from-bottom-5 duration-200`}
    >
      <div className="flex items-center gap-3">
        {style.icon}
        <p className="text-xs sm:text-sm font-medium leading-tight">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4 text-white/80" />
      </button>
    </div>
  );
};

export default ToastContainer;
