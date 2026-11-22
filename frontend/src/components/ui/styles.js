// Shared class strings. They live in a plain .js file (not a component file)
// so that component files only export components.
// Tailwind scans this file, so every class must be written out in full.

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const buttonBase = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;

const buttonVariants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    secondary:
        'border border-border bg-background text-foreground hover:border-border-strong hover:bg-secondary',
    ghost: 'text-text-secondary hover:bg-accent hover:text-foreground',
    danger: 'text-destructive hover:bg-destructive/10',
    dangerSolid: 'bg-destructive-solid text-destructive-foreground hover:bg-destructive-solid/90',
};

const buttonSizes = {
    md: 'h-9 px-4 text-sm',
    sm: 'h-8 px-3 text-13',
};

// Use it on <button> and on <Link> when a link should look like a button.
export function buttonClass({ variant = 'secondary', size = 'md', className = '' } = {}) {
    return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`.trim();
}

// Inputs: 36px high, border turns orange on focus (plus a soft 3px ring).
const inputBase =
    'h-9 rounded-md border bg-background px-3 text-sm text-foreground transition-colors duration-100 focus:outline-none focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

export function inputClass(invalid = false) {
    return invalid
        ? `${inputBase} border-destructive focus:border-destructive focus:ring-destructive/20`
        : `${inputBase} border-input hover:border-border-strong focus:border-primary focus:ring-primary/20`;
}

export const labelClass = 'mb-1.5 block text-13 leading-5 font-medium text-foreground';

// Table pieces: a bordered container, a 36px header row and 44px body rows.
export const tableShellClass = 'overflow-hidden rounded-lg border border-border bg-card';
export const thClass =
    'h-9 border-b border-border px-4 text-left text-xs leading-4 font-medium whitespace-nowrap text-muted-foreground';
export const trClass =
    'h-11 border-b border-border-subtle transition-colors duration-100 last:border-b-0 hover:bg-row-hover';
export const tdClass = 'px-4 align-middle';

// Text link in the accent color.
export const linkClass = `rounded-sm text-primary underline-offset-4 transition-colors duration-100 hover:text-primary-hover hover:underline ${focusRing}`;
