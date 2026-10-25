/**
 * Cloudflare Native Bindings Accessor
 * Provides unified access to Cloudflare KV and R2 bindings across edge runtimes and local mock fallbacks.
 */

export interface CloudflareKV {
  get(key: string, type?: "text" | "json" | "arrayBuffer" | "stream"): Promise<any>;
  put(key: string, value: string | ArrayBuffer | ReadableStream, options?: any): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: any): Promise<{ keys: { name: string }[] }>;
}

export interface CloudflareR2 {
  get(key: string): Promise<any>;
  put(key: string, value: any, options?: any): Promise<any>;
  delete(key: string | string[]): Promise<void>;
  list(options?: any): Promise<any>;
}

export function getCloudflareKV(): CloudflareKV | null {
  try {
    if (typeof globalThis !== "undefined") {
      const g = globalThis as any;
      if (g.PARAMDHAM_KV) return g.PARAMDHAM_KV;
      if (g.DATA_STORE) return g.DATA_STORE;
      if (g.PARAMDHAM_DB) return g.PARAMDHAM_DB;
      if (g.__ENV__?.PARAMDHAM_KV) return g.__ENV__.PARAMDHAM_KV;
      if (g.env?.PARAMDHAM_KV) return g.env.PARAMDHAM_KV;
    }
    if (typeof process !== "undefined" && (process as any).env) {
      const p = (process as any).env;
      if (p.PARAMDHAM_KV && typeof p.PARAMDHAM_KV.get === "function") return p.PARAMDHAM_KV;
      if (p.DATA_STORE && typeof p.DATA_STORE.get === "function") return p.DATA_STORE;
    }
  } catch {}
  return null;
}

export function getCloudflareR2(): CloudflareR2 | null {
  try {
    if (typeof globalThis !== "undefined") {
      const g = globalThis as any;
      if (g.PARAMDHAM_R2) return g.PARAMDHAM_R2;
      if (g.__ENV__?.PARAMDHAM_R2) return g.__ENV__.PARAMDHAM_R2;
      if (g.env?.PARAMDHAM_R2) return g.env.PARAMDHAM_R2;
    }
    if (typeof process !== "undefined" && (process as any).env) {
      const p = (process as any).env;
      if (p.PARAMDHAM_R2 && typeof p.PARAMDHAM_R2.put === "function") return p.PARAMDHAM_R2;
    }
  } catch {}
  return null;
}
