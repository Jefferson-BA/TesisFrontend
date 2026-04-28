import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  // Usamos useState para asegurarnos de que el cliente se cree una sola vez
  // y no se reinicie en cada renderizado de React
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Evita que haga peticiones cada vez que cambias de pestaña
        retry: 1, // Si falla, solo reintenta 1 vez
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}