import { useEffect, useId, useRef } from 'react';
import Button from './Button.jsx';

// Modal confirmation built on the native <dialog>: focus trap, Escape key and
// backdrop come from the browser. The parent owns `open` and both callbacks.
export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
}) {
    const dialogRef = useRef(null);
    const pressStartedOnBackdrop = useRef(false);
    const titleId = useId();
    const descriptionId = useId();

    // Keep the native dialog in sync with the `open` prop.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) {
            return;
        }
        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            // Escape key: let the parent decide instead of closing the dialog directly.
            onCancel={(e) => {
                e.preventDefault();
                onCancel();
            }}
            // Backdrop clicks land on the <dialog> itself. Remember where the press
            // started so a drag from inside the dialog does not close it.
            onMouseDown={(e) => {
                pressStartedOnBackdrop.current = e.target === e.currentTarget;
            }}
            onClick={(e) => {
                if (pressStartedOnBackdrop.current && e.target === e.currentTarget) {
                    onCancel();
                }
                pressStartedOnBackdrop.current = false;
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-md overscroll-contain rounded-xl border border-border bg-card p-0 text-foreground backdrop:bg-background/80"
        >
            <div className="p-6">
                <h2 id={titleId} className="text-base leading-6 font-semibold break-words">
                    {title}
                </h2>
                <p
                    id={descriptionId}
                    className="mt-2 text-sm leading-5 break-words text-text-secondary"
                >
                    {description}
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onCancel}>
                        {cancelLabel}
                    </Button>
                    <Button variant="dangerSolid" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </dialog>
    );
}
