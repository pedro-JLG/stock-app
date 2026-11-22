import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-card text-card-foreground p-6 rounded-lg shadow space-y-4"
            >
                <h1 className="text-2xl font-bold">Iniciar sesión</h1>

                {error && (
                    <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                        {error}
                    </p>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 w-full border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 w-full border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md disabled:opacity-50"
                >
                    {submitting ? 'Ingresando...' : 'Ingresar'}
                </button>

                <p className="text-sm text-center">
                    ¿No tenés cuenta?{' '}
                    <Link to="/registro" className="text-primary underline">
                        Registrate
                    </Link>
                </p>
            </form>
        </div>
    );
}
