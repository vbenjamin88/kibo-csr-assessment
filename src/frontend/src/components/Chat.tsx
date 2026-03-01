import React, { useState, useRef, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { KiboLoadingIcon } from './KiboLoadingIcon';
import { useDragToScroll } from '../hooks/useDragToScroll';
import { streamChat } from '../api/chat';
import { getOrder } from '../api/orders';
import type { Order } from '../types/order';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  orders: Record<string, Order>;
  isStreaming?: boolean;
}

const ORDER_REF = /\[ORDER:(\d+)\]/g;

async function fetchOrderRefs(content: string): Promise<Record<string, Order>> {
  const ids = [...content.matchAll(ORDER_REF)].map((m) => m[1]);
  const uniq = [...new Set(ids)];
  const map: Record<string, Order> = {};
  await Promise.all(
    uniq.map(async (id) => {
      const o = await getOrder(id);
      if (o) map[id] = o;
    })
  );
  return map;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useDragToScroll<HTMLDivElement>();

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSend = useCallback(async (text: string) => {
    setError(null);
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      orders: {},
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', orders: {}, isStreaming: true },
    ]);
    scrollToBottom();

    let content = '';
    try {
      for await (const chunk of streamChat(text)) {
        content += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content } : m
          )
        );
        scrollToBottom();
      }

      const orders = await fetchOrderRefs(content);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, orders, isStreaming: false } : m
        )
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setError(msg);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: msg, orders: {}, isStreaming: false }
            : m
        )
      );
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }, [scrollToBottom]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        ref={scrollContainerRef}
        className="chat-messages-scroll flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 min-h-0"
      >
        {messages.length === 0 && (
          <div className="text-center py-12 px-4">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
              How can I help you today?
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Try &quot;Can you pull up order #101?&quot; or &quot;Customer wants to cancel order #101&quot;
            </p>
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            role={m.role}
            content={m.content}
            orders={m.orders}
            isStreaming={m.isStreaming}
          />
        ))}
        {loading && (
          <div className="flex justify-start" data-testid="chat-loading">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-700 px-4 py-3">
              <KiboLoadingIcon size={24} />
              <span className="text-sm text-slate-600 dark:text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
        {error && (
          <div
            className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="sticky bottom-0 flex-shrink-0 z-10 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};
