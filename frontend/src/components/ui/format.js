// Small presentation helpers (not components).

const numberFormat = new Intl.NumberFormat('es-AR');

// 12345 -> "12.345". Keeps big counts readable.
export function formatNumber(value) {
    return typeof value === 'number' ? numberFormat.format(value) : String(value ?? '');
}

// "Ana María Pérez" -> "AP"
export function getInitials(name) {
    const words = String(name ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (words.length === 0) {
        return '?';
    }
    // Array.from keeps emoji and other multi-unit characters whole.
    const first = Array.from(words[0])[0];
    const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';
    return (first + last).toUpperCase();
}
