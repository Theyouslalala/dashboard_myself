import Taro from "@tarojs/taro";

// ─── 配置 ───

/** 部署在 Vercel 的 Next.js API 基础地址 */
const BASE_URL = "https://dashboard-myself.vercel.app";

const TIMEOUT = 10_000;

// ─── 缓存 ───

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 分钟
const MAX_CACHE_SIZE = 30;

const cache = new Map<string, CacheEntry<unknown>>();

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  if (!cache.has(key) && cache.size >= MAX_CACHE_SIZE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── 请求封装 ───

export interface RequestResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * 统一请求方法，带缓存和错误处理
 */
export async function request<T>(
  path: string,
  options: { useCache?: boolean } = {}
): Promise<RequestResult<T>> {
  const { useCache = true } = options;
  const cacheKey = `api:${path}`;

  // 读缓存
  if (useCache) {
    const cached = getCache<T>(cacheKey);
    if (cached !== null) {
      return { data: cached, error: null };
    }
  }

  try {
    const res = await Taro.request({
      url: `${BASE_URL}${path}`,
      method: "GET",
      timeout: TIMEOUT,
      header: {
        "Content-Type": "application/json",
      },
    });

    if (res.statusCode >= 400) {
      const msg =
        typeof res.data === "object" && res.data?.error
          ? res.data.error
          : `HTTP ${res.statusCode}`;
      return { data: null, error: msg };
    }

    const data = res.data as T;
    if (useCache) {
      setCache(cacheKey, data);
    }
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "网络请求失败";
    return { data: null, error: message };
  }
}

/**
 * 清除所有缓存
 */
export function clearCache(): void {
  cache.clear();
}
