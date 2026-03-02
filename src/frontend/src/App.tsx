import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Chat } from './components/Chat';
import { ChatWidget } from './components/ChatWidget';
import { HomePage } from './pages/HomePage';
import { ChatPage } from './pages/ChatPage';
import { useTheme } from './hooks/useTheme';

const WIDGET_OPEN_KEY = 'kibo-csr-widget-open';

function getStoredWidgetOpen(): boolean {
  try {
    return localStorage.getItem(WIDGET_OPEN_KEY) === 'true';
  } catch {
    return false;
  }
}

function setStoredWidgetOpen(open: boolean) {
  try {
    localStorage.setItem(WIDGET_OPEN_KEY, String(open));
  } catch {
    /* ignore */
  }
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [widgetOpen, setWidgetOpen] = React.useState(getStoredWidgetOpen);

  const handleWidgetOpenChange = (open: boolean) => {
    setWidgetOpen(open);
    setStoredWidgetOpen(open);
  };

  const handleOpenWidget = () => {
    setWidgetOpen(true);
    setStoredWidgetOpen(true);
  };

  const handleMaximize = () => {
    setWidgetOpen(false);
    setStoredWidgetOpen(false);
    navigate('/chat');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="sticky top-0 z-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg'} alt="Kibo" className="w-10 h-10" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Kibo CSR Assistant
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order lookup &amp; cancellation
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/chat"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/chat'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              Chat
            </Link>
          </nav>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors [&>svg]:block [&>svg]:m-0"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden w-full max-w-3xl mx-auto px-4 sm:px-6 py-4">
        <Routes>
          <Route path="/" element={
            <div className="flex-1 flex flex-col min-h-0 min-w-0 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
              <HomePage onOpenWidget={handleOpenWidget} />
            </div>
          } />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>

      {/* Floating chat widget - on Home and other pages (hidden on Chat page which has full chat) */}
      {location.pathname !== '/chat' && (
        <ChatWidget
          open={widgetOpen}
          onOpenChange={handleWidgetOpenChange}
          onMaximize={handleMaximize}
        >
          <Chat />
        </ChatWidget>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
