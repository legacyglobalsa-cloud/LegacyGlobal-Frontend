/**
 * ============================================================
 * KYC UPLOAD PAGE - REACT QUERY VERSION
 * ============================================================
 * 
 * This is the REFACTORED version using React Query hooks.
 * Compare with the original KYCUpload.tsx to see the differences.
 * 
 * KEY CHANGES FROM ORIGINAL:
 * 
 * 1. REMOVED: useState for documents state
 *    REPLACED WITH: useKYCStatus() query hook
 *    WHY: React Query manages the state for us
 * 
 * 2. REMOVED: useEffect for fetching KYC data
 *    REPLACED WITH: useKYCStatus() automatically fetches on mount
 *    WHY: useQuery handles fetching, caching, refetching
 * 
 * 3. REMOVED: Manual uploadKYCDocuments call
 *    REPLACED WITH: useUploadKYC() mutation hook
 *    WHY: Mutations handle loading states and cache invalidation
 * 
 * 4. REMOVED: Manual socket setup in useEffect
 *    REPLACED WITH: useSocketWithQuery("client")
 *    WHY: Centralized socket + query invalidation logic
 * 
 * 5. REMOVED: Multiple loading states (loading, uploadingDocs)
 *    REPLACED WITH: isLoading, isPending from hooks
 *    WHY: React Query provides these automatically
 */

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  FileUp,
  Loader2,
} from "lucide-react";
import { type KYCUploadData } from "@/services/kycServices";

// ✅ NEW: Import React Query hooks
import { useKYCStatus, useUploadKYC } from "@/hooks/queries";
import { useSocketWithQuery } from "@/hooks/useSocketWithQuery";

// Document type definition
interface DocumentConfig {
  id: string;
  name: string;
  fieldName: keyof KYCUploadData;
  description: string;
}

// Static document configuration (doesn't change)
const DOCUMENT_CONFIGS: DocumentConfig[] = [
  {
    id: "1",
    name: "Commercial Registration / Trade License",
    fieldName: "crLicense",
    description: "Your company's official registration document",
  },
  {
    id: "2",
    name: "VAT Certificate",
    fieldName: "vatCertificate",
    description: "Value Added Tax registration certificate",
  },
  {
    id: "3",
    name: "Signatory ID",
    fieldName: "signatoryId",
    description: "Passport or national ID of authorized signatory",
  },
  {
    id: "4",
    name: "Bank Letter",
    fieldName: "bankLetter",
    description: "Bank confirmation letter or statement",
  },
  {
    id: "5",
    name: "Proof of Address",
    fieldName: "proofOfAddress",
    description: "Utility bill or official address proof",
  },
  {
    id: "6",
    name: "Source of Funds",
    fieldName: "sourceOfFunds",
    description: "Documentation showing source of business funds",
  },
];

