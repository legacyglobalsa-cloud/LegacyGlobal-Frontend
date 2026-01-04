/**
 * ============================================================
 * ADMIN KYC REVIEW DETAIL - REACT QUERY EXAMPLE
 * ============================================================
 * 
 * This demonstrates how to use React Query for admin operations:
 * - Fetching a single client's KYC data
 * - Approving documents (mutation)
 * - Rejecting documents (mutation)
 * - Marking as under review (mutation)
 * 
 * COMPARE WITH: KYCReviewDetail.tsx (original)
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { getDocumentViewUrl } from "@/services/adminkycServices";

// ✅ Import React Query hooks
import {
  useClientKYC,
  useApproveKYCDocument,
  useRejectKYCDocument,
  useMarkKYCUnderReview,
} from "@/hooks/queries";
import { useSocketWithQuery } from "@/hooks/useSocketWithQuery";

// Configuration
const documentList = [
  { fieldName: "crLicense", displayName: "Commercial Registration / Trade License" },
  { fieldName: "vatCertificate", displayName: "VAT Certificate" },
  { fieldName: "signatoryId", displayName: "Authorized Signatory ID" },
  { fieldName: "bankLetter", displayName: "Bank Letter / Company Profile" },
  { fieldName: "proofOfAddress", displayName: "Proof of Address" },
  { fieldName: "sourceOfFunds", displayName: "Source of Funds Declaration" },
];

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  underReview: { label: "Under Review", variant: "outline" as const, icon: AlertCircle },
  approved: { label: "Approved", variant: "default" as const, icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
};

export default function KYCReviewDetailWithQuery() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Local UI state (not data state!)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [reviewNote, setReviewNote] = useState("");

  /**
   * ============================================================
   * QUERY: FETCH CLIENT KYC
   * ============================================================
   * 
   * useClientKYC(companyId) fetches this specific client's KYC.
   * 
   * The query key is ["admin", "kyc", companyId]
   * This means:
   * - Different companyId = different cache entry
   * - invalidateQueries(["admin", "kyc"]) refreshes ALL admin KYC queries
   * - invalidateQueries(["admin", "kyc", companyId]) refreshes just this one
   */
  const {
    data: kycResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useClientKYC(companyId || "");

  // Extract KYC data from response
  const kycData = kycResponse?.kyc;

  /**
   * ============================================================
   * MUTATIONS: APPROVE / REJECT / MARK UNDER REVIEW
   * ============================================================
   * 
   * Each mutation:
   * - Sends request to backend
   * - On success, invalidates ["admin", "kyc"] queries
   * - This triggers automatic refetch
   * 
   * We don't need to manually call fetchKYCData() anymore!
   */
  const approveMutation = useApproveKYCDocument();
  const rejectMutation = useRejectKYCDocument();
  const markUnderReviewMutation = useMarkKYCUnderReview();

  /**
   * ============================================================
   * SOCKET INTEGRATION
   * ============================================================
   * 
   * Listens for real-time updates:
   * - Other admins' actions
   * - Client document uploads
   */
  useSocketWithQuery("admin");

  /**
   * ============================================================
   * APPROVE DOCUMENT HANDLER
   * ============================================================
   * 
   * Uses mutation with onSuccess/onError callbacks.
   * No need to:
   * - Set loading state manually
   * - Call refetch manually
   * - Update local state
   * 
   * The mutation does it all!
   */
  const handleApprove = (documentType: string) => {
    approveMutation.mutate(
      { companyId: companyId!, documentType },
      {
        onSuccess: () => {
          toast({
            title: "Document Approved ✅",
            description: `${documentType} has been approved`,
          });
          setReviewDialogOpen(false);
        },
        onError: (error: any) => {
          toast({
            title: "Approval Failed",
            description: error.response?.data?.message || "Failed to approve",
            variant: "destructive",
          });
        },
      }
    );
  };

  /**
   * ============================================================
   * REJECT DOCUMENT HANDLER
   * ============================================================
   */
  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    rejectMutation.mutate(
      { companyId: companyId!, documentType: selectedDocument, reason: reviewNote },
      {
        onSuccess: () => {
          toast({
            title: "Document Rejected",
            description: `${selectedDocument} has been rejected`,
          });
          setReviewDialogOpen(false);
          setReviewNote("");
        },
        onError: (error: any) => {
          toast({
            title: "Rejection Failed",
            description: error.response?.data?.message || "Failed to reject",
            variant: "destructive",
          });
        },
      }
    );
  };

  /**
   * ============================================================
   * VIEW DOCUMENT HANDLER
   * ============================================================
   * 
   * When admin views a document:
   * 1. Mark it as "under review" (if pending)
   * 2. Open document in new tab
   * 
   * The mutation fires and updates the cache automatically.
   */
  const handleViewDocument = (documentType: string) => {
    const doc = kycData?.documents[documentType];

    // Mark under review if pending
    if (doc?.status === "pending") {
      markUnderReviewMutation.mutate(
        { companyId: companyId!, documentType },
        {
          // No toast needed for this silent operation
          onError: (err) => console.error("Failed to mark under review:", err),
        }
      );
    }

    // Open document
    const url = getDocumentViewUrl(companyId!, documentType);
    window.open(url, "_blank");
  };

  const openReviewDialog = (documentType: string) => {
    setSelectedDocument(documentType);
    setReviewNote("");
    setReviewDialogOpen(true);
  };

  // ============================================================
  // LOADING STATE
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-red-500">Failed to load KYC data</p>
        <p className="text-muted-foreground text-sm">{(error as Error)?.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="text-center py-8">
        <p>No KYC data found for this client</p>
        <Button variant="outline" onClick={() => navigate("/admin/kyc")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/kyc")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{kycData.company.companyName}</h1>
          <p className="text-muted-foreground">KYC Review</p>
        </div>
      </div>

      {/* Company Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">CR Number</p>
            <p className="font-medium">{kycData.company.crNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">VAT Number</p>
            <p className="font-medium">{kycData.company.vatNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">{kycData.company.category}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">
              {kycData.company.address.city}, {kycData.company.address.country}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {documentList.map(({ fieldName, displayName }) => {
          const doc = kycData.documents[fieldName];
          const status = doc?.status || "pending";
          const config = statusConfig[status] || statusConfig.pending;
          const StatusIcon = config.icon;

          /**
           * Check if THIS specific document has a mutation in progress.
           * 
           * isPending is true while any mutation is running.
           * We check the variables to see which document is being processed.
           */
          const isApproving =
            approveMutation.isPending &&
            approveMutation.variables?.documentType === fieldName;
          const isRejecting =
            rejectMutation.isPending &&
            rejectMutation.variables?.documentType === fieldName;
          const isProcessing = isApproving || isRejecting;

          return (
            <Card key={fieldName}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <CardTitle className="text-base">{displayName}</CardTitle>
                  </div>
                  {doc && (
                    <Badge variant={config.variant}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {doc?.fileUrl ? (
                  <div className="space-y-3">
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(fieldName)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>

                      {/* Show approve/reject only for pending or underReview */}
                      {(status === "pending" || status === "underReview") && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApprove(fieldName)}
                            disabled={isProcessing}
                          >
                            {isApproving ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <ThumbsUp className="h-4 w-4 mr-2" />
                            )}
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openReviewDialog(fieldName)}
                            disabled={isProcessing}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Document not uploaded yet
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rejection Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection. This will be sent to the client.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ThumbsDown className="h-4 w-4 mr-2" />
              )}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * ============================================================
 * KEY TAKEAWAYS
 * ============================================================
 * 
 * 1. QUERY HOOKS replace useEffect for data fetching
 *    - Automatic caching
 *    - Automatic loading/error states
 *    - Background refetching
 * 
 * 2. MUTATION HOOKS replace manual API calls
 *    - isPending for loading state
 *    - Automatic cache invalidation via onSuccess
 *    - Error handling built-in
 * 
 * 3. LOCAL STATE is only for UI concerns
 *    - Dialog open/close
 *    - Form input values
 *    - NOT for server data
 * 
 * 4. SOCKET + QUERY integration
 *    - Socket events trigger cache invalidation
 *    - UI updates automatically
 *    - No manual state sync needed
 * 
 * 5. MUTATION VARIABLES help track which item is loading
 *    - Check mutation.variables to see what's being processed
 *    - Show loading spinner only for that specific item
 */
