
const cacheMap: Map<string, any> = new Map();

/**
 * Get a cached value, or if not cached, cache it.
 *
 * @param name Name of the cached value
 * @param callback Callback function
 */
export default function cache(name: string, callback: () => any)
{
    if (!cacheMap.has(name))
    {
        cacheMap.set(name, callback());
    }
    return cacheMap.get(name);
}
