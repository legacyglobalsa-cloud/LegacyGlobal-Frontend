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
  FileSignature,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  FolderKanban
} from "lucide-react";
import { mockAdminContracts, AdminContract } from "@/constants/mockAdminData";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "draft": { label: "Draft", variant: "secondary" },
  "sent": { label: "Sent", variant: "outline" },
  "pending": { label: "Pending", variant: "outline" },
  "signed": { label: "Signed", variant: "default" },
  "active": { label: "Active", variant: "default" },
  "completed": { label: "Completed", variant: "secondary" },
  "expired": { label: "Expired", variant: "destructive" },
};

export default function AdminContracts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<AdminContract | null>(null);

  const filteredContracts = mockAdminContracts.filter((contract) => {
    const matchesSearch = 
      contract.typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const contractStats = {
    total: mockAdminContracts.length,
    pending: mockAdminContracts.filter(c => c.status === "pending" || c.status === "sent").length,
    active: mockAdminContracts.filter(c => c.status === "active" || c.status === "signed").length,
    completed: mockAdminContracts.filter(c => c.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
          <p className="text-muted-foreground">
            Manage and track all client contracts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Contract
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Signature</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{contractStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
          <CardDescription>
            View and manage all contract documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No contracts found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{contract.typeName}</p>
                          <p className="text-sm text-muted-foreground">#{contract.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {contract.clientName || "Not assigned"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          {contract.projectName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{contract.typeName}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[contract.status]?.variant || "secondary"}>
                          {statusConfig[contract.status]?.label || contract.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {contract.sentAt ? new Date(contract.sentAt).toLocaleDateString() : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {contract.expiresAt ? new Date(contract.expiresAt).toLocaleDateString() : "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedContract(contract)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{contract.typeName}</DialogTitle>
                                <DialogDescription>
                                  Contract ID: {contract.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Client</p>
                                    <p className="font-medium">{contract.clientName || "Not assigned"}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Project</p>
                                    <p className="font-medium">{contract.projectName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Contract Type</p>
                                    <p className="font-medium">{contract.typeName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={statusConfig[contract.status]?.variant || "secondary"}>
                                      {statusConfig[contract.status]?.label || contract.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-3">Contract Timeline</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    {contract.sentAt && (
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Sent Date</p>
                                        <p className="font-medium">{new Date(contract.sentAt).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                    {contract.signedAt && (
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Signed Date</p>
                                        <p className="font-medium">{new Date(contract.signedAt).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                    {contract.expiresAt && (
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Expires</p>
                                        <p className="font-medium">{new Date(contract.expiresAt).toLocaleDateString()}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button variant="outline" className="flex-1">
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                  </Button>
                                  {contract.status === "pending" && (
                                    <Button className="flex-1">
                                      <Send className="mr-2 h-4 w-4" /> Send Reminder
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
