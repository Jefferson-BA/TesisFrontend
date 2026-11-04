import { QueryClient } from '@tanstack/react-query';
let browserClient: QueryClient | undefined;
function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30000, retry: 1, refetchOnWindowFocus: true },
      mutations: { retry: false },
    },
  });
}
export function getQueryClient() {
  if (typeof window === 'undefined') return createClient();
  return (browserClient ??= createClient());
}
export function clearQueryCache() {
  browserClient?.clear();
}
