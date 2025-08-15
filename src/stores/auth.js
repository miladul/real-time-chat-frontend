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
            try {
                const { data } = await api.post('/login', { email, password });

                if (data.status === 'success') {
                    this.token = data.data.token;
                    localStorage.setItem('token', data.data.token);
                    this.user = data.data.user;
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error(error);
                throw error.response?.data || { message: error.message };
            }
        },

        async register(name, email, password) {
            try {
                const { data } = await api.post('/register', { name, email, password });

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error(error);
                throw error.response?.data || { message: error.message };
            }
        },

        async getUser() {
            try {
                const { data } = await api.get('/me');
                if (data.status === 'success') {
                    this.user = data.data;
                }
            } catch (error) {
                console.error(error);
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },
    },
});
