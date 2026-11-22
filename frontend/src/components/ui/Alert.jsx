import Button from './Button.jsx';
import { AlertCircleIcon, CheckCircleIcon } from './icons.jsx';

const variants = {
    error: {
        role: 'alert',
        box: 'border-destructive/25 bg-destructive/10 text-destructive-text',
        icon: <AlertCircleIcon className="mt-0.5" />,
    },
    success: {
        role: 'status',
        box: 'border-success/25 bg-success/10 text-success',
        icon: <CheckCircleIcon className="mt-0.5" />,
    },
};

// variant: error | success. Pass `onRetry` to show a "Reintentar" button.
// `silent` drops the live-region role when a parent region already announces it.
export default function Alert({ variant = 'error', onRetry, silent = false, children }) {
    const { role, box, icon } = variants[variant];

    return (
        <div
            role={silent ? undefined : role}
            className={`flex items-start gap-2.5 rounded-md border p-3 text-13 leading-5 ${box}`}
        >
            {icon}
            <p className="min-w-0 flex-1 break-words">{children}</p>
            {onRetry && (
                <Button variant="ghost" size="sm" onClick={onRetry} className="-my-1.5 -mr-1.5">
                    Reintentar
                </Button>
            )}
        </div>
    );
}
