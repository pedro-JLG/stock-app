import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(email, password);
            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4"
            >
                <h1 className="text-2xl font-bold">Iniciar sesión</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 w-full border rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
                >
                    {submitting ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </div>
    );
}
