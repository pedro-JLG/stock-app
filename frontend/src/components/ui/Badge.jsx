const variants = {
    neutral: 'border-border bg-secondary text-text-secondary',
    success: 'border-success/25 bg-success/10 text-success',
    danger: 'border-destructive/25 bg-destructive/10 text-destructive',
    warning: 'border-warning/25 bg-warning/10 text-warning',
};

// variant: neutral | success | danger | warning. `icon` is optional JSX.
export default function Badge({ variant = 'neutral', icon = null, children }) {
    return (
        <span
            className={`inline-flex h-5 items-center gap-1 rounded-full border px-2 text-xs leading-4 font-medium whitespace-nowrap ${variants[variant]}`}
        >
            {icon}
            {children}
        </span>
    );
}
