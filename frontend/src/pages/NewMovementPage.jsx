import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import FieldError from "../components/FieldError.jsx";
import { toFieldErrors } from "../utils/apiErrors.js";

// Local date as YYYY-MM-DD (toISOString would give the UTC date).
function todayLocal() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
}

function emptyForm() {
    return {
        product: "",
        type: "in",
        quantity: "",
        occurredOn: todayLocal(),
        supplier: "",
        reason: "",
    };
}

export default function NewMovementPage() {
    // Only the first 100 products are loaded for the selector (backend max per page).
    const products = useFetch("/products?limit=100");

    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setResult(null);
        setSubmitting(true);

        const body = {
            product: form.product,
            type: form.type,
            quantity: Number(form.quantity),
            occurredOn: form.occurredOn,
        };
        if (form.type === "in") {
            body.supplier = form.supplier;
        } else {
            body.reason = form.reason;
        }

        try {
            const data = await api("/movements", { method: "POST", body });
            const product = products.data.items.find((p) => p._id === form.product);
            setResult({ name: product?.name, stock: data.stock });
            setForm(emptyForm());
            products.reload();
        } catch (err) {
            const fields = toFieldErrors(err);
            setFieldErrors(fields);
            setError(Object.keys(fields).length > 0 ? "" : err.message);
            // Refresh the stock shown in the selector (e.g. after a 409 for insufficient stock).
            products.reload();
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Registrar movimiento</h1>

            {products.loading && <p className="text-slate-500">Cargando productos...</p>}
            {products.error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {products.error.message}
                </p>
            )}

            {products.data && products.data.items.length === 0 && (
                <p className="text-slate-500 bg-white rounded shadow p-6">
                    No hay productos cargados. Un administrador debe crear al menos uno.
                </p>
            )}

            {products.data && products.data.items.length > 0 && (
                <form onSubmit={handleSubmit} className="max-w-lg bg-white p-6 rounded shadow space-y-4">
                    {result && (
                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                            Movimiento registrado. Stock actual de {result.name}: {result.stock}
                        </p>
                    )}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
                    )}

                    <div>
                        <label htmlFor="product" className="block text-sm font-medium">Producto</label>
                        <select
                            id="product"
                            name="product"
                            value={form.product}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded px-3 py-2"
                        >
                            <option value="">Seleccioná un producto</option>
                            {products.data.items.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name} ({p.sku}) - stock: {p.stock}
                                </option>
                            ))}
                        </select>
                        <FieldError message={fieldErrors.product} />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium">Tipo</label>
                        <select
                            id="type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded px-3 py-2"
                        >
                            <option value="in">Ingreso</option>
                            <option value="out">Salida</option>
                        </select>
                        <FieldError message={fieldErrors.type} />
                    </div>

                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium">Cantidad</label>
                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min={1}
                            max={99999}
                            step={1}
                            value={form.quantity}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded px-3 py-2"
                        />
                        <FieldError message={fieldErrors.quantity} />
                    </div>

                    <div>
                        <label htmlFor="occurredOn" className="block text-sm font-medium">Fecha</label>
                        <input
                            id="occurredOn"
                            name="occurredOn"
                            type="date"
                            max={todayLocal()}
                            value={form.occurredOn}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded px-3 py-2"
                        />
                        <FieldError message={fieldErrors.occurredOn} />
                    </div>

                    {form.type === "in" ? (
                        <div>
                            <label htmlFor="supplier" className="block text-sm font-medium">Proveedor</label>
                            <input
                                id="supplier"
                                name="supplier"
                                value={form.supplier}
                                onChange={handleChange}
                                required
                                maxLength={120}
                                className="mt-1 w-full border rounded px-3 py-2"
                            />
                            <FieldError message={fieldErrors.supplier} />
                        </div>
                    ) : (
                        <div>
                            <label htmlFor="reason" className="block text-sm font-medium">Motivo</label>
                            <input
                                id="reason"
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                required
                                maxLength={180}
                                className="mt-1 w-full border rounded px-3 py-2"
                            />
                            <FieldError message={fieldErrors.reason} />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    >
                        {submitting ? "Registrando..." : "Registrar"}
                    </button>
                </form>
            )}
        </div>
    );
}
