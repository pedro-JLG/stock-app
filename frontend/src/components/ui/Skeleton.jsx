import { tableShellClass, thClass, trClass, tdClass } from './styles.js';

// Pulse is switched off for people who prefer reduced motion.
function Bar({ className = '' }) {
    return (
        <div
            className={`animate-pulse rounded-sm bg-secondary motion-reduce:animate-none ${className}`}
        />
    );
}

const BAR_WIDTHS = ['w-24', 'w-40', 'w-20', 'w-12', 'w-28', 'w-16'];

// Placeholder table: 36px header + 5 rows of 44px.
export function TableSkeleton({ columns = 4, rows = 5, label = 'Cargando…' }) {
    const cols = Array.from({ length: columns }, (_, i) => i);

    return (
        <div className={tableShellClass} aria-busy="true">
            <span role="status" className="sr-only">
                {label}
            </span>
            <table className="w-full">
                <thead>
                    <tr>
                        {cols.map((c) => (
                            <th key={c} className={thClass}>
                                <Bar className="h-2.5 w-14" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }, (_, r) => (
                        <tr key={r} className={`${trClass} hover:bg-transparent`}>
                            {cols.map((c) => (
                                <td key={c} className={tdClass}>
                                    <Bar
                                        className={`h-3 ${BAR_WIDTHS[(r + c) % BAR_WIDTHS.length]}`}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Placeholder for the stat cards grid.
export function StatCardsSkeleton({ count = 4 }) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <Bar className="h-2.5 w-16" />
                    <Bar className="mt-3 h-5 w-12" />
                    <Bar className="mt-3 h-2.5 w-20" />
                </div>
            ))}
        </div>
    );
}

// Placeholder for a form card (used while data for the form loads).
export function FormSkeleton({ fields = 4 }) {
    return (
        <div
            className="max-w-lg space-y-5 rounded-lg border border-border bg-card p-6"
            aria-hidden="true"
        >
            {Array.from({ length: fields }, (_, i) => (
                <div key={i}>
                    <Bar className="mb-2 h-2.5 w-16" />
                    <div className="h-9 animate-pulse rounded-md bg-secondary motion-reduce:animate-none" />
                </div>
            ))}
        </div>
    );
}
