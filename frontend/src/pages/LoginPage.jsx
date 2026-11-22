import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/ui/Field.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../components/ui/Logo.jsx';
import { linkClass } from '../components/ui/styles.js';

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
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
            <div className="mb-6">
                <Logo size={32} />
            </div>
            <form
                onSubmit={handleSubmit}
                className="w-[360px] max-w-full space-y-5 rounded-xl border border-border bg-card p-6"
            >
                <div>
                    <h1 className="text-xl leading-7 font-semibold tracking-[-0.02em]">
                        Iniciar sesión
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ingresá con tu cuenta para ver el stock.
                    </p>
                </div>

                {error && <Alert>{error}</Alert>}

                <Field id="email" label="Email">
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Field>

                <Field id="password" label="Contraseña">
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Field>

                <Button type="submit" variant="primary" disabled={submitting} className="w-full">
                    {submitting ? 'Ingresando...' : 'Ingresar'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    ¿No tenés cuenta?{' '}
                    <Link to="/registro" className={linkClass}>
                        Registrate
                    </Link>
                </p>
            </form>
        </main>
    );
}
