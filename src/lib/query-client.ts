import { QueryClient } from '@tanstack/react-query';

/** Single shared QueryClient, provided by the root layout. */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 30,
            retry: 1,
        },
    },
});
