/**
 * ============================================================
 * SOCKET.IO HOOK WITH REACT QUERY INTEGRATION
 * ============================================================
 * 
 * This hook:
 * 1. Initializes the socket connection (singleton - no duplicates)
 * 2. Listens for server events based on user role
 * 3. Invalidates React Query cache when relevant events arrive
 * 4. Shows toast notifications for real-time updates
 * 
 * This creates a real-time experience:
 * - Admin approves document → Server emits event → Client's cache invalidates → UI updates
 * 
 * WHY THIS PATTERN?
 * - Socket.IO handles real-time push from server
 * - React Query handles caching and data fetching
 * - Together: Real-time updates with proper caching
 */

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  initializeSocket,
  disconnectSocket,
  getSocket,
  listenToKYCUpdates,
  listenToAdminKYCUpdates,
  listenToCompanyUpdates,
  removeKYCListeners,
  removeAdminKYCListeners,
  removeCompanyListeners,
} from "@/lib/socket";

// Query keys for invalidation
const kycKeys = { all: ["kyc"] };
const adminKycKeys = { all: ["admin", "kyc"] };
const companyKeys = { all: ["company"] };

// Socket event data types
interface KYCDocumentEventData {
  message?: string;
  documentType?: string;
  reason?: string;
  companyId?: string;
  documents?: string[];
}

interface CompanyEventData {
  message?: string;
  companyId?: string;
  companyName?: string;
}

/**
 * Custom hook that connects Socket.IO with React Query
 * 
 * @param userRole - 'client' | 'admin' | 'triparty'
 * @param showToasts - Whether to show toast notifications (default: true)
 * 
 * This hook will:
 * 1. Initialize the socket connection (singleton)
 * 2. Set up event listeners based on user role
 * 3. Invalidate React Query cache when events arrive
 * 4. Show toast notifications for real-time updates
 * 
 * Usage:
 * ```tsx
 * function ClientDashboard() {
 *   // This sets up socket + query invalidation + toasts
 *   useSocketWithQuery("client");
 * 
 *   // This query will auto-refetch when socket events arrive
 *   const { data } = useKYCStatus();
 * 
 *   return <div>...</div>;
 * }
 * ```
 */
