import { API_BASE } from './config';

function getUserFriendlyError(e: unknown): string {
  if (e instanceof TypeError && e.message === 'Failed to fetch') {
    return 'Cannot connect to backend. Make sure the backend server is running (dotnet run or docker-compose up). See SETUP.md for instructions.';
  }
  if (e instanceof Error) return e.message;
  return 'Something went wrong. Please try again.';
}

export async function* streamChat(message: string): AsyncGenerator<string, void, unknown> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch (e) {
    throw new Error(getUserFriendlyError(e));
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const parsed = JSON.parse(line.slice(6));
          if (typeof parsed === 'string') yield parsed;
        } catch {
          // skip invalid JSON
        }
      }
    }
  }
}
