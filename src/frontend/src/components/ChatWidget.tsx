import React from 'react';
import { useTheme } from '../hooks/useTheme';

const WIDGET_STORAGE_KEY = 'kibo-csr-widget-open';

function getStoredOpen(): boolean {
  try {
    const v = localStorage.getItem(WIDGET_STORAGE_KEY);
    return v === 'true';
  } catch {
    return false;
  }
}

function setStoredOpen(open: boolean) {
  try {
    localStorage.setItem(WIDGET_STORAGE_KEY, String(open));
  } catch {
    /* ignore */
  }
}

interface ChatWidgetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onMaximize?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
  onMaximize,
}) => {
  const { theme } = useTheme();
  const [internalOpen, setInternalOpen] = React.useState(getStoredOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    setStoredOpen(value);
    onOpenChange?.(value);
  };

  const toggle = () => setOpen(!open);
  const close = () => setOpen(false);

  const maximize = () => {
    close();
    onMaximize?.();
  };

  return (
    <>
      {/* Floating toggle button - visible when widget is closed */}
      {!open && (
        <button
          onClick={toggle}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-kibo-yellow shadow-lg transition-all duration-200 hover:scale-105 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-kibo-yellow focus:ring-offset-2 dark:bg-kibo-yellow dark:hover:bg-amber-500 dark:focus:ring-offset-slate-900"
          aria-label="Open assistant"
          aria-expanded={false}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Expandable chat pane */}
      {open && (
        <div
          className="fixed z-40 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-2xl overflow-hidden"
          style={{
            bottom: '5.5rem',
            right: '1.5rem',
            width: 'min(calc(100vw - 3rem), 400px)',
            height: 'min(calc(100vh - 8rem), 560px)',
          }}
          role="dialog"
          aria-label="Kibo CSR Assistant chat"
        >
          {/* Widget header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <img
                src={theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg'}
                alt=""
                className="w-8 h-8"
              />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Kibo Assistant
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Order lookup &amp; cancellation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onMaximize && (
                <button
                  onClick={maximize}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  aria-label="Open in full page"
                  title="Open in full page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </button>
              )}
              <button
                onClick={close}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                aria-label="Close"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </>
  );
};
