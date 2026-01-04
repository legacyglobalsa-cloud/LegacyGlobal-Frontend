import { useState, useMemo } from "react";
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

// React Query hooks
import { useKYCStatus, useUploadKYC } from "@/hooks/queries";
import type { KYCUploadData } from "@/services/kycServices";

// Socket.IO hook with React Query integration (handles toasts + cache invalidation)
import { useSocketWithQuery } from "@/hooks/useSocketWithQuery";

// Document definitions with their field names
const DOCUMENT_DEFINITIONS = [
  { id: "1", name: "Commercial Registration / Trade License", fieldName: "crLicense" as const },
  { id: "2", name: "VAT Certificate", fieldName: "vatCertificate" as const },
  { id: "3", name: "Signatory ID", fieldName: "signatoryId" as const },
  { id: "4", name: "Bank Letter", fieldName: "bankLetter" as const },
  { id: "5", name: "Proof of Address", fieldName: "proofOfAddress" as const },
  { id: "6", name: "Source of Funds", fieldName: "sourceOfFunds" as const },
];

type DocumentFieldName = typeof DOCUMENT_DEFINITIONS[number]["fieldName"];

interface ProcessedDocument {
  id: string;
  name: string;
  fieldName: DocumentFieldName;
  status: "pending" | "uploaded" | "approved" | "rejected" | "underReview";
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  rejectionReason?: string;
  fileUrl?: string;
}

export default function KYCUpload() {
  const { toast } = useToast();
  
  // Track which documents are currently uploading
  const [uploadingDocs, setUploadingDocs] = useState<Set<string>>(new Set());

  // ============================================================
  // SOCKET.IO - REAL-TIME UPDATES WITH TOASTS
  // ============================================================
  // This hook:
  // - Initializes socket connection (singleton - no duplicates)
  // - Listens for kyc:document-approved and kyc:document-rejected
  // - Invalidates React Query cache automatically
  // - Shows toast notifications
  useSocketWithQuery("client");

  // ============================================================
  // REACT QUERY HOOKS
  // ============================================================
  
  // Fetch KYC status (cached, auto-refetches)
  const { data: kycResponse, isLoading: loading, error } = useKYCStatus();
  
  // Upload mutation
  const { mutate: uploadKYC } = useUploadKYC();

  // Show fetch errors
  if (error) {
    console.error("Failed to fetch KYC data:", error);
  }

  // ============================================================
  // PROCESS KYC DATA INTO DOCUMENT LIST
  // ============================================================
  
  // Transform backend KYC data into displayable document list
  const documents = useMemo<ProcessedDocument[]>(() => {
    const kycData = kycResponse?.kyc;
    
    return DOCUMENT_DEFINITIONS.map((def) => {
      const backendDoc = kycData?.documents?.[def.fieldName];
      
      if (backendDoc && backendDoc.fileUrl) {
        // Document has been uploaded
        const fullPath = backendDoc.fileUrl;
        const filenameWithTimestamp = fullPath.split(/[/\\]/).pop() || "document";
        const filename = filenameWithTimestamp.replace(/^\d+-/, "");

        return {
          id: def.id,
          name: def.name,
          fieldName: def.fieldName,
          status: backendDoc.status,
          fileUrl: backendDoc.fileUrl,
          fileName: filename,
          uploadedAt: kycData?.updatedAt,
        };
      }
      
      // Document not uploaded yet
      return {
        id: def.id,
        name: def.name,
        fieldName: def.fieldName,
        status: "pending" as const,
      };
    });
  }, [kycResponse]);

  const getStatusIcon = (status: string, hasFile: boolean) => {
    if (!hasFile) {
      return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }

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
        return (
          <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Review
          </Badge>
        );
      default:
        return null;
    }
  };

  const approvedCount = documents.filter((d) => d.status === "approved").length;
  const totalRequired = documents.length;
  const progressPercentage = Math.round((approvedCount / totalRequired) * 100);

  const handleFileSelectAndUpload = (
    docId: string,
    fieldName: DocumentFieldName
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,image/jpeg,image/png";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

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

      // Mark document as uploading
      setUploadingDocs((prev) => new Set(prev).add(docId));

      // Upload using React Query mutation
      const uploadData: KYCUploadData = { [fieldName]: file };
      
      uploadKYC(uploadData, {
        onSuccess: () => {
          const docName = documents.find((d) => d.id === docId)?.name;
          toast({
            title: "Success!",
            description: `${docName} uploaded successfully`,
          });
          // Cache is automatically invalidated by the mutation hook
        },
        onError: (error: any) => {
          toast({
            title: "Upload failed",
            description: error.response?.data?.message || "Failed to upload document",
            variant: "destructive",
          });
        },
        onSettled: () => {
          // Remove from uploading set
          setUploadingDocs((prev) => {
            const newSet = new Set(prev);
            newSet.delete(docId);
            return newSet;
          });
        },
      });
    };

    input.click();
  };

  const handleViewDocument = (fieldName: string) => {
    window.open(
      `http://localhost:5000/api/company/kyc/document/${fieldName}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">KYC Documents</h1>
        <p className="text-muted-foreground">
          Upload and manage your Know Your Customer (KYC) documents
        </p>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Progress</CardTitle>
          <CardDescription>
            {approvedCount} of {totalRequired} documents verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progressPercentage} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall completion</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "underReview").length}
              </p>
              <p className="text-sm text-muted-foreground">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.filter((d) => d.status === "rejected").length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {
                  documents.filter((d) => d.status === "pending" && d.fileUrl)
                    .length
                }
              </p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Upload all required documents for KYC verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.map((doc) => {
            const isUploading = uploadingDocs.has(doc.id);

            return (
              <div
                key={doc.id}
                className={`flex items-center justify-between rounded-lg border p-4 ${
                  doc.status === "rejected"
                    ? "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
                    : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  ) : (
                    getStatusIcon(doc.status, !!doc.fileUrl)
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{doc.name}</p>
                      {getStatusBadge(doc.status, !!doc.fileUrl)}
                    </div>
                    {doc.fileName ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>{doc.fileName}</span>
                        {doc.fileSize && (
                          <>
                            <span>•</span>
                            <span>{doc.fileSize}</span>
                          </>
                        )}
                        {doc.uploadedAt && (
                          <>
                            <span>•</span>
                            <span>
                              Uploaded{" "}
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </span>
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No file uploaded yet
                      </p>
                    )}
                    {doc.rejectionReason && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        Reason: {doc.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(doc.status === "approved" ||
                    doc.status === "underReview" ||
                    (doc.status === "pending" && doc.fileUrl)) &&
                    doc.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocument(doc.fieldName)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Button>
                    )}

                  {(doc.status === "rejected" ||
                    (doc.status === "pending" && !doc.fileUrl)) && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleFileSelectAndUpload(doc.id, doc.fieldName)
                      }
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          {doc.status === "rejected" ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" /> Re-upload
                            </>
                          ) : (
                            <>
                              <FileUp className="mr-2 h-4 w-4" /> Upload
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Accepted formats: PDF, JPG, PNG (max 5MB per file)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Documents must be clearly legible and not expired
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              All documents will be reviewed within 2-3 business days
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              You will be notified in real-time once documents are reviewed
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
