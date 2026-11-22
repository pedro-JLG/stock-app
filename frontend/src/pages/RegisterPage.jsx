import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import FieldError from '../components/FieldError.jsx';
import { toFieldErrors } from '../utils/apiErrors.js';

export default function RegisterPage() {
    const { user, register } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    if (user) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setSubmitting(true);
        try {
            await register(name, email, password);
            navigate('/', { replace: true });
        } catch (err) {
            const fields = toFieldErrors(err);
            setFieldErrors(fields);
            setError(Object.keys(fields).length > 0 ? '' : err.message);
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
                <h1 className="text-2xl font-bold">Crear cuenta</h1>

                {error && (
                    <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                        {error}
                    </p>
                )}

                <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                        Nombre
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 w-full border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <FieldError message={fieldErrors.name} />
                </div>

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
                    <FieldError message={fieldErrors.email} />
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
                        minLength={8}
                        className="mt-1 w-full border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <FieldError message={fieldErrors.password} />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md disabled:opacity-50"
                >
                    {submitting ? 'Creando cuenta...' : 'Registrarme'}
                </button>

                <p className="text-sm text-center">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className="text-primary underline">
                        Iniciá sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
