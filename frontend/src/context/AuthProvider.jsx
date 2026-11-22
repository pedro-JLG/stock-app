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
        // Ignore a late response if the effect was cleaned up (e.g. a fresh login happened).
        let ignore = false;
        api('/auth/me')
            .then((data) => {
                if (!ignore) setUser(data.user);
            })
            .catch((err) => {
                // Only an invalid token logs out; a network/server error keeps it.
                if (err.status === 401) setToken(null);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    // api.js fires this event when the server answers 401 mid-session.
    useEffect(() => {
        function handleUnauthorized() {
            setUser(null);
        }
        window.addEventListener("auth:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
    }, []);

    async function login(email, password) {
        const data = await api("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        setToken(data.token);
        setUser(data.user);
    }

    async function register(name, email, password) {
        const data = await api("/auth/register", {
            method: "POST",
            body: { name, email, password },
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
        register,
        logout,
        isAdmin: user?.role === "admin",
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
