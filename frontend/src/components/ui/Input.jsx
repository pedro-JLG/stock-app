import { inputClass } from './styles.js';

// `error` is the message to show (see Field). It only drives the red style
// and the aria attributes; the message itself is rendered by FieldError.
export default function Input({ error, className = '', ...props }) {
    return (
        <input
            aria-invalid={error ? true : undefined}
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            className={`${inputClass(Boolean(error))} ${/(^|\s)w-/.test(className) ? '' : 'w-full'} ${className}`
                .replace(/\s+/g, ' ')
                .trim()}
            {...props}
        />
    );
}
