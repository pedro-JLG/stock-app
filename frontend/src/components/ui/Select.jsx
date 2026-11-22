import { inputClass } from './styles.js';
import { ChevronDownIcon } from './icons.jsx';

// Native <select> with its own chevron. `className` styles the wrapper
// (use it to set a width).
export default function Select({ error, className = '', children, ...props }) {
    return (
        <div className={`relative ${className}`.trim()}>
            <select
                aria-invalid={error ? true : undefined}
                aria-describedby={error && props.id ? `${props.id}-error` : undefined}
                className={`${inputClass(Boolean(error))} w-full appearance-none pr-9`}
                {...props}
            >
                {children}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground" />
        </div>
    );
}
