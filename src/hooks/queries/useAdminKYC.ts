/**
 * ============================================================
 * ADMIN KYC QUERY & MUTATION HOOKS
 * ============================================================
 * 
 * These hooks handle KYC operations from the ADMIN's perspective:
 * - Fetching all KYC submissions from all clients
 * - Fetching a single client's KYC details
 * - Approving/Rejecting documents
 * - Marking documents as "under review"
 * 
 * QUERY KEY HIERARCHY:
 * - ["admin", "kyc", "all"]           → All KYC submissions
 * - ["admin", "kyc", companyId]       → Single client's KYC
 * 
 * When you invalidate ["admin", "kyc"], it invalidates ALL keys
 * that start with ["admin", "kyc"] - both "all" and individual ones.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllKYCSubmissions,
  getClientKYC,
  approveKYCDocument,
  rejectKYCDocument,
  markKYCDocumentUnderReview,
  type AdminKYCResponse,
} from "@/services/adminkycServices";

/* ============================================================
 * QUERY KEYS
 * ============================================================ */
export const adminKycKeys = {
  all: ["admin", "kyc"] as const,
  list: () => [...adminKycKeys.all, "all"] as const,
  detail: (companyId: string) => [...adminKycKeys.all, companyId] as const,
};

/**
 * Hook to fetch ALL KYC submissions (admin view)
 * 
 * This returns a list of all clients who have submitted KYC documents,
 * with their current approval status.
 * 
 * Usage:
 * ```tsx
 * const { data, isLoading } = useAllKYCSubmissions();
 * 
 * const submissions = data?.submissions || [];
 * 
 * return (
 *   <table>
 *     {submissions.map(s => (
 *       <tr key={s._id}>
 *         <td>{s.company.companyName}</td>
 *         <td>{s.overallStatus}</td>
 *       </tr>
 *     ))}
 *   </table>
 * );
 * ```
 */
export const useAllKYCSubmissions = () => {
  return useQuery({
    queryKey: ["admin", "kyc", "all"],
    queryFn: getAllKYCSubmissions,
    
    // Poll every 30 seconds for new submissions
    // (Socket.IO will also push real-time updates)
    refetchInterval: 30000,
  });
};

/**
 * Hook to fetch a SINGLE client's KYC details
 * 
 * @param companyId - The company/client ID to fetch KYC for
 * 
 * Usage:
 * ```tsx
 * const { data, isLoading } = useClientKYC("company123");
 * 
 * const kyc = data?.kyc;
 * const documents = kyc?.documents;
 * ```
 */
export const useClientKYC = (companyId: string) => {
  return useQuery({
    // companyId is part of the key - different IDs = different cache entries
    queryKey: ["admin", "kyc", companyId],
    
    queryFn: () => getClientKYC(companyId),
    
    // Only run if companyId is provided
    enabled: !!companyId,
  });
};

/**
 * Mutation hook to APPROVE a KYC document
 * 
 * After approval:
 * 1. Invalidates admin KYC queries (refreshes list and detail)
 * 2. Server emits Socket.IO event to notify the client
 * 
 * Usage:
 * ```tsx
 * const { mutate: approve, isPending } = useApproveKYCDocument();
 * 
 * const handleApprove = (docType: string) => {
 *   approve(
 *     { companyId: "company123", documentType: docType },
 *     {
 *       onSuccess: () => toast.success("Document approved!"),
 *       onError: (err) => toast.error(err.message),
 *     }
 *   );
 * };
 * 
 * <button onClick={() => handleApprove("crLicense")} disabled={isPending}>
 *   Approve
 * </button>
 * ```
 */
export const useApproveKYCDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, documentType }: { 
      companyId: string; 
      documentType: string;
    }): Promise<AdminKYCResponse> => 
      approveKYCDocument(companyId, documentType),

    onSuccess: (_data, variables) => {
      console.log(`Document ${variables.documentType} approved for ${variables.companyId}`);
      
      // Invalidate all admin KYC queries
      // This refreshes both the list view and detail view
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
    },

    onError: (error: Error) => {
      console.error("Failed to approve document:", error);
    },
  });
};

/**
 * Mutation hook to REJECT a KYC document
 * 
 * Requires a rejection reason to be provided.
 * 
 * Usage:
 * ```tsx
 * const { mutate: reject, isPending } = useRejectKYCDocument();
 * 
 * const handleReject = (docType: string, reason: string) => {
 *   reject({ 
 *     companyId: "company123", 
 *     documentType: docType,
 *     reason: reason 
 *   });
 * };
 * ```
 */
export const useRejectKYCDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, documentType, reason }: { 
      companyId: string; 
      documentType: string;
      reason: string;
    }): Promise<AdminKYCResponse> => 
      rejectKYCDocument(companyId, documentType, reason),

    onSuccess: (_data, variables) => {
      console.log(`Document ${variables.documentType} rejected for ${variables.companyId}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
    },

    onError: (error: Error) => {
      console.error("Failed to reject document:", error);
    },
  });
};

/**
 * Mutation hook to mark a document as "Under Review"
 * 
 * This is used when an admin starts reviewing a document.
 * Changes status from "pending" to "underReview".
 * 
 * Usage:
 * ```tsx
 * const { mutate: markUnderReview } = useMarkKYCUnderReview();
 * 
 * // When admin opens/views a document:
 * markUnderReview({ companyId: "company123", documentType: "crLicense" });
 * ```
 */
export const useMarkKYCUnderReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ companyId, documentType }: { 
      companyId: string; 
      documentType: string;
    }) => markKYCDocumentUnderReview(companyId, documentType),

    onSuccess: (_data, variables) => {
      console.log(`Document ${variables.documentType} marked as under review`);
      queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
    },
  });
};

/**
 * ============================================================
 * OPTIMISTIC UPDATES (Advanced Pattern)
 * ============================================================
 * 
 * For instant UI feedback, you can update the cache BEFORE the
 * API call completes:
 * 
 * ```tsx
 * export const useApproveKYCDocumentOptimistic = () => {
 *   const queryClient = useQueryClient();
 * 
 *   return useMutation({
 *     mutationFn: ({ companyId, documentType }) => 
 *       approveKYCDocument(companyId, documentType),
 * 
 *     // BEFORE the mutation runs
 *     onMutate: async ({ companyId, documentType }) => {
 *       // Cancel any in-flight queries
 *       await queryClient.cancelQueries({ queryKey: ["admin", "kyc", companyId] });
 * 
 *       // Snapshot the previous value (for rollback)
 *       const previousKYC = queryClient.getQueryData(["admin", "kyc", companyId]);
 * 
 *       // Optimistically update the cache
 *       queryClient.setQueryData(["admin", "kyc", companyId], (old: any) => ({
 *         ...old,
 *         kyc: {
 *           ...old.kyc,
 *           documents: {
 *             ...old.kyc.documents,
 *             [documentType]: {
 *               ...old.kyc.documents[documentType],
 *               status: "approved",
 *             },
 *           },
 *         },
 *       }));
 * 
 *       // Return context for rollback
 *       return { previousKYC };
 *     },
 * 
 *     // If error, rollback to previous state
 *     onError: (err, variables, context) => {
 *       if (context?.previousKYC) {
 *         queryClient.setQueryData(
 *           ["admin", "kyc", variables.companyId], 
 *           context.previousKYC
 *         );
 *       }
 *     },
 * 
 *     // Always refetch after mutation settles
 *     onSettled: () => {
 *       queryClient.invalidateQueries({ queryKey: ["admin", "kyc"] });
 *     },
 *   });
 * };
 * ```
 */
