import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { useFetch } from '../hooks/useFetch.js';
import { api } from '../services/api.js';
import Pagination from '../components/Pagination.jsx';
import Alert from '../components/ui/Alert.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Input from '../components/ui/Input.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Select from '../components/ui/Select.jsx';
import { StatCardsSkeleton, TableSkeleton } from '../components/ui/Skeleton.jsx';
import { PackageIcon, PlusIcon, SearchIcon } from '../components/ui/icons.jsx';
import { formatNumber } from '../components/ui/format.js';
import {
    buttonClass,
    tableShellClass,
    tdClass,
    thClass,
    trClass,
} from '../components/ui/styles.js';

const POLLING_MS = 15000;
const PAGE_SIZE = 10;
// Placeholder decision: at or below this many units we show the "Bajo" badge.
// Change it (or make it per-product) once the business defines a real rule.
const LOW_STOCK_THRESHOLD = 5;

function StockCell({ stock }) {
    return (
        <div className="flex items-center justify-end gap-2">
            {stock === 0 && <Badge variant="danger">Sin stock</Badge>}
            {stock > 0 && stock <= LOW_STOCK_THRESHOLD && <Badge variant="warning">Bajo</Badge>}
            <span className="tabular-nums">{formatNumber(stock)}</span>
        </div>
    );
}

