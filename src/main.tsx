import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App.tsx";
import "./index.css";

/**
 * ============================================================
 * TANSTACK QUERY SETUP
 * ============================================================
 * 
 * QueryClient is the "brain" of React Query.
 * It manages:
 *   - Cache: stores fetched data
 *   - Background refetching
 *   - Stale time management
 *   - Query invalidation
 * 
 * Default Options explained:
 *   - staleTime: How long data is "fresh" before needing refetch (5 min)
 *   - gcTime: How long unused data stays in cache before garbage collection (10 min)
 *   - retry: Number of automatic retries on failure
 *   - refetchOnWindowFocus: Refetch when user tabs back to app
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes - no refetch during this time
      staleTime: 1000 * 60 * 5,
      
      // Keep unused data in cache for 10 minutes
      gcTime: 1000 * 60 * 10,
      
      // Retry failed requests once
      retry: 1,
      
      // Refetch when window regains focus (good for real-time data)
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  /**
   * QueryClientProvider makes the queryClient available
   * to all components in the tree via React Context.
   * 
   * ReactQueryDevtools is a floating panel (dev only) that shows:
   *   - All cached queries
   *   - Query states (loading, error, success)
   *   - Cache inspection
   *   - Manual invalidation
   */
  <QueryClientProvider client={queryClient}>
    <App />
    {/* DevTools only shows in development, hidden in production */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
