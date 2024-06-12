import toast from 'react-hot-toast';

export const showToast = async (
    message: string,
    type?: 'success' | 'failed',
    alert?: boolean
) => {
    if (alert === false) {
        return;
    }
    switch (type) {
        case 'success':
            toast.success(message)
            break;
        case 'failed':
            toast.error(message)
            break;

        default:
            break;
    }
};