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
  Receipt,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  FolderKanban
} from "lucide-react";
import { mockAdminInvoices, AdminInvoice } from "@/constants/mockAdminData";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "draft": { label: "Draft", variant: "secondary" },
  "sent": { label: "Sent", variant: "outline" },
  "pending": { label: "Pending", variant: "secondary" },
  "paid": { label: "Paid", variant: "default" },
  "partially-paid": { label: "Partially Paid", variant: "outline" },
  "overdue": { label: "Overdue", variant: "destructive" },
};

export default function AdminInvoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<AdminInvoice | null>(null);

  const filteredInvoices = mockAdminInvoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const invoiceStats = {
    total: mockAdminInvoices.length,
    paid: mockAdminInvoices.filter(i => i.status === "paid").length,
    pending: mockAdminInvoices.filter(i => i.status === "pending" || i.status === "sent").length,
    overdue: mockAdminInvoices.filter(i => i.status === "overdue").length,
    totalAmount: mockAdminInvoices.reduce((sum, i) => sum + i.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track client invoices and payments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {invoiceStats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {invoiceStats.total} invoices generated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceStats.paid}</div>
            <p className="text-xs text-muted-foreground">Invoices fully paid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceStats.overdue}</div>
            <p className="text-xs text-muted-foreground">Payment past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
          <CardDescription>
            View and manage all invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
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
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">{invoice.typeName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {invoice.clientName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-muted-foreground" />
                          {invoice.projectName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          SAR {invoice.totalAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[invoice.status]?.variant || "secondary"}>
                          {statusConfig[invoice.status]?.label || invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {invoice.dueDate}
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
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{invoice.invoiceNumber}</DialogTitle>
                                <DialogDescription>
                                  Invoice Details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Client</p>
                                    <p className="font-medium">{invoice.clientName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Project</p>
                                    <p className="font-medium">{invoice.projectName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Invoice Type</p>
                                    <p className="font-medium">{invoice.typeName}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={statusConfig[invoice.status]?.variant || "secondary"}>
                                      {statusConfig[invoice.status]?.label || invoice.status}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-3">Payment Details</h4>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Amount</p>
                                      <p className="font-medium">SAR {invoice.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">VAT (15%)</p>
                                      <p className="font-medium">SAR {invoice.vatAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Total</p>
                                      <p className="font-bold text-lg">SAR {invoice.totalAmount.toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-3">Timeline</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Issued Date</p>
                                      <p className="font-medium">{invoice.issuedAt.split('T')[0]}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-sm text-muted-foreground">Due Date</p>
                                      <p className="font-medium">{invoice.dueDate}</p>
                                    </div>
                                    {invoice.paidAt && (
                                      <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Paid Date</p>
                                        <p className="font-medium">{invoice.paidAt.split('T')[0]}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                  <Button variant="outline" className="flex-1">
                                    <Download className="mr-2 h-4 w-4" /> Download PDF
                                  </Button>
                                  {invoice.status !== "paid" && (
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
