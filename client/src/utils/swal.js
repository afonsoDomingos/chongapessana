import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#1a1a1a',
    color: '#f0f0f0',
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

export const notify = {
    success: (title, text = '') => {
        Swal.fire({
            icon: 'success',
            title,
            text,
            background: '#1a1a1a',
            color: '#f0f0f0',
            confirmButtonColor: '#d4af37',
            customClass: {
                popup: 'glass swal-custom-popup',
            }
        });
    },
    error: (title, text = '') => {
        Swal.fire({
            icon: 'error',
            title,
            text,
            background: '#1a1a1a',
            color: '#f0f0f0',
            confirmButtonColor: '#d4af37',
            customClass: {
                popup: 'glass swal-custom-popup',
            }
        });
    },
    toast: (icon, title) => {
        Toast.fire({
            icon,
            title
        });
    },
    confirm: async (title, text = '') => {
        const result = await Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            background: '#1a1a1a',
            color: '#f0f0f0',
            confirmButtonColor: '#d4af37',
            cancelButtonColor: '#333',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                popup: 'glass swal-custom-popup',
            }
        });
        return result.isConfirmed;
    }
};
