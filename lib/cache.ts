interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function createCache<T>(maxSize: number, durationMs: number) {
  const store = new Map<string, CacheEntry<T>>();

  function get(key: string): T | null {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > durationMs) {
      store.delete(key);
      return null;
    }
    return entry.data;
  }

  function set(key: string, data: T): void {
    if (store.size >= maxSize) {
      const oldest = store.keys().next().value;
      if (oldest !== undefined) store.delete(oldest);
    }
    store.set(key, { data, timestamp: Date.now() });
  }

  return { get, set };
}
