/**
 * API base URL. Uses VITE_API_URL when deployed (e.g. Vercel); falls back to /api for local dev (proxy).
 */
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '') || '/api';
