/**
 * Utility to check if a PDF URL is valid and accessible
 */
export function isPdfAvailable(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "#") return false;
  return true;
}
