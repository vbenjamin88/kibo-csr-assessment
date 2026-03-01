import { API_BASE } from './config';

export interface SetupStatus {
  configured: boolean;
  message: string;
  backendReachable?: boolean;
}

export async function getSetupStatus(): Promise<SetupStatus> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE}/setup/status`, {
      signal: controller.signal,
      credentials: 'omit',
    });
    clearTimeout(timeoutId);
    if (!res.ok) return { configured: false, message: 'Unable to check setup status.', backendReachable: true };
    const data = await res.json();
    return { ...data, backendReachable: true };
  } catch {
    clearTimeout(timeoutId);
    return { configured: false, message: 'Backend unreachable', backendReachable: false };
  }
}
