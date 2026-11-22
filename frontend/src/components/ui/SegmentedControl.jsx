import { useId } from 'react';

// Radio group that looks like a two-button toggle. It uses real radio inputs,
// so keyboard (arrow keys) and screen readers work without extra code.
// `onChange` receives the normal change event (e.target.name / e.target.value).
export default function SegmentedControl({
    name,
    label,
    value,
    onChange,
    options,
    describedBy,
    invalid = false,
}) {
    const labelId = useId();

    return (
        <div>
            <span id={labelId} className="mb-1.5 block text-13 leading-5 font-medium">
                {label}
            </span>
            <div
                role="radiogroup"
                aria-invalid={invalid ? true : undefined}
                aria-describedby={describedBy}
                aria-labelledby={labelId}
                className="grid w-full grid-cols-2 gap-1 rounded-md border border-border bg-background p-1"
            >
                {options.map((option) => (
                    <label key={option.value} className="relative">
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                            className="peer sr-only"
                        />
                        <span className="flex h-7 cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-transparent text-13 font-medium text-text-secondary transition-colors duration-100 hover:text-foreground peer-checked:border-selected-border peer-checked:bg-selected peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                            <span
                                aria-hidden="true"
                                className={value === option.value ? option.selectedIconClass : ''}
                            >
                                {option.icon}
                            </span>
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