export const useSocketWithQuery = (
  userRole: "client" | "admin" | "triparty",
  showToasts: boolean = true
) => {
  // Access the React Query client
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Track if socket is initialized to prevent double-init
  const socketInitialized = useRef(false);

  /**
   * Handler for when a KYC document is approved
   * Invalidates both client and admin KYC queries
   */
  const handleDocumentApproved = useCallback((data: KYCDocumentEventData) => {
    console.log("📨 [SOCKET] Document approved event received:", data);
    
    // Invalidate client-side KYC query
    queryClient.invalidateQueries({ queryKey: kycKeys.all });
    
    // Also invalidate admin queries if admin is viewing
    queryClient.invalidateQueries({ queryKey: adminKycKeys.all });

    // Show toast notification
    if (showToasts) {
      toast({
        title: "Document Approved! 🎉",
        description: data.message || `Your ${data.documentType || "document"} has been approved`,
      });
    }
  }, [queryClient, toast, showToasts]);

  /**
   * Handler for when a KYC document is rejected
   */
  const handleDocumentRejected = useCallback((data: KYCDocumentEventData) => {
    console.log("📨 [SOCKET] Document rejected event received:", data);
    
    queryClient.invalidateQueries({ queryKey: kycKeys.all });
    queryClient.invalidateQueries({ queryKey: adminKycKeys.all });

    // Show toast notification
    if (showToasts) {
      toast({
        title: "Document Rejected",
        description: data.message || data.reason || `Your ${data.documentType || "document"} has been rejected`,
        variant: "destructive",
      });
    }
  }, [queryClient, toast, showToasts]);

  /**
   * Handler for when a client uploads a document (admin receives this)
   */
  const handleDocumentUploaded = useCallback((data: KYCDocumentEventData) => {
    console.log("📨 [SOCKET] Document uploaded event received:", data);
    
    // Invalidate admin's KYC list to show new submission
    queryClient.invalidateQueries({ queryKey: adminKycKeys.all });

    // Show toast notification
    if (showToasts) {
      toast({
        title: "New Document Uploaded 📄",
        description: data.message || "A client has uploaded new KYC documents",
      });
    }
  }, [queryClient, toast, showToasts]);

  /**
   * Handler for company profile updates
   */
  const handleCompanyUpdated = useCallback((data: CompanyEventData) => {
    console.log("📨 [SOCKET] Company profile updated event received:", data);
    
    // Invalidate company profile query
    queryClient.invalidateQueries({ queryKey: companyKeys.all });

    // Show toast notification
    if (showToasts) {
      toast({
        title: "Profile Updated",
        description: data.message || "Your company profile has been updated",
      });
    }
  }, [queryClient, toast, showToasts]);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (socketInitialized.current) return;

    const initSocket = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.warn("⚠️ [SOCKET] No token found, skipping socket connection");
          return;
        }
        
        // Initialize socket connection
        const socket = initializeSocket(token);
        
        if (!socket) {
          console.error("Failed to initialize socket");
          return;
        }

        socketInitialized.current = true;

        // Set up listeners based on user role
        if (userRole === "client") {
          /**
           * CLIENT LISTENERS
           * Clients listen for approval/rejection of their documents
           * and company profile updates
           */
          listenToKYCUpdates(
            handleDocumentApproved,
            handleDocumentRejected
          );
          listenToCompanyUpdates(handleCompanyUpdated);
        } else if (userRole === "admin") {
          /**
           * ADMIN LISTENERS
           * Admins listen for:
           * - New document uploads from clients
           * - Other admin's approvals/rejections (for sync)
           */
          listenToAdminKYCUpdates(
            handleDocumentUploaded,
            handleDocumentApproved,
            handleDocumentRejected
          );
        }

        console.log(`✅ [SOCKET] Initialized for role: ${userRole}`);
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };

    initSocket();

    // Cleanup on unmount
    return () => {
      if (userRole === "client") {
        removeKYCListeners();
        removeCompanyListeners();
      } else if (userRole === "admin") {
        removeAdminKYCListeners();
      }
      disconnectSocket();
      socketInitialized.current = false;
    };
  }, [userRole, handleDocumentApproved, handleDocumentRejected, handleDocumentUploaded, handleCompanyUpdated]);

  // Return socket instance for direct access if needed
  return { socket: getSocket() };
};

/**
 * ============================================================
 * HOW IT ALL WORKS TOGETHER
 * ============================================================
 * 
 * SCENARIO: Admin approves a client's CR License document
 * 
 * 1. Admin clicks "Approve" button
 * 2. useApproveKYCDocument mutation sends PUT request
 * 3. Backend approves document in database
 * 4. Backend emits Socket.IO event: "kyc:document-approved"
 * 5. Client's socket receives the event
 * 6. handleDocumentApproved runs
 * 7. queryClient.invalidateQueries({ queryKey: ["kyc"] })
 * 8. React Query marks the cache as stale
 * 9. Since useKYCStatus query is active, it refetches
 * 10. UI updates to show "Approved" status
 * 
 * This all happens automatically in ~100-200ms!
 * 
 * ============================================================
 * QUERY KEY HIERARCHY EXPLAINED
 * ============================================================
 * 
 * Keys are arrays and work hierarchically:
 * 
 * invalidateQueries({ queryKey: ["kyc"] })
 *   └── Invalidates ALL queries starting with "kyc"
 *       ├── ["kyc", "status"]
 *       ├── ["kyc", "documents"]
 *       └── ["kyc", "history"]
 * 
 * invalidateQueries({ queryKey: ["admin", "kyc"] })
 *   └── Invalidates ALL admin KYC queries
 *       ├── ["admin", "kyc", "all"]
 *       ├── ["admin", "kyc", "company123"]
 *       └── ["admin", "kyc", "company456"]
 * 
 * This makes it easy to invalidate related data without
 * listing every individual query key.
 */
