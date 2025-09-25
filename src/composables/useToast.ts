import { toast, type ToastOptions } from 'vue3-toastify';

export const useToast = () => {
    const showSuccess = (message: string, options?: ToastOptions) => {
        toast.success(message, options);
    };

    const showError = (message: string, options?: ToastOptions) => {
        toast.error(message, options);
    };

    const showWarning = (message: string, options?: ToastOptions) => {
        toast.warning(message, options);
    };

    const showInfo = (message: string, options?: ToastOptions) => {
        toast.info(message, options);
    };

    const showLoading = (message: string = 'Carregando...') => {
        return toast.loading(message);
    };

    const updateToast = (
        toastId: any,
        {
            render,
            type,
            isLoading = false,
        }: {
            render?: string;
            type?: 'success' | 'error' | 'warning' | 'info';
            isLoading?: boolean;
        }
    ) => {
        toast.update(toastId, {
            render,
            type,
            isLoading,
            autoClose: 3000,
        });
    };

    return {
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        updateToast,
        toast,
    };
};
