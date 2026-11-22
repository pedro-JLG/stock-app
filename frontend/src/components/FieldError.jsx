import { AlertCircleIcon } from './ui/icons.jsx';

// `id` lets the input point to this message with aria-describedby.
export default function FieldError({ id, message }) {
    if (!message) {
        return null;
    }
    return (
        <p id={id} className="mt-1.5 flex items-start gap-1.5 text-xs leading-4 text-destructive">
            <AlertCircleIcon size={14} className="mt-px" />
            <span className="min-w-0 break-words">{message}</span>
        </p>
    );
}
