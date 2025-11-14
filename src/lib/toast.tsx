import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle, HelpCircle } from 'lucide-react';
import { createElement } from 'react';

// Toast configurations with sharp, modern styling
const toastConfig = {
  duration: 3000,
  position: 'top-right' as const,
  style: {
    maxWidth: '420px',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
  },
};

// Icon wrapper component
const ToastIcon = ({ icon, color }: { icon: any; color: string }) => {
  return createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      color: color,
    },
    children: createElement(icon, { size: 24, strokeWidth: 2.5 })
  });
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    ...toastConfig,
    icon: createElement(ToastIcon, { icon: CheckCircle, color: '#10b981' }),
    style: {
      ...toastConfig.style,
      background: '#ffffff',
      color: '#1f2937',
      borderLeft: '4px solid #10b981',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...toastConfig,
    icon: createElement(ToastIcon, { icon: XCircle, color: '#ef4444' }),
    style: {
      ...toastConfig.style,
      background: '#ffffff',
      color: '#1f2937',
      borderLeft: '4px solid #ef4444',
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    ...toastConfig,
    duration: Infinity,
    style: {
      ...toastConfig.style,
      background: '#ffffff',
      color: '#1f2937',
      borderLeft: '4px solid #3b82f6',
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showInfoToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: createElement(ToastIcon, { icon: Info, color: '#3b82f6' }),
    style: {
      ...toastConfig.style,
      background: '#ffffff',
      color: '#1f2937',
      borderLeft: '4px solid #3b82f6',
    },
  });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    ...toastConfig,
    icon: createElement(ToastIcon, { icon: AlertTriangle, color: '#f59e0b' }),
    style: {
      ...toastConfig.style,
      background: '#ffffff',
      color: '#1f2937',
      borderLeft: '4px solid #f59e0b',
    },
  });
};

// Custom Alert Modal with modern design
export const showConfirmAlert = ({
  title = 'Konfirmasi',
  message,
  confirmText = 'Ya',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  type = 'warning',
}: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  type?: 'warning' | 'question' | 'info';
}): void => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  modal.style.backdropFilter = 'blur(4px)';
  
  const iconMap = {
    warning: { svg: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01', color: '#f59e0b', bg: '#fef3c7' },
    question: { svg: 'M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3 M12 17h.01', color: '#3b82f6', bg: '#dbeafe' },
    info: { svg: 'M12 16v-4 M12 8h.01', color: '#3b82f6', bg: '#dbeafe' },
  };

  const currentIcon = iconMap[type];

  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in" style="border: 1px solid rgba(0, 0, 0, 0.06);">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5" style="background-color: ${currentIcon.bg};">
          <svg class="w-7 h-7" style="color: ${currentIcon.color}; stroke-width: 2.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="${currentIcon.svg}"/>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">${title}</h3>
        <p class="text-base text-gray-600 leading-relaxed">${message}</p>
      </div>
      <div class="flex gap-3 mt-8">
        <button id="cancel-btn" class="flex-1 px-5 py-3 text-sm font-semibold rounded-lg border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
          ${cancelText}
        </button>
        <button id="confirm-btn" class="flex-1 px-5 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2" style="background-color: #3b82f6; box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);">
          ${confirmText}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes scale-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    .animate-scale-in {
      animation: scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #confirm-btn:hover {
      background-color: #2563eb !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);

  const cancelBtn = modal.querySelector('#cancel-btn') as HTMLButtonElement;
  const confirmBtn = modal.querySelector('#confirm-btn') as HTMLButtonElement;

  const cleanup = () => {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.2s ease-out';
    setTimeout(() => {
      document.body.removeChild(modal);
      document.head.removeChild(style);
    }, 200);
  };

  cancelBtn.onclick = () => {
    cleanup();
    onCancel?.();
  };

  confirmBtn.onclick = async () => {
    cleanup();
    await onConfirm();
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      cleanup();
      onCancel?.();
    }
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      cleanup();
      onCancel?.();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
};

export const showSuccessAlert = ({
  title = 'Berhasil!',
  message,
  onClose,
}: {
  title?: string;
  message: string;
  onClose?: () => void;
}): void => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  modal.style.backdropFilter = 'blur(4px)';
  
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in" style="border: 1px solid rgba(0, 0, 0, 0.06);">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5" style="background-color: #d1fae5;">
          <svg class="w-7 h-7" style="color: #10b981; stroke-width: 2.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">${title}</h3>
        <p class="text-base text-gray-600 leading-relaxed mb-6">${message}</p>
        <button id="ok-btn" class="w-full px-5 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2" style="background-color: #10b981; box-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);">
          OK
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const okBtn = modal.querySelector('#ok-btn') as HTMLButtonElement;

  const cleanup = () => {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.2s ease-out';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 200);
  };

  okBtn.onclick = () => {
    cleanup();
    onClose?.();
  };

  setTimeout(() => {
    if (document.body.contains(modal)) {
      cleanup();
      onClose?.();
    }
  }, 2500);
};

export const showErrorAlert = ({
  title = 'Error!',
  message,
  onClose,
}: {
  title?: string;
  message: string;
  onClose?: () => void;
}): void => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  modal.style.backdropFilter = 'blur(4px)';
  
  modal.innerHTML = `
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-scale-in" style="border: 1px solid rgba(0, 0, 0, 0.06);">
      <div class="text-center">
        <div class="mx-auto flex items-center justify-center h-14 w-14 rounded-full mb-5" style="background-color: #fee2e2;">
          <svg class="w-7 h-7" style="color: #ef4444; stroke-width: 2.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">${title}</h3>
        <p class="text-base text-gray-600 leading-relaxed mb-6">${message}</p>
        <button id="ok-btn" class="w-full px-5 py-3 text-sm font-semibold rounded-lg text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2" style="background-color: #ef4444; box-shadow: 0 1px 3px rgba(239, 68, 68, 0.3);">
          OK
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const okBtn = modal.querySelector('#ok-btn') as HTMLButtonElement;

  const cleanup = () => {
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.2s ease-out';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 200);
  };

  okBtn.onclick = () => {
    cleanup();
    onClose?.();
  };

  setTimeout(() => {
    if (document.body.contains(modal)) {
      cleanup();
      onClose?.();
    }
  }, 2500);
};

export const showAsyncToast = async <T,>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: any) => string);
  }
): Promise<T> => {
  return toast.promise(
    promise,
    {
      loading,
      success: (data) => {
        const message = typeof success === 'function' ? success(data) : success;
        return message;
      },
      error: (err) => {
        const message = typeof error === 'function' ? error(err) : error;
        return message;
      },
    },
    {
      ...toastConfig,
      success: {
        ...toastConfig,
        icon: createElement(ToastIcon, { icon: CheckCircle, color: '#10b981' }),
        style: {
          ...toastConfig.style,
          background: '#ffffff',
          color: '#1f2937',
          borderLeft: '4px solid #10b981',
        },
      },
      error: {
        ...toastConfig,
        icon: createElement(ToastIcon, { icon: XCircle, color: '#ef4444' }),
        style: {
          ...toastConfig.style,
          background: '#ffffff',
          color: '#1f2937',
          borderLeft: '4px solid #ef4444',
        },
      },
      loading: {
        ...toastConfig,
        style: {
          ...toastConfig.style,
          background: '#ffffff',
          color: '#1f2937',
          borderLeft: '4px solid #3b82f6',
        },
      },
    }
  );
};