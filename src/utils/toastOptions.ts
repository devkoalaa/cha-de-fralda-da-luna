import { ToastOptions } from 'react-toastify'

const defaultToast: ToastOptions = {
    theme: 'colored',
    autoClose: 5000,
    pauseOnFocusLoss: false,
    position: 'bottom-center',
    pauseOnHover: false
}

export const toastError: ToastOptions = {
    ...defaultToast,
    type: 'error',
}

export const toastSuccess: ToastOptions = {
    ...defaultToast,
    type: 'success',
    style: { backgroundColor: '#725d4e' },
}
