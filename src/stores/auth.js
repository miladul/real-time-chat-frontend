import { defineStore } from 'pinia';
import api from '../lib/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    actions: {
        async login(email, password) {
            const { data } = await api.post('/login', { email, password });
            this.token = data.token;
            localStorage.setItem('token', data.token);
            await this.getUser();
        },
        async register(name, email, password) {
            await api.post('/register', { name, email, password });
        },
        async getUser() {
            const { data } = await api.get('/me');
            this.user = data;
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },
    },
});
