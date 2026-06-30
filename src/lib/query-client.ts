import { QueryClient } from '@tanstack/react-query';

/**
 * Single shared QueryClient for the app. Imported by the root layout's
 * QueryClientProvider and reused everywhere through the React Query hooks.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 30,
            retry: 1,
        },
    },
});
