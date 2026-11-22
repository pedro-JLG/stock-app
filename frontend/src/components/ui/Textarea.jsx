import { inputClass } from './styles.js';

export default function Textarea({ error, className = '', ...props }) {
    return (
        <textarea
            aria-invalid={error ? true : undefined}
            aria-describedby={error && props.id ? `${props.id}-error` : undefined}
            className={`${inputClass(Boolean(error))} h-auto min-h-20 w-full resize-y py-2 ${className}`.trim()}
            {...props}
        />
    );
}
