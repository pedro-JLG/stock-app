import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/ui/Field.jsx';
import Input from '../components/ui/Input.jsx';
import Logo from '../components/ui/Logo.jsx';
import { linkClass } from '../components/ui/styles.js';
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
                        Crear cuenta
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Completá tus datos para empezar.
                    </p>
                </div>

                {error && <Alert>{error}</Alert>}

                <Field id="name" label="Nombre" error={fieldErrors.name}>
                    <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        error={fieldErrors.name}
                    />
                </Field>

                <Field id="email" label="Email" error={fieldErrors.email}>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={fieldErrors.email}
                    />
                </Field>

                <Field id="password" label="Contraseña" error={fieldErrors.password}>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        error={fieldErrors.password}
                    />
                </Field>

                <Button type="submit" variant="primary" disabled={submitting} className="w-full">
                    {submitting ? 'Creando cuenta...' : 'Registrarme'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    ¿Ya tenés cuenta?{' '}
                    <Link to="/login" className={linkClass}>
                        Iniciá sesión
                    </Link>
                </p>
            </form>
        </main>
    );
}
