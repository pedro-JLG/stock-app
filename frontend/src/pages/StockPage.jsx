import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import { api } from "../services/api.js";
import Pagination from "../components/Pagination.jsx";

const POLLING_MS = 15000;
const PAGE_SIZE = 10;

export default function StockPage() {
    const { isAdmin } = useAuth();

    const [search, setSearch] = useState("");
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [page, setPage] = useState(1);
    const [actionError, setActionError] = useState("");

    const params = new URLSearchParams({ page, limit: PAGE_SIZE });
    if (q) params.set("q", q);
    if (category) params.set("category", category);

    const products = useFetch(`/products?${params}`);
    const categories = useFetch("/products/stock-by-category");

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

    async function handleArchive(product) {
        if (!window.confirm(`¿Archivar el producto "${product.name}"?`)) {
            return;
        }
        setActionError("");
        try {
            await api(`/products/${product._id}`, { method: "DELETE" });
            if (products.data.items.length === 1 && page > 1) {
                setPage(page - 1);
            }
            reloadProducts();
            reloadCategories();
        } catch (err) {
            setActionError(err.message);
        }
    }

    const categoryList = categories.data ?? [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Stock</h1>
                {isAdmin && (
                    <Link
                        to="/productos/nuevo"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Nuevo producto
                    </Link>
                )}
            </div>

            {categories.error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    No se pudieron cargar los totales por categoría: {categories.error.message}
                </p>
            )}
            {categoryList.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categoryList.map((c) => (
                        <div key={c.category} className="bg-white rounded shadow p-3">
                            <p className="text-sm text-slate-500">{c.category}</p>
                            <p className="text-2xl font-bold">{c.totalStock}</p>
                            <p className="text-xs text-slate-500">{c.products} productos</p>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre o SKU"
                    aria-label="Buscar"
                    className="border rounded px-3 py-2 bg-white flex-1 min-w-48"
                />
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    aria-label="Categoría"
                    className="border rounded px-3 py-2 bg-white"
                >
                    <option value="">Todas las categorías</option>
                    {/* Keep the active filter visible even if its category is no longer listed */}
                    {category && !categoryList.some((c) => c.category === category) && (
                        <option value={category}>{category}</option>
                    )}
                    {categoryList.map((c) => (
                        <option key={c.category} value={c.category}>{c.category}</option>
                    ))}
                </select>
                <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded">
                    Buscar
                </button>
            </form>

            {actionError && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{actionError}</p>
            )}

            {products.loading && <p className="text-slate-500">Cargando productos...</p>}
            {products.error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {products.error.message}
                </p>
            )}

            {products.data && (
                <>
                    {products.data.items.length === 0 ? (
                        <p className="text-slate-500 bg-white rounded shadow p-6 text-center">
                            No hay productos para mostrar.
                        </p>
                    ) : (
                        <div className="bg-white rounded shadow overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-4 py-2">SKU</th>
                                        <th className="px-4 py-2">Nombre</th>
                                        <th className="px-4 py-2">Categoría</th>
                                        <th className="px-4 py-2 text-right">Stock</th>
                                        {isAdmin && <th className="px-4 py-2 text-right">Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.items.map((p) => (
                                        <tr key={p._id} className="border-t">
                                            <td className="px-4 py-2 font-mono">{p.sku}</td>
                                            <td className="px-4 py-2">{p.name}</td>
                                            <td className="px-4 py-2">{p.category}</td>
                                            <td className="px-4 py-2 text-right">{p.stock}</td>
                                            {isAdmin && (
                                                <td className="px-4 py-2 text-right space-x-3">
                                                    <Link
                                                        to={`/productos/${p._id}/editar`}
                                                        className="text-blue-600 underline"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleArchive(p)}
                                                        className="text-red-600 underline"
                                                    >
                                                        Archivar
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <Pagination
                        page={products.data.page}
                        pages={products.data.pages}
                        total={products.data.total}
                        onChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
