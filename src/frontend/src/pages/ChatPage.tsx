import React from 'react';
import { Chat } from '../components/Chat';

export const ChatPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
      <Chat />
    </div>
  );
};
