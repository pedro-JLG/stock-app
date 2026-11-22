const API_URL = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

export async function api(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) {
        return null;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        // Only for a session that had a token (a failed login also returns 401).
        if (res.status === 401 && token) {
            setToken(null);
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        throw new ApiError(res.status, data.message || 'Error inesperado', data.errors);
    }

    return data;
}