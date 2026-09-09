/**
 * Returns a shallow copy of `obj` containing only keys whose value is not
 * `undefined`. Used when building PATCH payloads so that fields the client
 * omitted don't get overwritten with `undefined` in the in-memory store.
 */
export function pickDefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}
