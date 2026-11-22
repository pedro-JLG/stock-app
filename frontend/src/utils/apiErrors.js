// Converts ApiError.errors ([{field, message}]) into { field: message }.
export function toFieldErrors(err) {
    const result = {};
    for (const item of err.errors ?? []) {
        if (!result[item.field]) {
            result[item.field] = item.message;
        }
    }
    return result;
}
