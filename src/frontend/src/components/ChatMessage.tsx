import React from 'react';
import { OrderCard } from './OrderCard';
import type { Order } from '../types/order';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  orders?: Record<string, Order>;
  isStreaming?: boolean;
}

const ORDER_PATTERN = /\[ORDER:(\d+)\]/g;

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, orders = {}, isStreaming }) => {
  const isUser = role === 'user';

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  ORDER_PATTERN.lastIndex = 0;

  while ((m = ORDER_PATTERN.exec(content)) !== null) {
    parts.push(content.slice(lastIndex, m.index));
    const orderId = m[1];
    const order = orders[orderId];
    if (order) {
      parts.push(<OrderCard key={m.index} order={order} />);
    } else {
      parts.push(<span key={m.index} className="text-slate-500 dark:text-slate-400">[Order #{orderId}]</span>);
    }
    lastIndex = ORDER_PATTERN.lastIndex;
  }
  parts.push(content.slice(lastIndex));

  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
      data-testid={`chat-message-${role}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-kibo-yellow text-slate-900 dark:bg-kibo-yellow-dark dark:text-slate-900'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
        }`}
      >
        <div className="space-y-2">
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {typeof p === 'string' ? (
                <p className="whitespace-pre-wrap break-words">{p}</p>
              ) : (
                p
              )}
            </React.Fragment>
          ))}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-current animate-pulse ml-0.5" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
};
