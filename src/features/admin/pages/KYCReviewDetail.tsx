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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileCheck,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";

// React Query hooks for admin KYC operations
import {
  useClientKYC,
  useApproveKYCDocument,
  useRejectKYCDocument,
  useMarkKYCUnderReview,
} from "@/hooks/queries";
import { getDocumentViewUrl } from "@/services/adminkycServices";

// Socket.IO hook with React Query integration (handles toasts + cache invalidation)
import { useSocketWithQuery } from "@/hooks/useSocketWithQuery";

const kycStatusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
    color: string;
  }
> = {
  pending: {
    label: "Pending Review",
    variant: "secondary",
    icon: <Clock className="h-4 w-4" />,
    color: "text-amber-500",
  },
  underReview: {
    label: "Under Review",
    variant: "outline",
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-blue-500",
  },
  approved: {
    label: "Approved",
    variant: "default",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-500",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-500",
  },
};

const documentTypeLabels: Record<string, string> = {
  crLicense: "Commercial Registration / Trade License",
  vatCertificate: "VAT Certificate",
  signatoryId: "Authorized Signatory ID",
  bankLetter: "Bank Letter / Company Profile",
  proofOfAddress: "Proof of Address",
  sourceOfFunds: "Source of Funds Declaration",
};

interface DocumentInfo {
  fieldName: string;
  displayName: string;
}

const documentList: DocumentInfo[] = [
  {
    fieldName: "crLicense",
    displayName: "Commercial Registration / Trade License",
  },
  { fieldName: "vatCertificate", displayName: "VAT Certificate" },
  { fieldName: "signatoryId", displayName: "Authorized Signatory ID" },
  { fieldName: "bankLetter", displayName: "Bank Letter / Company Profile" },
  { fieldName: "proofOfAddress", displayName: "Proof of Address" },
  { fieldName: "sourceOfFunds", displayName: "Source of Funds Declaration" },
];

