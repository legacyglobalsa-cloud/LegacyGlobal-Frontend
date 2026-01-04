/**
 * ============================================================
 * QUERY HOOKS INDEX
 * ============================================================
 * 
 * Central export file for all React Query hooks.
 * Import from here for cleaner imports:
 * 
 * ```tsx
 * import { useProfile, useKYCStatus, useApproveKYCDocument } from "@/hooks/queries";
 * ```
 */

// Auth hooks
export { useProfile, useSocketToken } from "./useAuth";

// Company hooks
export { 
  useCompanyProfile, 
  useCreateCompany, 
  useUpdateCompany,
  companyKeys,
} from "./useCompany";

// Client KYC hooks
export { useKYCStatus, useUploadKYC, kycKeys } from "./useKYC";

// Admin KYC hooks
export {
  useAllKYCSubmissions,
  useClientKYC,
  useApproveKYCDocument,
  useRejectKYCDocument,
  useMarkKYCUnderReview,
  adminKycKeys,
} from "./useAdminKYC";
