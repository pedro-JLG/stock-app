import { PackageIcon } from './icons.jsx';

// Small neutral glyph used in the navbar and above the auth cards.
export default function Logo({ size = 24 }) {
    return (
        <span
            className="flex items-center justify-center rounded-md border border-border bg-card text-foreground"
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            <PackageIcon size={Math.round(size * 0.6)} />
        </span>
    );
}
