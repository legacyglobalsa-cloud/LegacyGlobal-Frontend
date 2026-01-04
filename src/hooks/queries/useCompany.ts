/**
 * ============================================================
 * COMPANY QUERY & MUTATION HOOKS
 * ============================================================
 * 
 * Full CRUD operations for company profile:
 * - CREATE: useCreateCompany
 * - READ: useCompanyProfile
 * - UPDATE: useUpdateCompany
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyCompanyProfile,
  createCompanyProfile,
  updateMyCompanyProfile,
  type CreateCompanyPayload,
  type UpdateCompanyPayload,
  type CompanyResponse,
} from "@/services/companyServices";

/* ============================================================
 * QUERY KEYS
 * ============================================================
 * Centralized query keys for consistency
 */
export const companyKeys = {
  all: ["company"] as const,
  profile: () => [...companyKeys.all, "profile"] as const,
};

/* ============================================================
 * QUERIES (READ operations)
 * ============================================================ */

/**
 * Hook to fetch the current user's company profile
 * 
 * Returns null/undefined if company doesn't exist (404)
 * which means the user needs to create one.
 */
export const useCompanyProfile = () => {
  return useQuery({
    queryKey: companyKeys.profile(),
    queryFn: async () => {
      try {
        return await getMyCompanyProfile();
      } catch (error) {
        // If 404, company doesn't exist - return null instead of throwing
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status === 404) {
          return { success: false, company: null } as CompanyResponse;
        }
        throw error;
      }
    },
    // Keep cached data for 5 minutes
    staleTime: 1000 * 60 * 5,
  });
};

/* ============================================================
 * MUTATIONS (CREATE/UPDATE/DELETE operations)
 * ============================================================ */

/**
 * Hook to CREATE a new company profile
 * 
 * Usage:
 * ```tsx
 * const { mutate: createCompany, isPending } = useCreateCompany();
 * 
 * const handleCreate = (formData) => {
 *   createCompany(formData, {
 *     onSuccess: (data) => {
 *       toast.success("Company created!");
 *       navigate("/client/kyc");
 *     },
 *     onError: (error) => {
 *       toast.error(error.response?.data?.message);
 *     },
 *   });
 * };
 * ```
 */
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload): Promise<CompanyResponse> =>
      createCompanyProfile(payload),

    onSuccess: (data) => {
      // Update cache with new company data
      queryClient.setQueryData(companyKeys.profile(), data);
      
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },

    onError: (error: Error) => {
      console.error("Failed to create company:", error);
    },
  });
};

/**
 * Hook to UPDATE the company profile
 */
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCompanyPayload): Promise<CompanyResponse> =>
      updateMyCompanyProfile(payload),

    // Optimistic update for instant UI feedback
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: companyKeys.profile() });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<CompanyResponse>(
        companyKeys.profile()
      );

      // Optimistically update cache
      if (previousData?.company) {
        queryClient.setQueryData<CompanyResponse>(companyKeys.profile(), {
          ...previousData,
          company: {
            ...previousData.company,
            ...newData,
            address: newData.address || previousData.company.address,
            authorizedSignatory:
              newData.authorizedSignatory || previousData.company.authorizedSignatory,
          },
        });
      }

      return { previousData };
    },

    // Rollback on error
    onError: (error: Error, _variables, context) => {
      console.error("Failed to update company:", error);
      if (context?.previousData) {
        queryClient.setQueryData(companyKeys.profile(), context.previousData);
      }
    },

    // Always refetch after mutation settles
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.all });
    },
  });
};
