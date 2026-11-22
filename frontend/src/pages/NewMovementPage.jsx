import { useState } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { api } from '../services/api.js';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import FieldError from '../components/FieldError.jsx';
import Field from '../components/ui/Field.jsx';
import Input from '../components/ui/Input.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SegmentedControl from '../components/ui/SegmentedControl.jsx';
import Select from '../components/ui/Select.jsx';
import { FormSkeleton } from '../components/ui/Skeleton.jsx';
import { ArrowDownLeftIcon, ArrowUpRightIcon, PackageIcon } from '../components/ui/icons.jsx';
import { formatNumber } from '../components/ui/format.js';
import { tableShellClass } from '../components/ui/styles.js';
import { toFieldErrors } from '../utils/apiErrors.js';

const TYPE_OPTIONS = [
    {
        value: 'in',
        label: 'Ingreso',
        icon: <ArrowDownLeftIcon size={14} />,
        selectedIconClass: 'text-success',
    },
    {
        value: 'out',
        label: 'Salida',
        icon: <ArrowUpRightIcon size={14} />,
        selectedIconClass: 'text-foreground',
    },
];

// Local date as YYYY-MM-DD (toISOString would give the UTC date).
function todayLocal() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
}

function emptyForm() {
    return {
        product: '',
        type: 'in',
        quantity: '',
        occurredOn: todayLocal(),
        supplier: '',
        reason: '',
    };
}

export default function NewMovementPage() {
    // Only the first 100 products are loaded for the selector (backend max per page).
    const products = useFetch('/products?limit=100');

    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setResult(null);
        setSubmitting(true);

        const body = {
            product: form.product,
            type: form.type,
            quantity: Number(form.quantity),
            occurredOn: form.occurredOn,
        };
        if (form.type === 'in') {
            body.supplier = form.supplier;
        } else {
            body.reason = form.reason;
        }

        try {
            const data = await api('/movements', { method: 'POST', body });
            const product = products.data.items.find((p) => p._id === form.product);
            setResult({ name: product?.name, stock: data.stock });
            setForm(emptyForm());
            products.reload();
        } catch (err) {
            const fields = toFieldErrors(err);
            setFieldErrors(fields);
            setError(Object.keys(fields).length > 0 ? '' : err.message);
            // Refresh the stock shown in the selector (e.g. after a 409 for insufficient stock).
            products.reload();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div>
            <PageHeader
                title="Registrar movimiento"
                subtitle="Registrá un ingreso o una salida de stock."
            />

            <div className="max-w-lg space-y-4">
                {products.error && (
                    <Alert onRetry={products.reload}>{products.error.message}</Alert>
                )}

                {products.loading && <FormSkeleton fields={5} />}

                {products.data && products.data.items.length === 0 && (
                    <div className={tableShellClass}>
                        <EmptyState
                            icon={<PackageIcon size={18} />}
                            title="No hay productos cargados"
                            description="Un administrador debe crear al menos uno antes de registrar movimientos."
                        />
                    </div>
                )}

                {products.data && products.data.items.length > 0 && (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-lg border border-border bg-card p-6"
                    >
                        {/* Always mounted so screen readers announce the content change. */}
                        <div role="status" aria-live="polite">
                            {result && (
                                <Alert variant="success" silent>
                                    Movimiento registrado. Stock actual de {result.name}:{' '}
                                    <span className="tabular-nums">
                                        {formatNumber(result.stock)}
                                    </span>
                                </Alert>
                            )}
                        </div>
                        {error && <Alert>{error}</Alert>}

                        <Field id="product" label="Producto" error={fieldErrors.product}>
                            <Select
                                id="product"
                                name="product"
                                value={form.product}
                                onChange={handleChange}
                                required
                                error={fieldErrors.product}
                            >
                                <option value="">Seleccioná un producto</option>
                                {products.data.items.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name} ({p.sku}) - stock: {p.stock}
                                    </option>
                                ))}
                            </Select>
                        </Field>

                        <div>
                            <SegmentedControl
                                name="type"
                                label="Tipo"
                                value={form.type}
                                onChange={handleChange}
                                options={TYPE_OPTIONS}
                                invalid={Boolean(fieldErrors.type)}
                                describedBy={fieldErrors.type ? 'type-error' : undefined}
                            />
                            <FieldError id="type-error" message={fieldErrors.type} />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field id="quantity" label="Cantidad" error={fieldErrors.quantity}>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    max={99999}
                                    step={1}
                                    value={form.quantity}
                                    onChange={handleChange}
                                    required
                                    error={fieldErrors.quantity}
                                    className="tabular-nums"
                                />
                            </Field>

                            <Field id="occurredOn" label="Fecha" error={fieldErrors.occurredOn}>
                                <Input
                                    id="occurredOn"
                                    name="occurredOn"
                                    type="date"
                                    max={todayLocal()}
                                    value={form.occurredOn}
                                    onChange={handleChange}
                                    required
                                    error={fieldErrors.occurredOn}
                                    className="tabular-nums"
                                />
                            </Field>
                        </div>

                        {form.type === 'in' ? (
                            <Field id="supplier" label="Proveedor" error={fieldErrors.supplier}>
                                <Input
                                    id="supplier"
                                    name="supplier"
                                    value={form.supplier}
                                    onChange={handleChange}
                                    required
                                    maxLength={120}
                                    error={fieldErrors.supplier}
                                />
                            </Field>
                        ) : (
                            <Field id="reason" label="Motivo" error={fieldErrors.reason}>
                                <Input
                                    id="reason"
                                    name="reason"
                                    value={form.reason}
                                    onChange={handleChange}
                                    required
                                    maxLength={180}
                                    error={fieldErrors.reason}
                                />
                            </Field>
                        )}

                        <div className="pt-1">
                            <Button type="submit" variant="primary" disabled={submitting}>
                                {submitting ? 'Registrando...' : 'Registrar'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
