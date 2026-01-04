import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Eye,
  Building2,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

// React Query hooks
import { useAllKYCSubmissions } from "@/hooks/queries";
import type { AdminKYCData } from "@/services/adminkycServices";

// Socket.IO hook with React Query integration (handles toasts + cache invalidation)
import { useSocketWithQuery } from "@/hooks/useSocketWithQuery";

interface ClientKYCSummary {
  companyId: string;
  companyName: string;
  clientFullName: string;
  totalDocuments: number;
  pendingDocuments: number;
  underReviewDocuments: number;
  approvedDocuments: number;
  rejectedDocuments: number;
  lastSubmission: string;
  overallStatus:
    | "pending"
    | "underReview"
    | "approved"
    | "rejected"
    | "partial";
}

const documentFields = [
  "crLicense",
  "vatCertificate",
  "signatoryId",
  "bankLetter",
  "proofOfAddress",
  "sourceOfFunds",
];

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  pending: {
    label: "Pending Review",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  underReview: {
    label: "Under Review",
    variant: "outline",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  approved: {
    label: "Approved",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
  partial: {
    label: "Partially Approved",
    variant: "outline",
    icon: <AlertCircle className="h-3 w-3" />,
  },
};

export default function AdminKYCReview() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ============================================================
  // SOCKET.IO - REAL-TIME UPDATES WITH TOASTS
  // ============================================================
  // This hook:
  // - Initializes socket connection (singleton - no duplicates)
  // - Listens for kyc:document-uploaded, approved, rejected
  // - Invalidates React Query cache automatically
  // - Shows toast notifications
  useSocketWithQuery("admin");

  // ============================================================
  // REACT QUERY - FETCH ALL KYC SUBMISSIONS
  // ============================================================
  
  const { data: response, isLoading: loading, error } = useAllKYCSubmissions();
  
  // Extract submissions from response (memoized to prevent useMemo dependency issues)
  const submissions = useMemo<AdminKYCData[]>(() => {
    return response?.submissions || [];
  }, [response]);

  // Show fetch errors
  if (error) {
    console.error("Failed to fetch KYC submissions:", error);
  }

  // Group submissions by client
  const clientSummaries = useMemo<ClientKYCSummary[]>(() => {
    return submissions.map((submission) => {
      let totalDocuments = 0;
      let pendingDocuments = 0;
      let underReviewDocuments = 0;
      let approvedDocuments = 0;
      let rejectedDocuments = 0;

      documentFields.forEach((field) => {
        const doc =
          submission.documents[field as keyof typeof submission.documents];
        if (doc && doc.fileUrl) {
          totalDocuments++;
          if (doc.status === "pending") pendingDocuments++;
          else if (doc.status === "underReview") underReviewDocuments++;
          else if (doc.status === "approved") approvedDocuments++;
          else if (doc.status === "rejected") rejectedDocuments++;
        }
      });

      let overallStatus: ClientKYCSummary["overallStatus"] = "pending";
      if (totalDocuments === 0) {
        overallStatus = "pending";
      } else if (approvedDocuments === totalDocuments) {
        overallStatus = "approved";
      } else if (rejectedDocuments === totalDocuments) {
        overallStatus = "rejected";
      } else if (pendingDocuments === totalDocuments) {
        overallStatus = "pending";
      } else if (underReviewDocuments > 0 || pendingDocuments > 0) {
        overallStatus = "underReview";
      } else {
        overallStatus = "partial";
      }

      return {
        companyId: submission.company._id,
        companyName: submission.company.companyName || "Unknown Company",
        clientFullName: submission.company.user?.fullname || "Unknown Client",
        totalDocuments,
        pendingDocuments,
        underReviewDocuments,
        approvedDocuments,
        rejectedDocuments,
        lastSubmission: submission.updatedAt,
        overallStatus,
      };
    });
  }, [submissions]);

  // Calculate stats
  const stats = {
    totalClients: clientSummaries.length,
    pendingReview: clientSummaries.filter(
      (s) => s.pendingDocuments > 0 || s.underReviewDocuments > 0
    ).length,
    approved: clientSummaries.filter((s) => s.overallStatus === "approved")
      .length,
    requiresAttention: clientSummaries.filter(
      (s) => s.rejectedDocuments > 0 || s.pendingDocuments > 0
    ).length,
  };

  const handleViewClient = (companyId: string) => {
    navigate(`/admin/kyc/${companyId}`);
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
        <h1 className="text-3xl font-bold tracking-tight">KYC Review</h1>
        <p className="text-muted-foreground">
          Review and verify client KYC documents for compliance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              with KYC submissions
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pendingReview}
            </div>
            <p className="text-xs text-muted-foreground">
              clients with pending documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fully Approved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">clients verified</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requires Attention
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.requiresAttention}
            </div>
            <p className="text-xs text-muted-foreground">need action</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({stats.pendingReview})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Approved ({stats.approved})
          </TabsTrigger>
          <TabsTrigger value="all">All Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ClientKYCTable
            data={clientSummaries.filter(
              (s) => s.pendingDocuments > 0 || s.underReviewDocuments > 0
            )}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewClient={handleViewClient}
          />
        </TabsContent>

        <TabsContent value="approved">
          <ClientKYCTable
            data={clientSummaries.filter((s) => s.overallStatus === "approved")}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewClient={handleViewClient}
          />
        </TabsContent>

        <TabsContent value="all">
          <ClientKYCTable
            data={clientSummaries}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onViewClient={handleViewClient}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ClientKYCTableProps {
  data: ClientKYCSummary[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onViewClient: (companyId: string) => void;
}

function ClientKYCTable({
  data,
  searchQuery,
  setSearchQuery,
  onViewClient,
}: ClientKYCTableProps) {
  const filteredData = data.filter(
    (summary) =>
      (summary.clientFullName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (summary.companyName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client KYC Submissions</CardTitle>
        <CardDescription>
          Click on a client to review their documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by client name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((summary) => {
                  const progressPercent =
                    summary.totalDocuments > 0
                      ? Math.round(
                          (summary.approvedDocuments / summary.totalDocuments) *
                            100
                        )
                      : 0;

                  return (
                    <TableRow
                      key={summary.companyId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => onViewClient(summary.companyId)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{summary.companyName}</p>
                            <p className="text-sm text-muted-foreground">
                              {summary.clientFullName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {summary.totalDocuments}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            documents
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>
                              {summary.approvedDocuments}/
                              {summary.totalDocuments} approved
                            </span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statusConfig[summary.overallStatus]?.variant ||
                            "secondary"
                          }
                          className="flex items-center gap-1 w-fit"
                        >
                          {statusConfig[summary.overallStatus]?.icon}
                          {statusConfig[summary.overallStatus]?.label ||
                            summary.overallStatus}
                        </Badge>
                        {(summary.pendingDocuments > 0 ||
                          summary.underReviewDocuments > 0) && (
                          <p className="text-xs text-amber-600 mt-1">
                            {summary.pendingDocuments > 0 &&
                              `${summary.pendingDocuments} pending`}
                            {summary.pendingDocuments > 0 &&
                              summary.underReviewDocuments > 0 &&
                              ", "}
                            {summary.underReviewDocuments > 0 &&
                              `${summary.underReviewDocuments} in review`}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(
                            summary.lastSubmission
                          ).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewClient(summary.companyId);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
