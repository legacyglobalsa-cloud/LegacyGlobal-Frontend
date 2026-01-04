import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban, 
  FileCheck, 
  FileSignature, 
  Receipt, 
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  mockDashboardStats, 
  mockProjects, 
  mockProposals, 
  mockInvoices,
  mockContracts 
} from "@/constants/mockClientData";

export default function ClientOverview() {
  const pendingProposal = mockProposals.find(p => p.status === "pending");
  const pendingContract = mockContracts.find(c => c.status === "pending");
  const pendingInvoice = mockInvoices.find(i => i.status === "sent");
  const activeProjects = mockProjects.filter(p => p.status === "in-progress");

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your projects and pending actions.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.completedProjects} completed this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.pendingActions}</div>
            <p className="text-xs text-muted-foreground">
              Requires your attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents to Sign</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.documentsToSign}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting signature
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Project Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalProjectValue}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      {(pendingProposal || pendingContract || pendingInvoice) && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Action Required
            </CardTitle>
            <CardDescription>
              The following items require your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingProposal && (
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                    <FileCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Review Proposal</p>
                    <p className="text-sm text-muted-foreground">{pendingProposal.projectName}</p>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link to="/client/proposals">
                    Review <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {pendingContract && (
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                    <FileSignature className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Sign Contract</p>
                    <p className="text-sm text-muted-foreground">{pendingContract.typeName} - {pendingContract.projectName}</p>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link to="/client/contracts">
                    Sign <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {pendingInvoice && (
              <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                    <Receipt className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Pay Invoice</p>
                    <p className="text-sm text-muted-foreground">{pendingInvoice.invoiceNumber} - {pendingInvoice.totalAmount}</p>
                  </div>
                </div>
                <Button asChild size="sm">
                  <Link to="/client/invoices">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Track your ongoing projects</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/client/projects">View All</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeProjects.map((project) => (
            <div key={project.id} className="space-y-3 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.serviceCategory}</p>
                </div>
                <Badge variant="secondary">
                  Phase {project.phase}: {project.phaseName}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Expected: {new Date(project.expectedEndDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{project.tripartyPartner}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
