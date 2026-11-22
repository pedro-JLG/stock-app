// Centered message for tables/lists without rows.
// `icon` is JSX, `children` is the optional action button.
export default function EmptyState({ icon, title, description, children }) {
    return (
        <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex size-10 items-center justify-center rounded-full border border-border text-text-secondary">
                {icon}
            </div>
            <h2 className="mt-4 text-sm font-medium">{title}</h2>
            <p className="mt-1 max-w-sm text-13 leading-5 text-pretty text-muted-foreground">
                {description}
            </p>
            {children && <div className="mt-4">{children}</div>}
        </div>
    );
}
