import { toast } from 'react-toastify';
const second = 2000;
const errorSecond = 5000;
const config = duration => {
    return {
        position: 'top-center',
        autoClose: duration,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
    };
};

export function info(msg = 'Info', duration = second) {
    toast.info(msg, config(duration));
}

export function success(msg = 'Success', duration = second) {
    toast.success(msg, config(duration));
}

export function warning(msg = 'Warning', duration = second) {
    toast.warning(msg, config(duration));
}

export function error(msg = 'Error', duration = errorSecond) {
    toast.error(msg, config(duration));
}