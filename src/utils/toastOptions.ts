import { ToastOptions } from "react-toastify";

const defaultToast: ToastOptions = {
    theme: "colored",
    autoClose: 10000,
    pauseOnFocusLoss: false,
    position: "bottom-center",
};

export const toastError: ToastOptions = {
    ...defaultToast,
    type: "error",
};

export const toastSuccess: ToastOptions = {
    ...defaultToast,
    type: "success",
    style: { backgroundColor: "#725d4e" },
};
