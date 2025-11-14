import toast from 'react-hot-toast';

const toastConfig = {
  duration: 2000,
  position: 'top-right' as const,
  style: {
    maxWidth: '500px',
  },
};

export const showSuccessToast = (message: string) => {
  toast.success(message, toastConfig);
};

export const showErrorToast = (message: string) => {
  toast.error(message, toastConfig);
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, toastConfig);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export const showConfirmToast = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
}: {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onCancel?.();
            }}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {confirmText}
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-right',
      style: {
        maxWidth: '500px',
      },
    }
  );
};
