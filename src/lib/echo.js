import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: import.meta.env.VITE_BACKEND_BASE_URL+'/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // or from Pinia store
        }
    },

    clientEvents: true,
});
