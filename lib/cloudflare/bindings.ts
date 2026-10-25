/**
 * Cloudflare Native Bindings Accessor
 * Provides unified access to Cloudflare KV and R2 bindings across OpenNext and Cloudflare Workers runtimes.
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

/** Retrieve the Cloudflare execution environment context */
export function getCloudflareEnv(): any {
  if (typeof globalThis === "undefined") return null;
  const g = globalThis as any;

  // 1. OpenNext symbol-based context (Symbol.for("__cloudflare-context__"))
  try {
    const ctxSymbol = Symbol.for("__cloudflare-context__");
    const ctx = g[ctxSymbol];
    if (ctx && ctx.env) return ctx.env;
  } catch {}

  // 2. OpenNext direct context properties
  if (g.__cloudflare_context__?.env) return g.__cloudflare_context__.env;
  if (g.__cf_env__) return g.__cf_env__;
  if (g.__ENV__) return g.__ENV__;
  if (g.env) return g.env;

  // 3. Process environment (if mapped)
  if (typeof process !== "undefined" && (process as any)?.env) {
    const p = (process as any).env;
    if (p.PARAMDHAM_R2 || p.PARAMDHAM_KV) return p;
  }

  return g;
}

export function getCloudflareKV(): CloudflareKV | null {
  try {
    const env = getCloudflareEnv();
    if (!env) return null;
    const kv =
      env.PARAMDHAM_KV ||
      env.DATA_STORE ||
      env.PARAMDHAM_DB ||
      env.KV;
    if (kv && typeof kv.get === "function") return kv;
  } catch {}
  return null;
}

export function getCloudflareR2(): CloudflareR2 | null {
  try {
    const env = getCloudflareEnv();
    if (!env) return null;
    const r2 =
      env.PARAMDHAM_R2 ||
      env["sadhauli-dham-uploads"] ||
      env.R2 ||
      env.UPLOADS_BUCKET ||
      env.BUCKET;
    if (r2 && typeof r2.put === "function") return r2;
  } catch {}
  return null;
}
