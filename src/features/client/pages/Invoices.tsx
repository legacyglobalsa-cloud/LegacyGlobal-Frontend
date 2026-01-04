import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Receipt, 
  Download,
  Search,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard
} from "lucide-react";
import { mockInvoices, type Invoice } from "@/constants/mockClientData";

export default function ClientInvoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Sent</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Paid</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-SA', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  // Calculate stats
  const totalAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = mockInvoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = mockInvoices
    .filter(inv => inv.status === "pending" || inv.status === "sent")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueInvoices = mockInvoices.filter(inv => inv.status === "overdue");

  // Filter invoices
  const filteredInvoices = mockInvoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingInvoices = mockInvoices.filter(inv => inv.status === "pending" || inv.status === "sent");
  const paidInvoices = mockInvoices.filter(inv => inv.status === "paid");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          View and manage your project invoices
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-2">
              <Receipt className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockInvoices.length}</p>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(paidAmount, "SAR")}</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(pendingAmount, "SAR")}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueInvoices.length}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Progress
          </CardTitle>
          <CardDescription>
            Overall payment status across all invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Total Billed: {formatCurrency(totalAmount, "SAR")}</span>
              <span className="text-green-600">{((paidAmount / totalAmount) * 100).toFixed(0)}% Paid</span>
            </div>
            <Progress value={(paidAmount / totalAmount) * 100} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Paid: {formatCurrency(paidAmount, "SAR")}</span>
              <span>Outstanding: {formatCurrency(totalAmount - paidAmount, "SAR")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overdue Alert */}
      {overdueInvoices.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Overdue Invoices
            </CardTitle>
            <CardDescription>
              Please make payment as soon as possible to avoid service interruption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overdueInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-background p-4 dark:border-red-900">
                <div className="flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-red-500" />
                  <div>
                    <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                    <p className="text-sm text-muted-foreground">{invoice.projectName}</p>
                    <p className="text-xs text-red-500">
                      Due {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
                  <Button variant="destructive">
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search invoices by number, project, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingInvoices.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidInvoices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                Showing {filteredInvoices.length} of {mockInvoices.length} invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">{invoice.projectName}</p>
                        <p className="text-xs text-muted-foreground">{invoice.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Due {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(invoice.status)}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {pendingInvoices.length > 0 ? (
                <div className="space-y-4">
                  {pendingInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <Receipt className="h-5 w-5 text-amber-500" />
                        <div>
                          <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                          <p className="text-sm text-muted-foreground">{invoice.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
                          <p className="text-xs text-muted-foreground">
                            Due {new Date(invoice.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(invoice.status)}
                        <Button>
                          <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="mt-4 text-lg font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No pending invoices</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {paidInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <Receipt className="h-5 w-5 text-green-500" />
                      <div>
                        <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-muted-foreground">{invoice.projectName}</p>
                        {invoice.paidAt && (
                          <p className="text-xs text-green-600">
                            Paid on {new Date(invoice.paidAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold">{formatCurrency(invoice.amount, invoice.currency)}</p>
                      {getStatusBadge(invoice.status)}
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Receipt
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  {selectedInvoice.invoiceNumber}
                </DialogTitle>
                <DialogDescription>
                  {selectedInvoice.projectName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Invoice Details */}
                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">Invoice Preview</p>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Issue Date</span>
                    <span>{new Date(selectedInvoice.issuedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Due Date</span>
                    <span>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                  </div>
                  {selectedInvoice.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid Date</span>
                      <span className="text-green-600">
                        {new Date(selectedInvoice.paidAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                  {(selectedInvoice.status === "pending" || selectedInvoice.status === "sent") && (
                    <Button className="flex-1">
                      <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
