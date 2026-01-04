import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FileSignature, 
  Clock, 
  CheckCircle2, 
  Download,
  Eye,
  Calendar,
  FileText,
  Pen,
  AlertCircle
} from "lucide-react";
import { mockContracts, type Contract } from "@/constants/mockClientData";

export default function ClientContracts() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending Signature</Badge>;
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Sent</Badge>;
      case "signed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Signed</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case "nda":
      case "ncnda":
        return "🔒";
      case "consultancy":
        return "📋";
      case "commission":
        return "💰";
      case "triparty":
        return "🤝";
      case "sow":
        return "📝";
      default:
        return "📄";
    }
  };

  const handleSign = () => {
    // Mock sign action
    alert("Contract signed successfully! A copy has been sent to your email.");
    setShowSignDialog(false);
    setAgreeToTerms(false);
    setSelectedContract(null);
  };

  const pendingContracts = mockContracts.filter(c => c.status === "pending");
  const signedContracts = mockContracts.filter(c => c.status === "signed" || c.status === "active" || c.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">
          View and sign your project contracts
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <Pen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingContracts.length}</p>
              <p className="text-sm text-muted-foreground">Pending Signature</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{signedContracts.length}</p>
              <p className="text-sm text-muted-foreground">Signed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-2">
              <FileSignature className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockContracts.length}</p>
              <p className="text-sm text-muted-foreground">Total Contracts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Contracts Alert */}
      {pendingContracts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Contracts Awaiting Your Signature
            </CardTitle>
            <CardDescription>
              Please review and sign these contracts to proceed with your projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingContracts.map((contract) => (
              <div key={contract.id} className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getContractTypeIcon(contract.type)}</span>
                  <div className="space-y-1">
                    <h4 className="font-medium">{contract.typeName}</h4>
                    <p className="text-sm text-muted-foreground">{contract.projectName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(contract.status)}
                  <Button onClick={() => {
                    setSelectedContract(contract);
                    setShowSignDialog(true);
                  }}>
                    <Pen className="mr-2 h-4 w-4" /> Sign Now
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Contracts */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Contracts</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingContracts.length})</TabsTrigger>
          <TabsTrigger value="signed">Signed ({signedContracts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contract History</CardTitle>
              <CardDescription>All your project contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getContractTypeIcon(contract.type)}</span>
                      <div className="space-y-1">
                        <h4 className="font-medium">{contract.typeName}</h4>
                        <p className="text-sm text-muted-foreground">{contract.projectName}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Sent {new Date(contract.sentAt).toLocaleDateString()}</span>
                          </div>
                          {contract.signedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              <span>Signed {new Date(contract.signedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contract.status)}
                      {contract.status === "pending" ? (
                        <Button onClick={() => {
                          setSelectedContract(contract);
                          setShowSignDialog(true);
                        }}>
                          <Pen className="mr-2 h-4 w-4" /> Sign
                        </Button>
                      ) : (
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      )}
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
              {pendingContracts.length > 0 ? (
                <div className="space-y-4">
                  {pendingContracts.map((contract) => (
                    <div key={contract.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{getContractTypeIcon(contract.type)}</span>
                        <div>
                          <h4 className="font-medium">{contract.typeName}</h4>
                          <p className="text-sm text-muted-foreground">{contract.projectName}</p>
                        </div>
                      </div>
                      <Button onClick={() => {
                        setSelectedContract(contract);
                        setShowSignDialog(true);
                      }}>
                        <Pen className="mr-2 h-4 w-4" /> Sign Now
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                  <p className="mt-4 text-lg font-medium">All caught up!</p>
                  <p className="text-sm text-muted-foreground">No contracts pending signature</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signed" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {signedContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{getContractTypeIcon(contract.type)}</span>
                      <div>
                        <h4 className="font-medium">{contract.typeName}</h4>
                        <p className="text-sm text-muted-foreground">{contract.projectName}</p>
                        <p className="text-xs text-muted-foreground">
                          Signed {new Date(contract.signedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contract.status)}
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sign Contract Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent className="max-w-2xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getContractTypeIcon(selectedContract.type)}</span>
                  {selectedContract.typeName}
                </DialogTitle>
                <DialogDescription>
                  Project: {selectedContract.projectName}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Contract Preview */}
                <Card className="bg-muted/50">
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Contract document preview would appear here
                      </p>
                      <Button variant="link" className="mt-2">
                        <Eye className="mr-2 h-4 w-4" /> View Full Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-3 rounded-lg border p-4">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="cursor-pointer font-medium">
                      I have read and agree to the terms
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      By checking this box, I confirm that I have read, understood, and agree to be bound by the terms and conditions of this {selectedContract.typeName}.
                    </p>
                  </div>
                </div>

                {/* Signature Info */}
                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-medium">Digital Signature</p>
                  <p className="text-muted-foreground">
                    Your signature will be recorded with your account details and timestamp. A signed copy will be sent to your registered email address.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setShowSignDialog(false);
                  setAgreeToTerms(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSign} disabled={!agreeToTerms}>
                  <Pen className="mr-2 h-4 w-4" /> Sign Contract
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
