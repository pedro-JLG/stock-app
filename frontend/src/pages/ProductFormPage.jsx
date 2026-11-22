import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useFetch } from '../hooks/useFetch.js';
import { api } from '../services/api.js';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import Field from '../components/ui/Field.jsx';
import Input from '../components/ui/Input.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { FormSkeleton } from '../components/ui/Skeleton.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import { buttonClass } from '../components/ui/styles.js';
import { toFieldErrors } from '../utils/apiErrors.js';

const EMPTY_PRODUCT = { name: '', description: '', sku: '', category: '' };

function ProductForm({ id, initial }) {
    const navigate = useNavigate();
    const [form, setForm] = useState(initial);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setSubmitting(true);
        try {
            // PUT replaces the whole product, so we always send every field.
            await api(id ? `/products/${id}` : '/products', {
                method: id ? 'PUT' : 'POST',
                body: form,
            });
            navigate('/');
        } catch (err) {
            const fields = toFieldErrors(err);
            setFieldErrors(fields);
            setError(Object.keys(fields).length > 0 ? '' : err.message);
            setSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-lg space-y-5 rounded-lg border border-border bg-card p-6"
        >
            {error && <Alert>{error}</Alert>}

            <Field id="name" label="Nombre" error={fieldErrors.name}>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    error={fieldErrors.name}
                />
            </Field>

            <Field id="description" label="Descripción" error={fieldErrors.description}>
                <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    error={fieldErrors.description}
                />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field id="sku" label="SKU" error={fieldErrors.sku}>
                    <Input
                        id="sku"
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        required
                        maxLength={40}
                        error={fieldErrors.sku}
                        className="font-mono text-13"
                    />
                </Field>

                <Field id="category" label="Categoría" error={fieldErrors.category}>
                    <Input
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        maxLength={80}
                        error={fieldErrors.category}
                    />
                </Field>
            </div>

            <div className="flex gap-2 pt-1">
                <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Guardando...' : 'Guardar'}
                </Button>
                <Link to="/" className={buttonClass({ variant: 'ghost' })}>
                    Cancelar
                </Link>
            </div>
        </form>
    );
}

export default function ProductFormPage() {
    const { id } = useParams();
    const { data, error, loading, reload } = useFetch(id ? `/products/${id}` : null);

    return (
        <div>
            <PageHeader
                title={id ? 'Editar producto' : 'Nuevo producto'}
                subtitle={
                    id ? 'Actualizá los datos del producto.' : 'Completá los datos del producto.'
                }
            />

            <div className="space-y-4">
                {loading && <FormSkeleton fields={4} />}
                {error && (
                    <div className="max-w-lg">
                        <Alert onRetry={reload}>{error.message}</Alert>
                    </div>
                )}

                {!id && <ProductForm initial={EMPTY_PRODUCT} />}
                {id && data && (
                    <ProductForm
                        id={id}
                        initial={{
                            name: data.name,
                            description: data.description ?? '',
                            sku: data.sku,
                            category: data.category,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
