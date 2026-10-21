/**
 * Server-side admin password handling.
 *
 * Passwords are never sent to the browser. The client posts a candidate to
 * /api/data and gets back a boolean; comparison happens here.
 *
 * Uses Web Crypto (PBKDF2-SHA256), which exists in both the Node runtime and
 * the Cloudflare Workers runtime this app deploys to - `node:crypto` would not.
 */

const ITERATIONS = 100_000;
const KEY_BITS = 256;
const PREFIX = "pbkdf2";
const SEP = ":"; // not "$": .env loaders expand $NAME, mangling the value

function toB64(bytes: ArrayBuffer): string {
  const b = new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s);
}

function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function derive(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    KEY_BITS
  );
  return toB64(bits);
}

/** Produce a storable hash: `pbkdf2$<iterations>$<salt>$<hash>`. */
export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(plain, salt);
  return [PREFIX, ITERATIONS, toB64(salt.buffer), hash].join(SEP);
}

export function isHashed(stored: string): boolean {
  return typeof stored === "string" && stored.startsWith(PREFIX + SEP);
}

/** Constant-time-ish comparison, so a wrong guess cannot be timed character by character. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Check a candidate password against what is stored.
 *
 * `needsUpgrade` is true when the stored value was still legacy plaintext and
 * the caller should re-save it as a hash.
 */
export async function verifyPassword(
  plain: string,
  stored: string
): Promise<{ ok: boolean; needsUpgrade: boolean }> {
  if (!plain || !stored) return { ok: false, needsUpgrade: false };

  if (!isHashed(stored)) {
    // Legacy plaintext row, from before passwords were hashed.
    return { ok: safeEqual(plain, stored), needsUpgrade: safeEqual(plain, stored) };
  }

  const [, iterStr, saltB64, expected] = stored.split(SEP);
  const iterations = parseInt(iterStr, 10) || ITERATIONS;
  const salt = fromB64(saltB64);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(plain),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as unknown as BufferSource, iterations, hash: "SHA-256" },
    key,
    KEY_BITS
  );
  return { ok: safeEqual(toB64(bits), expected), needsUpgrade: false };
}
