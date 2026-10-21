#!/usr/bin/env node
/**
 * Generate an ADMIN_PASSWORD_HASH for the admin login.
 *
 *   node scripts/hash-admin-password.mjs 'your new password'
 *
 * Put the printed value in your hosting environment (Cloudflare secret, or
 * .env.local for development). The plaintext is never stored anywhere.
 */
const ITERATIONS = 100_000;

const plain = process.argv[2];
if (!plain) {
  console.error("usage: node scripts/hash-admin-password.mjs '<password>'");
  process.exit(1);
}
if (plain.length < 12) {
  console.error(`refusing: use at least 12 characters (got ${plain.length}).`);
  process.exit(1);
}

const toB64 = (buf) => Buffer.from(new Uint8Array(buf)).toString("base64");
const salt = crypto.getRandomValues(new Uint8Array(16));
const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(plain), "PBKDF2", false, ["deriveBits"]);
const bits = await crypto.subtle.deriveBits(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  key,
  256
);

console.log("\nADMIN_PASSWORD_HASH=" + ["pbkdf2", ITERATIONS, toB64(salt.buffer), toB64(bits)].join(":"));
console.log("\nSet it as a secret on your host, e.g.:");
console.log("  npx wrangler secret put ADMIN_PASSWORD_HASH\n");
