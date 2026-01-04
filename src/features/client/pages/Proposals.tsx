import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  MessageSquare,
  Eye
} from "lucide-react";
import { mockProposals, type Proposal } from "@/constants/mockClientData";

export default function ClientProposals() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showChangesDialog, setShowChangesDialog] = useState(false);
  const [changesComment, setChangesComment] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Pending Review</Badge>;
      case "viewed":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Viewed</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approved</Badge>;
      case "changes-requested":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Changes Requested</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = () => {
    // Mock approve action
    alert("Proposal approved! You will receive a contract for signing shortly.");
    setSelectedProposal(null);
  };

  const handleRequestChanges = () => {
    // Mock request changes action
    alert("Your feedback has been submitted. We will revise the proposal and send an updated version.");
    setShowChangesDialog(false);
    setChangesComment("");
    setSelectedProposal(null);
  };

  const pendingProposals = mockProposals.filter(p => p.status === "pending" || p.status === "viewed");
  const processedProposals = mockProposals.filter(p => p.status === "approved" || p.status === "changes-requested");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
        <p className="text-muted-foreground">
          Review and approve project proposals
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingProposals.length}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockProposals.filter(p => p.status === "approved").length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockProposals.length}</p>
              <p className="text-sm text-muted-foreground">Total Proposals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Proposals */}
      {pendingProposals.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Proposals Awaiting Your Review
            </CardTitle>
            <CardDescription>
              Please review and respond to these proposals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingProposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="space-y-1">
                  <h4 className="font-medium">{proposal.projectName}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{proposal.totalFee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Expires {new Date(proposal.expiresAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(proposal.status)}
                  <Button onClick={() => setSelectedProposal(proposal)}>
                    <Eye className="mr-2 h-4 w-4" /> Review
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Proposals */}
      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>History of all received proposals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProposals.map((proposal) => (
              <div key={proposal.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <h4 className="font-medium">{proposal.projectName}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>{proposal.totalFee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Sent {new Date(proposal.sentAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(proposal.status)}
                  <Button variant="outline" onClick={() => setSelectedProposal(proposal)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proposal Detail Dialog */}
      <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProposal && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Proposal: {selectedProposal.projectName}</span>
                  {getStatusBadge(selectedProposal.status)}
                </DialogTitle>
                <DialogDescription>
                  Review the proposal details below
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Scope */}
                <div className="space-y-2">
                  <h4 className="font-medium">Scope of Work</h4>
                  <p className="text-sm text-muted-foreground">{selectedProposal.scope}</p>
                </div>

                <Separator />

                {/* Fee Structure */}
                <div className="space-y-3">
                  <h4 className="font-medium">Fee Structure</h4>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Retainer Fee</p>
                        <p className="text-lg font-semibold">{selectedProposal.retainerFee}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Success Fee</p>
                        <p className="text-lg font-semibold">{selectedProposal.successFee}</p>
                      </CardContent>
                    </Card>
                    <Card className="border-primary bg-primary/5">
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground">Total Fee</p>
                        <p className="text-lg font-semibold text-primary">{selectedProposal.totalFee}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="font-medium">Project Timeline: {selectedProposal.timeline}</h4>
                  <div className="space-y-3">
                    {selectedProposal.phases.map((phase, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{phase.name}</h5>
                          <Badge variant="outline">{phase.duration}</Badge>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {phase.deliverables.map((deliverable, dIndex) => (
                            <li key={dIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Expiry Notice */}
                <div className="flex items-center gap-2 rounded-lg bg-muted p-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    This proposal is valid until{" "}
                    <span className="font-medium">{new Date(selectedProposal.expiresAt).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>

              {selectedProposal.status === "pending" || selectedProposal.status === "viewed" ? (
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" onClick={() => setShowChangesDialog(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Request Changes
                  </Button>
                  <Button onClick={handleApprove}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Proposal
                  </Button>
                </DialogFooter>
              ) : (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedProposal(null)}>
                    Close
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Request Changes Dialog */}
      <Dialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Please describe the changes you'd like to see in the proposal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe the changes you would like..."
              value={changesComment}
              onChange={(e) => setChangesComment(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangesDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestChanges} disabled={!changesComment.trim()}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
