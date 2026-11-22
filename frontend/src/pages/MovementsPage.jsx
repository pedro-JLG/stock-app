import { useState } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import Pagination from '../components/Pagination.jsx';

const PAGE_SIZE = 15;
const EMPTY_FILTERS = { type: '', product: '', from: '', to: '' };

// occurredOn is stored as UTC midnight, so we show it in UTC to avoid
// displaying the previous day in timezones behind UTC (e.g. Argentina).
function formatDate(value) {
    return new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' });
}

export default function MovementsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [page, setPage] = useState(1);

    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (filters.type) params.set('type', filters.type);
    if (filters.product) params.set('product', filters.product);
    if (filters.from) params.set('from', filters.from);
    // Include the whole "to" day (dates are stored at UTC midnight).
    if (filters.to) params.set('to', `${filters.to}T23:59:59.999Z`);

    const movements = useFetch(`/movements?${params}`);
    // Only the first 100 products are loaded for the filter (backend max per page).
    const products = useFetch('/products?limit=100');

    function handleFilterChange(e) {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1);
    }

    function clearFilters() {
        setFilters(EMPTY_FILTERS);
        setPage(1);
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Movimientos</h1>

            <div className="flex flex-wrap items-end gap-3 bg-card text-card-foreground p-4 rounded-md shadow">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium">
                        Tipo
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="mt-1 border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Todos</option>
                        <option value="in">Ingreso</option>
                        <option value="out">Salida</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="product" className="block text-sm font-medium">
                        Producto
                    </label>
                    <select
                        id="product"
                        name="product"
                        value={filters.product}
                        onChange={handleFilterChange}
                        className="mt-1 border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">Todos</option>
                        {products.data?.items.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.name} ({p.sku})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="from" className="block text-sm font-medium">
                        Desde
                    </label>
                    <input
                        id="from"
                        name="from"
                        type="date"
                        value={filters.from}
                        onChange={handleFilterChange}
                        className="mt-1 border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div>
                    <label htmlFor="to" className="block text-sm font-medium">
                        Hasta
                    </label>
                    <input
                        id="to"
                        name="to"
                        type="date"
                        value={filters.to}
                        onChange={handleFilterChange}
                        className="mt-1 border border-input bg-background rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <button
                    type="button"
                    onClick={clearFilters}
                    className="px-3 py-2 border rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                    Limpiar filtros
                </button>
            </div>

            {movements.loading && <p className="text-muted-foreground">Cargando movimientos...</p>}
            {movements.error && (
                <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                    {movements.error.message}
                </p>
            )}

            {movements.data && (
                <>
                    {movements.data.items.length === 0 ? (
                        <p className="bg-card text-muted-foreground rounded-md shadow p-6 text-center">
                            No hay movimientos para mostrar.
                        </p>
                    ) : (
                        <div className="bg-card text-card-foreground rounded-md shadow overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-2">Fecha</th>
                                        <th className="px-4 py-2">Tipo</th>
                                        <th className="px-4 py-2">Producto</th>
                                        <th className="px-4 py-2 text-right">Cantidad</th>
                                        <th className="px-4 py-2">Proveedor / Motivo</th>
                                        <th className="px-4 py-2">Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.data.items.map((m) => (
                                        <tr key={m._id} className="border-t">
                                            <td className="px-4 py-2">
                                                {formatDate(m.occurredOn)}
                                            </td>
                                            <td className="px-4 py-2">
                                                {m.type === 'in' ? 'Ingreso' : 'Salida'}
                                            </td>
                                            <td className="px-4 py-2">
                                                {m.product
                                                    ? `${m.product.name} (${m.product.sku})`
                                                    : 'Producto eliminado'}
                                            </td>
                                            <td className="px-4 py-2 text-right">{m.quantity}</td>
                                            <td className="px-4 py-2">
                                                {m.type === 'in' ? m.supplier : m.reason}
                                            </td>
                                            <td className="px-4 py-2">{m.user?.name ?? '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <Pagination
                        page={movements.data.page}
                        pages={movements.data.pages}
                        total={movements.data.total}
                        onChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
