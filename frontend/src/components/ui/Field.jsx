import FieldError from '../FieldError.jsx';
import { labelClass } from './styles.js';

// Label + control + error message. The control gets `id` and `error` too.
export default function Field({ id, label, error, children }) {
    return (
        <div>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            {children}
            <FieldError id={`${id}-error`} message={error} />
        </div>
    );
}