export default function StockPage() {
    const { isAdmin } = useAuth();

    const [search, setSearch] = useState('');
    const [q, setQ] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [actionError, setActionError] = useState('');
    // Product waiting for the archive confirmation (null = dialog closed).
    const [productToArchive, setProductToArchive] = useState(null);

    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (q) params.set('q', q);
    if (category) params.set('category', category);

    const products = useFetch(`/products?${params}`);
    const categories = useFetch('/products/stock-by-category');

    const reloadProducts = products.reload;
    const reloadCategories = categories.reload;

    // Silent refresh every 15 s: reload() does not toggle `loading`.
    useEffect(() => {
        const id = setInterval(() => {
            reloadProducts();
            reloadCategories();
        }, POLLING_MS);
        return () => clearInterval(id);
    }, [reloadProducts, reloadCategories]);

    function handleSearch(e) {
        e.preventDefault();
        setQ(search.trim());
        setPage(1);
    }

    function handleCategoryChange(e) {
        setCategory(e.target.value);
        setPage(1);
    }

    function clearFilters() {
        setSearch('');
        setQ('');
        setCategory('');
        setPage(1);
    }

    async function handleArchive(product) {
        setActionError('');
        try {
            await api(`/products/${product._id}`, { method: 'DELETE' });
            if (products.data.items.length === 1 && page > 1) {
                setPage(page - 1);
            }
            reloadProducts();
            reloadCategories();
        } catch (err) {
            setActionError(err.message);
        }
    }

    function confirmArchive() {
        const product = productToArchive;
        setProductToArchive(null);
        handleArchive(product);
    }

    const categoryList = categories.data ?? [];
    const hasFilters = q !== '' || category !== '';
    const columnCount = isAdmin ? 5 : 4;

    return (
        <div>
            <PageHeader title="Stock" subtitle="Inventario actual y totales por categoría.">
                {isAdmin && (
                    <Link to="/productos/nuevo" className={buttonClass({ variant: 'primary' })}>
                        <PlusIcon />
                        Nuevo producto
                    </Link>
                )}
            </PageHeader>

            <div className="space-y-6">
                {categories.error && (
                    <Alert onRetry={reloadCategories}>
                        No se pudieron cargar los totales por categoría: {categories.error.message}
                    </Alert>
                )}
                {categories.loading && <StatCardsSkeleton />}
                {categoryList.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {categoryList.map((c) => (
                            <div
                                key={c.category}
                                className="min-w-0 rounded-lg border border-border bg-card p-4"
                            >
                                <p
                                    className="truncate text-xs leading-4 text-muted-foreground"
                                    title={c.category}
                                >
                                    {c.category}
                                </p>
                                <p className="mt-1 text-xl leading-7 font-semibold tabular-nums [overflow-wrap:anywhere]">
                                    {formatNumber(c.totalStock)}
                                </p>
                                <p className="mt-1 text-xs leading-4 text-muted-foreground tabular-nums">
                                    {formatNumber(c.products)}{' '}
                                    {c.products === 1 ? 'producto' : 'productos'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                        <div className="relative min-w-48 flex-1">
                            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nombre o SKU"
                                aria-label="Buscar"
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={category}
                            onChange={handleCategoryChange}
                            aria-label="Categoría"
                            className="w-full sm:w-52"
                        >
                            <option value="">Todas las categorías</option>
                            {/* Keep the active filter visible even if its category is no longer listed */}
                            {category && !categoryList.some((c) => c.category === category) && (
                                <option value={category}>{category}</option>
                            )}
                            {categoryList.map((c) => (
                                <option key={c.category} value={c.category}>
                                    {c.category}
                                </option>
                            ))}
                        </Select>
                        <Button type="submit">Buscar</Button>
                        {hasFilters && (
                            <Button variant="ghost" onClick={clearFilters}>
                                Limpiar filtros
                            </Button>
                        )}
                    </form>

                    {actionError && <Alert>{actionError}</Alert>}
                    {products.error && (
                        <Alert onRetry={reloadProducts}>{products.error.message}</Alert>
                    )}

                    {products.loading && (
                        <TableSkeleton columns={columnCount} label="Cargando productos…" />
                    )}

                    {products.data && (
                        <div className={tableShellClass}>
                            {products.data.items.length === 0 ? (
                                <EmptyState
                                    icon={
                                        hasFilters ? (
                                            <SearchIcon size={18} />
                                        ) : (
                                            <PackageIcon size={18} />
                                        )
                                    }
                                    title={
                                        hasFilters ? 'Sin resultados' : 'Todavía no hay productos'
                                    }
                                    description={
                                        hasFilters
                                            ? 'Ningún producto coincide con la búsqueda o la categoría elegida.'
                                            : isAdmin
                                              ? 'Creá el primer producto para empezar a controlar el stock.'
                                              : 'Un administrador debe cargar los primeros productos.'
                                    }
                                >
                                    {hasFilters && (
                                        <Button onClick={clearFilters}>Limpiar filtros</Button>
                                    )}
                                    {!hasFilters && isAdmin && (
                                        <Link
                                            to="/productos/nuevo"
                                            className={buttonClass({ variant: 'secondary' })}
                                        >
                                            Nuevo producto
                                        </Link>
                                    )}
                                </EmptyState>
                            ) : (
                                <>
                                    <div
                                        tabIndex={0}
                                        role="region"
                                        aria-label="Tabla de productos"
                                        className="overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                                    >
                                        <table className="w-full min-w-[640px] text-sm">
                                            <thead>
                                                <tr>
                                                    <th className={thClass}>SKU</th>
                                                    <th className={thClass}>Nombre</th>
                                                    <th className={thClass}>Categoría</th>
                                                    <th className={`${thClass} text-right`}>
                                                        Stock
                                                    </th>
                                                    {isAdmin && (
                                                        <th className={`${thClass} text-right`}>
                                                            Acciones
                                                        </th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.data.items.map((p) => (
                                                    <tr key={p._id} className={trClass}>
                                                        <td className={tdClass}>
                                                            <div
                                                                className="max-w-32 truncate font-mono text-13 text-text-secondary"
                                                                title={p.sku}
                                                            >
                                                                {p.sku}
                                                            </div>
                                                        </td>
                                                        <td className={tdClass}>
                                                            <div
                                                                className="max-w-72 truncate"
                                                                title={p.name}
                                                            >
                                                                {p.name}
                                                            </div>
                                                        </td>
                                                        <td
                                                            className={`${tdClass} text-text-secondary`}
                                                        >
                                                            <div
                                                                className="max-w-40 truncate"
                                                                title={p.category}
                                                            >
                                                                {p.category}
                                                            </div>
                                                        </td>
                                                        <td className={tdClass}>
                                                            <StockCell stock={p.stock} />
                                                        </td>
                                                        {isAdmin && (
                                                            <td className={tdClass}>
                                                                <div className="flex items-center justify-end gap-1">
                                                                    <Link
                                                                        to={`/productos/${p._id}/editar`}
                                                                        aria-label={`Editar ${p.name}`}
                                                                        className={buttonClass({
                                                                            variant: 'ghost',
                                                                            size: 'sm',
                                                                        })}
                                                                    >
                                                                        Editar
                                                                    </Link>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        aria-label={`Archivar ${p.name}`}
                                                                        onClick={() =>
                                                                            setProductToArchive(p)
                                                                        }
                                                                    >
                                                                        Archivar
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <Pagination
                                        page={products.data.page}
                                        pages={products.data.pages}
                                        total={products.data.total}
                                        pageSize={PAGE_SIZE}
                                        onChange={setPage}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={productToArchive !== null}
                title="Archivar producto"
                description={
                    productToArchive
                        ? `"${productToArchive.name}" dejará de aparecer en el listado de stock y no se podrán registrar nuevos movimientos.`
                        : ''
                }
                confirmLabel="Archivar"
                onConfirm={confirmArchive}
                onCancel={() => setProductToArchive(null)}
            />
        </div>
    );
}
