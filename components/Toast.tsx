
import React from 'react';
import { ICONS } from '../constants';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl glass-card animate-in slide-in-from-right-full transition-all duration-300 border-l-4 ${type === 'success' ? 'border-emerald-500' : 'border-red-500'}`}
      onClick={onClose}
    >
      {type === 'success' ? ICONS.Success : ICONS.Error}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Toast;
