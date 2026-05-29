function isPlainObject(value: unknown): value is Record<string, unknown> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

function isValidIdentifier(key: string): boolean {
    return /^[A-Za-z_$][\w$]*$/.test(key);
}

function escapeString(value: string): string {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
}

function serialize(value: unknown): string | null {
    if (value === null) {
        return 'null';
    }

    if (typeof value === 'string') {
        return `'${escapeString(value)}'`;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) ? String(value) : null;
    }

    if (typeof value === 'boolean') {
        return String(value);
    }

    if (Array.isArray(value)) {
        const items: string[] = [];

        for (const item of value) {
            const serialized = serialize(item);
            if (serialized === null) {
                return null;
            }
            items.push(serialized);
        }

        return `[${items.join(', ')}]`;
    }

    if (isPlainObject(value)) {
        const entries: string[] = [];

        for (const [key, item] of Object.entries(value)) {
            const serialized = serialize(item);
            if (serialized === null) {
                return null;
            }

            const renderedKey = isValidIdentifier(key) ? key : `'${escapeString(key)}'`;
            entries.push(`${renderedKey}: ${serialized}`);
        }

        return `{ ${entries.join(', ')} }`;
    }

    return null;
}

export function serializeJSXPropValue(value: unknown): string | null {
    return serialize(value);
}
