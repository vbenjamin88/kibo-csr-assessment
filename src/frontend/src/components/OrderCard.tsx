import React from 'react';
import type { Order, OrderStatus } from '../types/order';

interface OrderCardProps {
  order: Order;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-300 dark:border-amber-700',
  Shipped: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
  Cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-600',
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const statusClass = statusStyles[order.status] ?? statusStyles.Pending;

  return (
    <div
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md overflow-hidden my-3 max-w-md"
      data-testid="order-card"
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
            Order #{order.orderId}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusClass}`}
          >
            {order.status}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          {order.customerName}
        </p>
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">
          ${order.total.toFixed(2)}
        </p>
        <ul className="space-y-1" aria-label="Order items">
          {order.items.map((item, i) => (
            <li
              key={i}
              className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-kibo-yellow dark:bg-kibo-yellow flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
