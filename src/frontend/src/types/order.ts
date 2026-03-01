export type OrderStatus = 'Pending' | 'Shipped' | 'Cancelled';

export interface Order {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  items: string[];
}
