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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Eye, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileCheck,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  FolderKanban,
  DollarSign
} from "lucide-react";
import { mockAdminClients, AdminClient } from "@/constants/mockAdminData";

const kycStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive"; icon: React.ReactNode }> = {
  "pending": { label: "Pending", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  "approved": { label: "Approved", variant: "default", icon: <CheckCircle2 className="h-3 w-3" /> },
  "rejected": { label: "Rejected", variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
};

export default function AdminClients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [kycFilter, setKycFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);

  const filteredClients = mockAdminClients.filter((client) => {
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.signatoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.signatoryEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKYC = kycFilter === "all" || client.kycStatus === kycFilter;
    return matchesSearch && matchesKYC;
  });

  const clientStats = {
    total: mockAdminClients.length,
    approved: mockAdminClients.filter(c => c.kycStatus === "approved").length,
    pending: mockAdminClients.filter(c => c.kycStatus === "pending").length,
    rejected: mockAdminClients.filter(c => c.kycStatus === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage client accounts and view their project history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>
            View and manage all registered client companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by company, contact, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No clients found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{client.companyName}</p>
                            <p className="text-sm text-muted-foreground">{client.crNumber}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.signatoryName}</p>
                          <p className="text-sm text-muted-foreground">{client.signatoryEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{client.city}, {client.country}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={kycStatusConfig[client.kycStatus]?.variant || "secondary"}
                          className="flex items-center gap-1 w-fit"
                        >
                          {kycStatusConfig[client.kycStatus]?.icon}
                          {kycStatusConfig[client.kycStatus]?.label || client.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          {client.projectsCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          {client.totalValue.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(client.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedClient(client)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                {client.companyName}
                              </DialogTitle>
                              <DialogDescription>
                                Client details and project history
                              </DialogDescription>
                            </DialogHeader>
                            <Tabs defaultValue="details" className="mt-4">
                              <TabsList>
                                <TabsTrigger value="details">Company Details</TabsTrigger>
                                <TabsTrigger value="projects">Projects</TabsTrigger>
                                <TabsTrigger value="documents">KYC Documents</TabsTrigger>
                              </TabsList>
                              <TabsContent value="details" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Company Name</p>
                                    <p className="font-medium">{client.companyName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">CR Number</p>
                                    <p className="font-medium">{client.crNumber}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="font-medium">{client.city}, {client.country}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Registered Since</p>
                                    <p className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-3">Signatory Contact</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-muted-foreground" />
                                      <span>{client.signatoryEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span>{client.signatoryPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 col-span-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span>{client.city}, {client.country}</span>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              <TabsContent value="projects" className="mt-4">
                                <div className="text-center py-8 text-muted-foreground">
                                  <FolderKanban className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>Client has {client.projectsCount} project(s)</p>
                                  <p className="text-sm">Total value: SAR {client.totalValue.toLocaleString()}</p>
                                </div>
                              </TabsContent>
                              <TabsContent value="documents" className="mt-4">
                                <div className="text-center py-8 text-muted-foreground">
                                  <FileCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p>KYC Status: {client.kycStatus}</p>
                                  <Button variant="outline" className="mt-4">View KYC Documents</Button>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </DialogContent>
                        </Dialog>
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
