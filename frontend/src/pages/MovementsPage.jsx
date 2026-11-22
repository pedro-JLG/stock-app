import { useState } from 'react';
import { Link } from 'react-router';
import { useFetch } from '../hooks/useFetch.js';
import Pagination from '../components/Pagination.jsx';
import Alert from '../components/ui/Alert.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Input from '../components/ui/Input.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Select from '../components/ui/Select.jsx';
import { TableSkeleton } from '../components/ui/Skeleton.jsx';
import {
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    PackageIcon,
    SearchIcon,
} from '../components/ui/icons.jsx';
import { formatNumber } from '../components/ui/format.js';
import {
    buttonClass,
    labelClass,
    tableShellClass,
    tdClass,
    thClass,
    trClass,
} from '../components/ui/styles.js';

const PAGE_SIZE = 15;
const EMPTY_FILTERS = { type: '', product: '', from: '', to: '' };

// occurredOn is stored as UTC midnight, so we show it in UTC to avoid
// displaying the previous day in timezones behind UTC (e.g. Argentina).
function formatDate(value) {
    return new Date(value).toLocaleDateString('es-AR', { timeZone: 'UTC' });
}

function TypeBadge({ type }) {
    return type === 'in' ? (
        <Badge variant="success" icon={<ArrowDownLeftIcon size={12} />}>
            Ingreso
        </Badge>
    ) : (
        <Badge icon={<ArrowUpRightIcon size={12} />}>Salida</Badge>
    );
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

    const hasFilters = Object.values(filters).some(Boolean);

    return (
        <div>
            <PageHeader title="Movimientos" subtitle="Historial de ingresos y salidas de stock." />

            <div className="space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                    <div>
                        <label htmlFor="type" className={labelClass}>
                            Tipo
                        </label>
                        <Select
                            id="type"
                            name="type"
                            value={filters.type}
                            onChange={handleFilterChange}
                            className="w-36"
                        >
                            <option value="">Todos</option>
                            <option value="in">Ingreso</option>
                            <option value="out">Salida</option>
                        </Select>
                    </div>
                    <div className="min-w-0">
                        <label htmlFor="product" className={labelClass}>
                            Producto
                        </label>
                        <Select
                            id="product"
                            name="product"
                            value={filters.product}
                            onChange={handleFilterChange}
                            className="w-full sm:w-64"
                        >
                            <option value="">Todos</option>
                            {products.data?.items.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name} ({p.sku})
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="from" className={labelClass}>
                            Desde
                        </label>
                        <Input
                            id="from"
                            name="from"
                            type="date"
                            value={filters.from}
                            onChange={handleFilterChange}
                            className="w-40 tabular-nums"
                        />
                    </div>
                    <div>
                        <label htmlFor="to" className={labelClass}>
                            Hasta
                        </label>
                        <Input
                            id="to"
                            name="to"
                            type="date"
                            value={filters.to}
                            onChange={handleFilterChange}
                            className="w-40 tabular-nums"
                        />
                    </div>
                    {hasFilters && (
                        <Button variant="ghost" onClick={clearFilters}>
                            Limpiar filtros
                        </Button>
                    )}
                </div>

                {movements.error && (
                    <Alert onRetry={movements.reload}>{movements.error.message}</Alert>
                )}

                {movements.loading && <TableSkeleton columns={6} label="Cargando movimientos…" />}

                {movements.data && (
                    <div className={tableShellClass}>
                        {movements.data.items.length === 0 ? (
                            <EmptyState
                                icon={
                                    hasFilters ? (
                                        <SearchIcon size={18} />
                                    ) : (
                                        <PackageIcon size={18} />
                                    )
                                }
                                title={hasFilters ? 'Sin resultados' : 'Todavía no hay movimientos'}
                                description={
                                    hasFilters
                                        ? 'Ningún movimiento coincide con los filtros elegidos.'
                                        : 'Registrá el primer ingreso o salida de stock.'
                                }
                            >
                                {hasFilters ? (
                                    <Button onClick={clearFilters}>Limpiar filtros</Button>
                                ) : (
                                    <Link
                                        to="/movimientos/nuevo"
                                        className={buttonClass({ variant: 'secondary' })}
                                    >
                                        Registrar movimiento
                                    </Link>
                                )}
                            </EmptyState>
                        ) : (
                            <>
                                <div
                                    tabIndex={0}
                                    role="region"
                                    aria-label="Tabla de movimientos"
                                    className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                >
                                    <table className="w-full min-w-[800px] text-sm">
                                        <thead>
                                            <tr>
                                                <th className={thClass}>Fecha</th>
                                                <th className={thClass}>Tipo</th>
                                                <th className={thClass}>Producto</th>
                                                <th className={`${thClass} text-right`}>
                                                    Cantidad
                                                </th>
                                                <th className={thClass}>Proveedor / Motivo</th>
                                                <th className={thClass}>Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {movements.data.items.map((m) => {
                                                const detail =
                                                    m.type === 'in' ? m.supplier : m.reason;
                                                return (
                                                    <tr key={m._id} className={trClass}>
                                                        <td
                                                            className={`${tdClass} whitespace-nowrap tabular-nums`}
                                                        >
                                                            {formatDate(m.occurredOn)}
                                                        </td>
                                                        <td className={tdClass}>
                                                            <TypeBadge type={m.type} />
                                                        </td>
                                                        <td className={tdClass}>
                                                            {m.product ? (
                                                                <div
                                                                    className="flex max-w-72 items-baseline gap-2"
                                                                    title={`${m.product.name} (${m.product.sku})`}
                                                                >
                                                                    <span className="min-w-0 truncate">
                                                                        {m.product.name}
                                                                    </span>
                                                                    <span className="max-w-32 shrink-0 truncate font-mono text-13 text-text-secondary">
                                                                        {m.product.sku}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted-foreground italic">
                                                                    Producto eliminado
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td
                                                            className={`${tdClass} text-right tabular-nums`}
                                                        >
                                                            {formatNumber(m.quantity)}
                                                        </td>
                                                        <td
                                                            className={`${tdClass} text-text-secondary`}
                                                        >
                                                            <div
                                                                className="max-w-56 truncate"
                                                                title={detail}
                                                            >
                                                                {detail || '—'}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={`${tdClass} text-text-secondary`}
                                                        >
                                                            <div
                                                                className="max-w-40 truncate"
                                                                title={m.user?.name}
                                                            >
                                                                {m.user?.name ?? '—'}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination
                                    page={movements.data.page}
                                    pages={movements.data.pages}
                                    total={movements.data.total}
                                    pageSize={PAGE_SIZE}
                                    onChange={setPage}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
