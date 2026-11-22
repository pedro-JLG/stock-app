import Button from './ui/Button.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from './ui/icons.jsx';
import { formatNumber } from './ui/format.js';

// Footer of a table container: "1–10 de 47" + Anterior / Siguiente.
// `pageSize` is optional but needed to show the range; without it only the total is shown.
export default function Pagination({ page, pages, total, pageSize, onChange }) {
    const from = pageSize ? (page - 1) * pageSize + 1 : null;
    const to = pageSize ? Math.min(page * pageSize, total) : null;

    return (
        <nav
            aria-label="Paginación"
            className="flex items-center justify-between gap-3 border-t border-border px-4 py-3"
        >
            <p className="text-xs leading-4 text-muted-foreground tabular-nums">
                {total === 0
                    ? '0 resultados'
                    : from === null
                      ? `${formatNumber(total)} resultados`
                      : `${formatNumber(from)}–${formatNumber(to)} de ${formatNumber(total)}`}
            </p>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={() => onChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Página anterior"
                >
                    <ChevronLeftIcon size={14} />
                    Anterior
                </Button>
                <Button
                    size="sm"
                    onClick={() => onChange(page + 1)}
                    disabled={page >= pages}
                    aria-label="Página siguiente"
                >
                    Siguiente
                    <ChevronRightIcon size={14} />
                </Button>
            </div>
        </nav>
    );
}
