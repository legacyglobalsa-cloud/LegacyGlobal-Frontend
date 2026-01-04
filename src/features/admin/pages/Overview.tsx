import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban, 
  Users, 
  FileCheck, 
  FileText,
  FileSignature, 
  Receipt, 
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building2,
  UserPlus
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  mockDashboardStats, 
  mockAdminProjects, 
  mockKYCReviews,
  mockAdminProposals,
  mockAdminContracts,
  mockAdminInvoices,
  mockAdminClients,
  mockTriPartyPartners
} from "@/constants/mockAdminData";

export default function AdminOverview() {
  const pendingKYC = mockKYCReviews.filter(k => k.status === "pending");
  const pendingProposals = mockAdminProposals.filter(p => p.status === "draft");
  const pendingContracts = mockAdminContracts.filter(c => c.status === "pending_signature");
  const overdueInvoices = mockAdminInvoices.filter(i => i.status === "overdue");
  const activeProjects = mockAdminProjects.filter(p => p.status === "in-progress");

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your system status and pending actions.
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.projects.total}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.projects.active} active, {mockDashboardStats.projects.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.clients.total}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.clients.pendingKYC} pending KYC approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockDashboardStats.revenue.thisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total: ${mockDashboardStats.revenue.total.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDashboardStats.tasks.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires your attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
            <FileCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.clients.pendingKYC}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.clients.active} approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Proposals</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.projects.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting client response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Contracts</CardTitle>
            <FileSignature className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.tasks.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting signature
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <Receipt className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.tasks.overdue}</div>
            <p className="text-xs text-muted-foreground">
              ${mockDashboardStats.revenue.pending.toLocaleString()} pending payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions Alert */}
      {(pendingKYC.length > 0 || pendingProposals.length > 0 || overdueInvoices.length > 0) && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Pending Actions Required
            </CardTitle>
            <CardDescription>
              The following items need your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingKYC.length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-950 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900">
                    <FileCheck className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">KYC Reviews Pending</p>
                    <p className="text-sm text-muted-foreground">
                      {pendingKYC.length} client(s) awaiting KYC verification
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/kyc">
                    Review <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {pendingProposals.length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-950 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Draft Proposals</p>
                    <p className="text-sm text-muted-foreground">
                      {pendingProposals.length} proposal(s) ready to be sent
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/proposals">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {overdueInvoices.length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-950 border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
                    <Receipt className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Overdue Invoices</p>
                    <p className="text-sm text-muted-foreground">
                      {overdueInvoices.length} invoice(s) past due date
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/invoices">
                    Follow Up <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Projects & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Projects
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/projects">View All</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Currently in-progress projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.slice(0, 4).map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="font-medium">{project.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {project.clientName}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="outline">{project.phaseName}</Badge>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="w-16 h-2" />
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tri-Party Partners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tri-Party Partners
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/users">Manage</Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Partner organizations submitting projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTriPartyPartners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{partner.name}</p>
                    <p className="text-sm text-muted-foreground">{partner.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={partner.status === "active" ? "default" : "secondary"}>
                    {partner.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {partner.projectsSubmitted} projects
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Clients
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/clients">View All</Link>
            </Button>
          </CardTitle>
          <CardDescription>
            Latest client registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAdminClients.slice(0, 3).map((client) => (
              <div key={client.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="p-2 rounded-full bg-primary/10">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{client.companyName}</p>
                  <p className="text-sm text-muted-foreground">{client.industry}</p>
                </div>
                <Badge 
                  variant={
                    client.kycStatus === "approved" ? "default" : 
                    client.kycStatus === "pending" ? "secondary" : 
                    "destructive"
                  }
                >
                  {client.kycStatus}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
