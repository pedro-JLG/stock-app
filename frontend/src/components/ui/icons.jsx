// Inline SVG icons (Lucide-style paths). They inherit the text color via currentColor.

function Svg({ size = 16, className = '', children }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            className={`shrink-0 ${className}`}
        >
            {children}
        </svg>
    );
}

export function PackageIcon(props) {
    return (
        <Svg {...props}>
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </Svg>
    );
}

export function SearchIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </Svg>
    );
}

export function PlusIcon(props) {
    return (
        <Svg {...props}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </Svg>
    );
}

export function ChevronDownIcon(props) {
    return (
        <Svg {...props}>
            <path d="m6 9 6 6 6-6" />
        </Svg>
    );
}

export function ChevronLeftIcon(props) {
    return (
        <Svg {...props}>
            <path d="m15 18-6-6 6-6" />
        </Svg>
    );
}

export function ChevronRightIcon(props) {
    return (
        <Svg {...props}>
            <path d="m9 18 6-6-6-6" />
        </Svg>
    );
}

export function AlertCircleIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
        </Svg>
    );
}

export function CheckCircleIcon(props) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </Svg>
    );
}

export function ArrowDownLeftIcon(props) {
    return (
        <Svg {...props}>
            <path d="M17 7 7 17" />
            <path d="M17 17H7V7" />
        </Svg>
    );
}

export function ArrowUpRightIcon(props) {
    return (
        <Svg {...props}>
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </Svg>
    );
}
