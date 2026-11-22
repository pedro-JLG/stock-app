export default function Pagination({ page, pages, total, onChange }) {
    return (
        <div className="flex items-center justify-between mt-4 text-sm">
            <span className="text-muted-foreground">
                Página {page} de {pages} ({total} resultados)
            </span>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onChange(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 border rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
                >
                    Anterior
                </button>
                <button
                    type="button"
                    onClick={() => onChange(page + 1)}
                    disabled={page >= pages}
                    className="px-3 py-1 border rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
