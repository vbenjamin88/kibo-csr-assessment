import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

interface HomePageProps {
  onOpenWidget?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenWidget }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleOpenChat = () => {
    if (onOpenWidget) {
      onOpenWidget();
    } else {
      navigate('/chat');
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Hero section */}
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
        <img
          src={theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg'}
          alt="Kibo"
          className="w-20 h-20 mb-6"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Kibo CSR Assistant
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
          Order lookup &amp; cancellation at your fingertips. Look up order status, view details, and cancel orders using natural language.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleOpenChat}
            className="inline-flex items-center gap-2 rounded-xl bg-kibo-yellow px-6 py-3 font-medium text-slate-900 shadow-lg transition-all hover:bg-amber-400 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-kibo-yellow focus:ring-offset-2 dark:bg-kibo-yellow dark:hover:bg-amber-500 dark:focus:ring-offset-slate-900"
            aria-label="Open assistant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Quick Chat
          </button>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 px-6 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Full Chat Page
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
          Or use the chat button in the bottom-right corner anytime
        </p>
      </div>

      {/* Quick tips section */}
      <div className="flex-1 px-4 sm:px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            What you can do
          </h2>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kibo-yellow/20 flex items-center justify-center text-kibo-yellow-dark dark:text-kibo-yellow">1</span>
              <span>Ask for order status: &quot;Order status of 102&quot; or &quot;Look up order #101&quot;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kibo-yellow/20 flex items-center justify-center text-kibo-yellow-dark dark:text-kibo-yellow">2</span>
              <span>Cancel orders: &quot;Cancel order 101&quot; or view an order first, then say &quot;Cancel it&quot;</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-kibo-yellow/20 flex items-center justify-center text-kibo-yellow-dark dark:text-kibo-yellow">3</span>
              <span>Use the floating chat for quick lookups while working, or the full page for longer sessions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
