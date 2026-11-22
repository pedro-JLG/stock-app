import { useEffect, useState } from "react";
import { api, getToken, setToken } from "../services/api.js";
import { AuthContext } from "./authContext.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(getToken()));

    useEffect(() => {
        if (!getToken()) {
            return;
        }
        api('/auth/me')
            .then((data) => setUser(data.user))
            .catch(() => setToken(null))
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const data = await api("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        setToken(data.token);
        setUser(data.user);
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "admin",
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
