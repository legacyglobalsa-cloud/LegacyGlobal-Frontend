import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  Eye, 
  Building2,
  Calendar,
  FileText,
  Send,
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  FolderKanban
} from "lucide-react";
import { mockAdminProposals, AdminProposal } from "@/constants/mockAdminData";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "draft": { label: "Draft", variant: "secondary" },
  "sent": { label: "Sent", variant: "outline" },
  "viewed": { label: "Viewed", variant: "outline" },
  "approved": { label: "Approved", variant: "default" },
  "changes-requested": { label: "Changes Requested", variant: "destructive" },
  "expired": { label: "Expired", variant: "secondary" },
};

export default function AdminProposals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProposal, setSelectedProposal] = useState<AdminProposal | null>(null);

  const filteredProposals = mockAdminProposals.filter((proposal) => {
    const matchesSearch = 
      proposal.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proposal.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const proposalStats = {
    total: mockAdminProposals.length,
    draft: mockAdminProposals.filter(p => p.status === "draft").length,
    sent: mockAdminProposals.filter(p => p.status === "sent").length,
    approved: mockAdminProposals.filter(p => p.status === "approved").length,
    expired: mockAdminProposals.filter(p => p.status === "expired").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground">
            Create, manage, and track client proposals
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalStats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalStats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalStats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalStats.expired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>
            View and manage all proposal documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="changes-requested">Changes Requested</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proposal</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No proposals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.projectName}</p>
                          <p className="text-sm text-muted-foreground">#{proposal.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {proposal.clientName || "Not assigned"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          {proposal.projectName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            SAR {proposal.totalFee.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[proposal.status]?.variant || "secondary"}>
                          {statusConfig[proposal.status]?.label || proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {proposal.expiresAt ? new Date(proposal.expiresAt).toLocaleDateString() : "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {proposal.status === "draft" && (
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedProposal(proposal)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{proposal.projectName}</DialogTitle>
                                <DialogDescription>
                                  Proposal for {proposal.clientName || "Unassigned Client"}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Client</p>
                                    <p className="font-medium">{proposal.clientName || "Not assigned"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Project</p>
                                    <p className="font-medium">{proposal.projectName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Timeline</p>
                                    <p className="font-medium">{proposal.timeline || "-"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={statusConfig[proposal.status]?.variant || "secondary"}>
                                      {statusConfig[proposal.status]?.label || proposal.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-3">Proposal Value</h4>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Retainer Fee</p>
                                      <p className="font-medium">
                                        SAR {proposal.retainerFee.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Success Fee</p>
                                      <p className="font-medium">
                                        SAR {proposal.successFee.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Total</p>
                                      <p className="font-bold text-lg">
                                        SAR {proposal.totalFee.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-3">Timeline</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Created Date</p>
                                      <p className="font-medium">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Valid Until</p>
                                      <p className="font-medium">{proposal.expiresAt ? new Date(proposal.expiresAt).toLocaleDateString() : "-"}</p>
                                    </div>
                                    {proposal.sentAt && (
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Sent Date</p>
                                        <p className="font-medium">{new Date(proposal.sentAt).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                    {proposal.respondedAt && (
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Response Date</p>
                                        <p className="font-medium">{new Date(proposal.respondedAt).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  {proposal.status === "draft" && (
                                    <>
                                      <Button variant="outline" className="flex-1">
                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                      </Button>
                                      <Button className="flex-1">
                                        <Send className="mr-2 h-4 w-4" /> Send to Client
                                      </Button>
                                    </>
                                  )}
                                  {proposal.status === "sent" && (
                                    <Button variant="outline" className="flex-1">
                                      Send Reminder
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
