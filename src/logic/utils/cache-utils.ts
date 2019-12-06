
export default class Cache
{
    map: Map<string, any> = new Map();

    /**
     * Get a cached value, or if not cached, cache it.
     *
     * @param name Name of the cached value
     * @param callback Callback function
     */
    public get(name: string, callback: () => any)
    {
        if (!this.map.has(name))
        {
            this.map.set(name, callback());
        }
        return this.map.get(name);
    }
}
