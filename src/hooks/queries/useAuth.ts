/**
 * ============================================================
 * AUTH QUERY HOOKS
 * ============================================================
 * 
 * This file contains React Query hooks for authentication-related
 * data fetching. These are READ operations (GET requests).
 * 
 * KEY CONCEPTS:
 * 
 * 1. useQuery - Used for fetching/reading data
 *    - Automatically caches the response
 *    - Handles loading, error, and success states
 *    - Re-fetches when cache becomes stale
 * 
 * 2. queryKey - Unique identifier for cached data
 *    - Used to retrieve cached data
 *    - Used to invalidate/refetch specific queries
 *    - Can be an array for hierarchical organization: ['auth', 'profile']
 * 
 * 3. queryFn - The actual function that fetches data
 *    - Must return a Promise
 *    - Usually your axios/fetch call
 */

import { useQuery } from "@tanstack/react-query";
import { getProfile, getSocketToken } from "@/services/authServices";

/**
 * Hook to fetch the current user's profile
 * 
 * Usage in component:
 * ```tsx
 * const { data, isLoading, isError, error } = useProfile();
 * 
 * if (isLoading) return <Spinner />;
 * if (isError) return <Error message={error.message} />;
 * 
 * return <div>Welcome, {data?.user.fullname}!</div>;
 * ```
 */
export const useProfile = () => {
  return useQuery({
    // Unique cache key - data will be stored under ['auth', 'profile']
    queryKey: ["auth", "profile"],
    
    // Function that fetches the data
    queryFn: getProfile,
    
    // Don't retry on 401 (unauthorized) - user just needs to login
    retry: (failureCount, error) => {
      const axiosError = error as Error & { response?: { status?: number } };
      if (axiosError?.response?.status === 401) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Hook to fetch a socket authentication token
 * 
 * This token is used to authenticate WebSocket connections.
 * 
 * Options:
 * - enabled: false means this query won't run automatically
 *   You must call refetch() manually when you need the token
 * 
 * Usage:
 * ```tsx
 * const { data: socketToken, refetch: fetchSocketToken } = useSocketToken();
 * 
 * // When you need to connect socket:
 * const { data } = await fetchSocketToken();
 * initializeSocket(data);
 * ```
 */
export const useSocketToken = () => {
  return useQuery({
    queryKey: ["auth", "socket-token"],
    queryFn: getSocketToken,
    
    // Don't fetch automatically - only when explicitly called
    enabled: false,
    
    // Socket tokens should always be fresh
    staleTime: 0,
  });
};

/**
 * ============================================================
 * WHAT THESE HOOKS RETURN (from useQuery)
 * ============================================================
 * 
 * {
 *   data: TData | undefined,        // The fetched data
 *   isLoading: boolean,             // True during initial load (no cached data)
 *   isFetching: boolean,            // True during any fetch (including background)
 *   isError: boolean,               // True if query failed
 *   error: Error | null,            // The error object
 *   isSuccess: boolean,             // True if query succeeded
 *   refetch: () => Promise,         // Manually trigger refetch
 *   status: 'pending' | 'error' | 'success',
 * }
 * 
 * LOADING vs FETCHING:
 * - isLoading: First time loading, no cached data exists
 * - isFetching: Any fetch operation (including background refresh)
 * 
 * Example: User visits page → isLoading=true, isFetching=true
 * After fetch → isLoading=false, isFetching=false
 * User tabs away and back → isLoading=false, isFetching=true (background refresh)
 */