export default function KYCReviewDetail() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // UI state
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [reviewNote, setReviewNote] = useState("");

  // ============================================================
  // SOCKET.IO - REAL-TIME UPDATES
  // ============================================================
  // This hook:
  // - Listens for document status changes from other admins
  // - Invalidates React Query cache automatically
  // - Shows toast notifications (disabled here since we show our own)
  useSocketWithQuery("admin", false); // false = don't show toasts (we handle them ourselves)

  // ============================================================
  // REACT QUERY HOOKS
  // ============================================================
  
  // Fetch KYC data for this company
  const { data: response, isLoading: loading } = useClientKYC(companyId || "");
  const kycData = response?.kyc ?? null;

  // Mutations
  const { mutate: approveDocument, isPending: isApproving } = useApproveKYCDocument();
  const { mutate: rejectDocument, isPending: isRejecting } = useRejectKYCDocument();
  const { mutate: markUnderReview } = useMarkKYCUnderReview();

  // Track which document is being processed
  const processingDoc = isApproving || isRejecting ? selectedDocument : "";

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleApprove = (documentType: string) => {
    if (!companyId) return;

    approveDocument(
      { companyId, documentType },
      {
        onSuccess: () => {
          toast({
            title: "Document Approved",
            description: "The document has been approved successfully",
          });
          setReviewDialogOpen(false);
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to approve document",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    if (!companyId) return;

    rejectDocument(
      { companyId, documentType: selectedDocument, reason: reviewNote },
      {
        onSuccess: () => {
          toast({
            title: "Document Rejected",
            description: "The document has been rejected",
            variant: "destructive",
          });
          setReviewDialogOpen(false);
          setReviewNote("");
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to reject document",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleViewDocument = (documentType: string) => {
    if (!companyId || !kycData) return;

    const doc = kycData.documents[documentType as keyof typeof kycData.documents];

    // Mark as under review if pending (fire-and-forget)
    if (doc?.status === "pending") {
      markUnderReview({ companyId, documentType });
    }

    // Open document in new tab
    const url = getDocumentViewUrl(companyId, documentType);
    window.open(url, "_blank");
  };

  const openReviewDialog = (documentType: string) => {
    if (!companyId || !kycData) return;

    setSelectedDocument(documentType);
    setReviewNote("");
    setReviewDialogOpen(true);

    // Mark as under review if pending
    const doc = kycData.documents[documentType as keyof typeof kycData.documents];
    if (doc?.status === "pending") {
      markUnderReview({ companyId, documentType });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/admin/kyc")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to KYC Review
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No KYC data found for this client
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const stats = {
    total:
      documentList.filter(
        (doc) =>
          kycData.documents[doc.fieldName as keyof typeof kycData.documents]
            ?.fileUrl
      ).length || 0,
    pending:
      documentList.filter(
        (doc) =>
          kycData.documents[doc.fieldName as keyof typeof kycData.documents]
            ?.status === "pending"
      ).length || 0,
    underReview:
      documentList.filter(
        (doc) =>
          kycData.documents[doc.fieldName as keyof typeof kycData.documents]
            ?.status === "underReview"
      ).length || 0,
    approved:
      documentList.filter(
        (doc) =>
          kycData.documents[doc.fieldName as keyof typeof kycData.documents]
            ?.status === "approved"
      ).length || 0,
    rejected:
      documentList.filter(
        (doc) =>
          kycData.documents[doc.fieldName as keyof typeof kycData.documents]
            ?.status === "rejected"
      ).length || 0,
  };

  const selectedDoc = selectedDocument
    ? kycData.documents[selectedDocument as keyof typeof kycData.documents]
    : null;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/admin/kyc")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            KYC Review: {kycData.company.companyName}
          </h1>
          <p className="text-muted-foreground">
            Review all submitted documents for compliance verification
          </p>
        </div>
      </div>

      {/* Client Info Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{kycData.company.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CR Number</p>
                  <p className="font-medium">{kycData.company.crNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Business Category
                  </p>
                  <p className="font-medium">{kycData.company.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {kycData.company.address.city},{" "}
                    {kycData.company.address.country}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Authorized Signatory
                  </p>
                  <p className="font-medium">
                    {kycData.company.authorizedSignatory.fullName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {kycData.company.authorizedSignatory.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {kycData.company.authorizedSignatory.phone}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Passport Number
                  </p>
                  <p className="font-medium">
                    {kycData.company.authorizedSignatory.passportNumber}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Review Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Total Documents
              </span>
              <span className="font-bold">{stats.total}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm">Pending</span>
                </div>
                <Badge variant="secondary">{stats.pending}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Under Review</span>
                </div>
                <Badge variant="outline">{stats.underReview}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Approved</span>
                </div>
                <Badge variant="default">{stats.approved}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Rejected</span>
                </div>
                <Badge variant="destructive">{stats.rejected}</Badge>
              </div>
            </div>
            {stats.pending === 0 &&
              stats.underReview === 0 &&
              stats.rejected === 0 &&
              stats.total > 0 && (
                <div className="pt-2">
                  <Badge className="w-full justify-center py-2 bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    All Documents Verified
                  </Badge>
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Submitted Documents
          </CardTitle>
          <CardDescription>
            Review each document and approve or reject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentList.map((docInfo) => {
              const doc =
                kycData.documents[
                  docInfo.fieldName as keyof typeof kycData.documents
                ];
              const isProcessing = processingDoc === docInfo.fieldName;

              if (!doc?.fileUrl) {
                return (
                  <div
                    key={docInfo.fieldName}
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">
                          {docInfo.displayName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Not uploaded
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Not Uploaded</Badge>
                  </div>
                );
              }

              return (
                <div
                  key={docInfo.fieldName}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors ${
                    doc.status === "approved"
                      ? "border-green-200 bg-green-50/50"
                      : doc.status === "rejected"
                      ? "border-red-200 bg-red-50/50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        doc.status === "approved"
                          ? "bg-green-100"
                          : doc.status === "rejected"
                          ? "bg-red-100"
                          : doc.status === "underReview"
                          ? "bg-blue-100"
                          : "bg-amber-100"
                      }`}
                    >
                      <FileText
                        className={`h-6 w-6 ${
                          doc.status === "approved"
                            ? "text-green-600"
                            : doc.status === "rejected"
                            ? "text-red-600"
                            : doc.status === "underReview"
                            ? "text-blue-600"
                            : "text-amber-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium">{docInfo.displayName}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>
                          Updated:{" "}
                          {new Date(kycData.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {doc.rejectionReason && (
                        <div className="mt-2 p-2 rounded bg-red-50 border border-red-200">
                          <p className="text-sm font-medium text-red-800">
                            Rejection Reason:
                          </p>
                          <p className="text-sm text-red-700">
                            {doc.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        kycStatusConfig[doc.status]?.variant || "secondary"
                      }
                      className="flex items-center gap-1"
                    >
                      {kycStatusConfig[doc.status]?.icon}
                      {kycStatusConfig[doc.status]?.label || doc.status}
                    </Badge>

                    <div className="flex items-center gap-1">
                      {doc.status !== "approved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openReviewDialog(docInfo.fieldName)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <FileCheck className="mr-2 h-4 w-4" />
                              Review
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Document Review</DialogTitle>
            <DialogDescription>
              {selectedDocument && documentTypeLabels[selectedDocument]} -{" "}
              {kycData.company.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Document Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Document Type</p>
                <p className="font-medium">
                  {selectedDocument && documentTypeLabels[selectedDocument]}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(kycData.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Document Preview */}
            <div className="border rounded-lg p-8 bg-muted/30 min-h-[300px] flex flex-col items-center justify-center">
              <FileText className="h-20 w-20 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Document Preview</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    selectedDocument && handleViewDocument(selectedDocument)
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in New Tab
                </Button>
              </div>
            </div>

            {/* Current Status */}
            {selectedDoc && (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Current Status:
                  </span>
                  <Badge
                    variant={
                      kycStatusConfig[selectedDoc.status]?.variant ||
                      "secondary"
                    }
                  >
                    {kycStatusConfig[selectedDoc.status]?.icon}
                    <span className="ml-1">
                      {kycStatusConfig[selectedDoc.status]?.label}
                    </span>
                  </Badge>
                </div>
              </div>
            )}

            {/* Rejection Reason Input */}
            {selectedDoc?.status !== "approved" && (
              <div className="space-y-3 border-t pt-4">
                <Label htmlFor="reviewNote">
                  Review Notes / Rejection Reason
                </Label>
                <Textarea
                  id="reviewNote"
                  placeholder="Enter your review notes or reason for rejection..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          {selectedDoc?.status !== "approved" && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={processingDoc === selectedDocument}
              >
                {processingDoc === selectedDocument ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown className="mr-2 h-4 w-4" />
                )}
                Reject
              </Button>
              <Button
                onClick={() =>
                  selectedDocument && handleApprove(selectedDocument)
                }
                disabled={processingDoc === selectedDocument}
                className="bg-green-600 hover:bg-green-700"
              >
                {processingDoc === selectedDocument ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp className="mr-2 h-4 w-4" />
                )}
                Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
