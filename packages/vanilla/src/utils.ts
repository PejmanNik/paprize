export function get(obj: unknown, path: string | null): string | undefined {
    if (!obj || !path) {
        return;
    }

    // Convert path string to array of keys
    const keys = path
        .replace(/\[(\d+)\]/g, '.$1') // Convert array notation to dot notation
        .split('.')
        .filter(Boolean); // Remove empty strings

    // Traverse the object
    let result: unknown = obj;

    for (const key of keys) {
        if (result == null) {
            return;
        }

        result = result[key as keyof typeof result];
    }

    return result?.toString();
}
