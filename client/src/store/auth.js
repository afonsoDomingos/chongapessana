import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || '',
        loading: false,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
    },
    actions: {
        async login(credentials) {
            this.loading = true;
            try {
                const res = await axios.post('http://localhost:5000/api/auth/login', credentials);
                this.token = res.data.token;
                this.user = res.data.user;
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                console.error(err);
                return false;
            } finally {
                this.loading = false;
            }
        },
        async register(userData) {
            this.loading = true;
            try {
                const res = await axios.post('http://localhost:5000/api/auth/register', userData);
                this.token = res.data.token;
                this.user = res.data.user;
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                console.error(err);
                return false;
            } finally {
                this.loading = false;
            }
        },
        async updateProfile(userData) {
            this.loading = true;
            try {
                const res = await axios.put('http://localhost:5000/api/auth/profile', userData, {
                    headers: { Authorization: `Bearer ${this.token}` }
                });
                this.user = res.data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                console.error(err);
                return false;
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.user = null;
            this.token = '';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});