export default function KYCUploadWithQuery() {
  const { toast } = useToast();

  /**
   * ============================================================
   * REACT QUERY: FETCHING KYC STATUS
   * ============================================================
   * 
   * useKYCStatus() replaces:
   * - useState for documents
   * - useEffect for fetching
   * - loading state management
   * 
   * What you get back:
   * - data: The KYC data from the server
   * - isLoading: True during initial fetch
   * - isFetching: True during any fetch (including background)
   * - isError: True if fetch failed
   * - error: The error object
   * - refetch: Function to manually refetch
   */
  const {
    data: kycResponse,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useKYCStatus();

  /**
   * ============================================================
   * REACT QUERY: UPLOAD MUTATION
   * ============================================================
   * 
   * useUploadKYC() replaces:
   * - Manual API call in handleFileSelectAndUpload
   * - uploadingDocs state management
   * 
   * What you get back:
   * - mutate: Function to trigger the upload
   * - isPending: True while upload is in progress
   * - isError: True if upload failed
   * - variables: The data passed to mutate (useful for tracking which doc)
   */
  const uploadMutation = useUploadKYC();

  /**
   * ============================================================
   * SOCKET.IO + REACT QUERY INTEGRATION
   * ============================================================
   * 
   * useSocketWithQuery("client") replaces:
   * - Manual socket initialization
   * - Manual event listeners setup
   * - Manual state updates on socket events
   * 
   * Now when server emits "kyc:document-approved":
   * 1. Socket receives the event
   * 2. Hook calls queryClient.invalidateQueries(["kyc"])
   * 3. React Query refetches the data
   * 4. UI updates automatically
   * 
   * No manual state management needed!
   */
  useSocketWithQuery("client");

  /**
   * ============================================================
   * DERIVED STATE WITH useMemo
   * ============================================================
   * 
   * Instead of storing documents in state, we DERIVE them from
   * the query data. This is a key React Query pattern.
   * 
   * Benefits:
   * - Single source of truth (server data)
   * - No sync issues between local state and server
   * - Automatic updates when data changes
   */
  const documents = useMemo(() => {
    return DOCUMENT_CONFIGS.map((config) => {
      const backendDoc = kycResponse?.kyc?.documents?.[config.fieldName];
      
      if (backendDoc && backendDoc.fileUrl) {
        // Extract filename from path
        const fullPath = backendDoc.fileUrl;
        const filenameWithTimestamp = fullPath.split(/[/\\]/).pop() || "document";
        const filename = filenameWithTimestamp.replace(/^\d+-/, "");

        return {
          ...config,
          status: backendDoc.status,
          fileUrl: backendDoc.fileUrl,
          fileName: filename,
          uploadedAt: kycResponse?.kyc?.updatedAt,
        };
      }

      return {
        ...config,
        status: "pending" as const,
        fileUrl: undefined,
        fileName: undefined,
        uploadedAt: undefined,
      };
    });
  }, [kycResponse]);

  // Calculate progress
  const approvedCount = documents.filter((d) => d.status === "approved").length;
  const progressPercentage = Math.round((approvedCount / documents.length) * 100);

  /**
   * ============================================================
   * FILE UPLOAD HANDLER WITH MUTATION
   * ============================================================
   * 
   * This uses the mutation instead of direct API call.
   * 
   * The mutation automatically:
   * - Tracks loading state (isPending)
   * - Invalidates cache on success (triggers refetch)
   * - Handles errors
   */
  const handleFileSelectAndUpload = (
    docId: string,
    fieldName: keyof KYCUploadData
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,image/jpeg,image/png";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Validation
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }

      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only PDF, JPEG, and PNG files are allowed",
          variant: "destructive",
        });
        return;
      }

      /**
       * ✅ Using mutation instead of direct API call
       * 
       * mutate() triggers the upload and:
       * - Sets isPending = true
       * - Calls the API
       * - On success: invalidates cache, refetches data
       * - On error: sets error state
       * 
       * The second argument contains per-call callbacks
       */
      uploadMutation.mutate(
        { [fieldName]: file },
        {
          onSuccess: () => {
            const docName = documents.find((d) => d.id === docId)?.name;
            toast({
              title: "Success!",
              description: `${docName} uploaded successfully`,
            });
            // Note: No need to manually update state!
            // The mutation invalidates the query, which refetches
            // and the useMemo automatically derives new documents
          },
          onError: (error: any) => {
            toast({
              title: "Upload failed",
              description: error.response?.data?.message || "Failed to upload document",
              variant: "destructive",
            });
          },
        }
      );
    };

    input.click();
  };

  const handleViewDocument = (fieldName: string) => {
    window.open(
      `http://localhost:5000/api/company/kyc/document/${fieldName}`,
      "_blank"
    );
  };

  // Helper functions for UI
  const getStatusIcon = (status: string, hasFile: boolean) => {
    if (!hasFile) return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "underReview":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <FileText className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string, hasFile: boolean) => {
    if (!hasFile) return null;
    
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "underReview":
        return <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      default:
        return null;
    }
  };

  /**
   * ============================================================
   * LOADING STATE
   * ============================================================
   * 
   * isLoading is true only on initial load (no cached data)
   * After first load, isFetching might be true for background refreshes
   * but we have cached data to show
   */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /**
   * ============================================================
   * ERROR STATE
   * ============================================================
   * 
   * React Query provides isError and error automatically
   */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">Failed to load KYC data</p>
        <p className="text-muted-foreground text-sm">{(error as Error)?.message}</p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KYC Documents</h1>
            <p className="text-muted-foreground">
              Upload your verification documents to complete the KYC process
            </p>
          </div>
          {/* Show refetch button with loading indicator */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
          <CardDescription>
            {approvedCount} of {documents.length} documents approved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {progressPercentage}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((doc) => {
          const hasFile = !!doc.fileUrl;
          // Check if THIS specific document is being uploaded
          const isUploading = uploadMutation.isPending && 
            uploadMutation.variables && 
            doc.fieldName in uploadMutation.variables;

          return (
            <Card key={doc.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(doc.status, hasFile)}
                    <div>
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {doc.description}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(doc.status, hasFile)}
                </div>
              </CardHeader>
              <CardContent>
                {hasFile ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{doc.fileName}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc.fieldName)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {(doc.status === "rejected" || doc.status === "pending") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileSelectAndUpload(doc.id, doc.fieldName)}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-2" />
                          )}
                          Re-upload
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleFileSelectAndUpload(doc.id, doc.fieldName)}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ============================================================
 * SUMMARY: BEFORE vs AFTER
 * ============================================================
 * 
 * BEFORE (Original):
 * - useState for documents array
 * - useEffect to fetch data on mount
 * - useEffect for socket listeners
 * - Manual state updates on socket events
 * - Manual loading state management
 * - Manual error handling
 * 
 * AFTER (React Query):
 * - useKYCStatus() handles fetching + caching
 * - useUploadKYC() handles uploads + cache invalidation
 * - useSocketWithQuery() handles real-time updates
 * - useMemo derives documents from query data
 * - Automatic loading/error states
 * 
 * BENEFITS:
 * 1. Less code (~100 lines saved)
 * 2. Automatic caching (data persists between navigation)
 * 3. Automatic background refetching
 * 4. Centralized error handling
 * 5. DevTools for debugging
 * 6. Consistent patterns across the app
 */
