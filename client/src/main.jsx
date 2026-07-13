import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SocketProvider>
            <App />
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                className: 'font-sans text-[13px]',
                style: {
                  borderRadius: '14px',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 8px 24px -8px rgba(15, 23, 42, 0.12)',
                },
              }}
            />
          </SocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
}
