import type { Order } from '../types/order';

const API_BASE = '/api';

export async function getOrder(orderId: string): Promise<Order | null> {
  const id = orderId.replace(/^#/, '').trim();
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  return res.json();
}
