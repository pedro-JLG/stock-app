import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useFetch } from '../hooks/useFetch.js';
import { api } from '../services/api.js';
import FieldError from '../components/FieldError.jsx';
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
        <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded shadow space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    Nombre
                </label>
                <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    className="mt-1 w-full border rounded px-3 py-2"
                />
                <FieldError message={fieldErrors.name} />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={1000}
                    rows={3}
                    className="mt-1 w-full border rounded px-3 py-2"
                />
                <FieldError message={fieldErrors.description} />
            </div>

            <div>
                <label htmlFor="sku" className="block text-sm font-medium">
                    SKU
                </label>
                <input
                    id="sku"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    maxLength={40}
                    className="mt-1 w-full border rounded px-3 py-2"
                />
                <FieldError message={fieldErrors.sku} />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium">
                    Categoría
                </label>
                <input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    maxLength={80}
                    className="mt-1 w-full border rounded px-3 py-2"
                />
                <FieldError message={fieldErrors.category} />
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <Link to="/" className="px-4 py-2 border rounded bg-white">
                    Cancelar
                </Link>
            </div>
        </form>
    );
}

export default function ProductFormPage() {
    const { id } = useParams();
    const { data, error, loading } = useFetch(id ? `/products/${id}` : null);

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">{id ? 'Editar producto' : 'Nuevo producto'}</h1>

            {loading && <p className="text-slate-500">Cargando producto...</p>}
            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error.message}</p>}

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
    );
}
