import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotificationStore } from '@/stores/notification.store';
import { App } from './App';
import './styles/global.css';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      useNotificationStore
        .getState()
        .addNotification('error', error.message || 'Error al cargar los datos');
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
