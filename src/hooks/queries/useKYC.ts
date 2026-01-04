/**
 * ============================================================
 * CLIENT KYC QUERY & MUTATION HOOKS
 * ============================================================
 * 
 * These hooks handle KYC operations from the CLIENT's perspective:
 * - Fetching their own KYC status
 * - Uploading KYC documents
 * 
 * The Admin KYC hooks are in a separate file (useAdminKYC.ts)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getKYCStatus,
  uploadKYCDocuments,
  type KYCUploadData,
  type KYCResponse,
} from "@/services/kycServices";

/* ============================================================
 * QUERY KEYS
 * ============================================================ */
export const kycKeys = {
  all: ["kyc"] as const,
  status: () => [...kycKeys.all, "status"] as const,
};

/**
 * Hook to fetch the current client's KYC status
 * 
 * This fetches:
 * - Document upload status (which docs are uploaded)
 * - Approval status per document (pending, approved, rejected)
 * - Overall KYC status
 * 
 * Usage:
 * ```tsx
 * const { data, isLoading, refetch } = useKYCStatus();
 * 
 * // Access KYC data
 * const kycData = data?.kyc;
 * const overallStatus = kycData?.overallStatus;
 * const crLicenseStatus = kycData?.documents?.crLicense?.status;
 * ```
 */
export const useKYCStatus = () => {
  return useQuery({
    queryKey: kycKeys.status(),
    queryFn: getKYCStatus,
    
    // Refetch every 30 seconds to catch admin approvals/rejections
    // (Socket.IO will also trigger invalidation for real-time updates)
    refetchInterval: 30000,
  });
};

/**
 * Mutation hook to upload KYC documents
 * 
 * This handles multipart/form-data file uploads.
 * 
 * KEY POINTS:
 * - Files are passed as a KYCUploadData object
 * - On success, we invalidate the KYC status query
 * - This triggers a refetch so the UI updates immediately
 * 
 * Usage:
 * ```tsx
 * const { mutate: uploadKYC, isPending } = useUploadKYC();
 * 
 * const handleUpload = (files: { crLicense?: File, vatCertificate?: File }) => {
 *   uploadKYC(files, {
 *     onSuccess: (data) => {
 *       toast.success("Documents uploaded successfully!");
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   });
 * };
 * 
 * // In JSX:
 * <input
 *   type="file"
 *   onChange={(e) => handleUpload({ crLicense: e.target.files[0] })}
 *   disabled={isPending}
 * />
 * ```
 */
export const useUploadKYC = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documents: KYCUploadData): Promise<KYCResponse> => 
      uploadKYCDocuments(documents),

    /**
     * onSuccess callback
     * 
     * After successful upload:
     * 1. Invalidate KYC status → triggers refetch
     * 2. UI automatically updates with new document status
     */
    onSuccess: (data) => {
      console.log("KYC upload successful:", data);
      
      // Invalidate all KYC-related queries
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },

    onError: (error: Error) => {
      console.error("KYC upload failed:", error);
    },
  });
};

/**
 * ============================================================
 * INTEGRATION WITH SOCKET.IO
 * ============================================================
 * 
 * When the admin approves/rejects a document, the server emits
 * a Socket.IO event. You can use this to invalidate queries
 * for real-time updates:
 * 
 * ```tsx
 * // In your KYCUpload component or a socket hook:
 * const queryClient = useQueryClient();
 * 
 * useEffect(() => {
 *   socket.on("kyc:document-approved", () => {
 *     // This triggers a refetch of KYC status
 *     queryClient.invalidateQueries({ queryKey: ["kyc"] });
 *   });
 * 
 *   socket.on("kyc:document-rejected", () => {
 *     queryClient.invalidateQueries({ queryKey: ["kyc"] });
 *   });
 * 
 *   return () => {
 *     socket.off("kyc:document-approved");
 *     socket.off("kyc:document-rejected");
 *   };
 * }, [queryClient]);
 * ```
 */
