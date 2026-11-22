// Page title (24px) + one-line subtitle, with optional actions on the right.
export default function PageHeader({ title, subtitle, children }) {
    return (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
                <h1 className="text-2xl leading-8 font-semibold tracking-[-0.02em]">{title}</h1>
                <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}
