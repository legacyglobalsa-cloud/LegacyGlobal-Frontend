import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Calendar,
  DollarSign,
  Users,
  FolderKanban
} from "lucide-react";
import { mockDashboardStats, mockAdminProjects, serviceCategories } from "@/constants/mockAdminData";

export default function AdminReports() {
  // Calculate project distribution by category
  const projectsByCategory = serviceCategories.map(category => ({
    name: category,
    count: mockAdminProjects.filter(p => p.serviceCategory === category).length
  })).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  // Calculate project distribution by status
  const projectsByStatus = [
    { name: "In Progress", count: mockAdminProjects.filter(p => p.status === "in-progress").length, color: "bg-blue-500" },
    { name: "Completed", count: mockAdminProjects.filter(p => p.status === "completed").length, color: "bg-green-500" },
    { name: "Pending", count: mockAdminProjects.filter(p => ["submitted", "matched", "approved"].includes(p.status)).length, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            System-wide performance metrics and financial reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">SAR {mockDashboardStats.revenue.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.projects.active}</div>
            <p className="text-xs text-muted-foreground">
              {mockDashboardStats.projects.pending} pending approval
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
            <p className="text-xs text-muted-foreground flex items-center gap-1 text-green-600">
              <TrendingUp className="h-3 w-3" /> +4 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Proposal to Contract
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Financial Overview</TabsTrigger>
          <TabsTrigger value="projects">Project Analytics</TabsTrigger>
          <TabsTrigger value="clients">Client Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>
                  Monthly revenue breakdown for the current year
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-end justify-between gap-2 px-4 pt-8 pb-2">
                  {[35, 45, 30, 60, 55, 70, 65, 80, 75, 90, 85, 95].map((height, i) => (
                    <div key={i} className="w-full bg-primary/10 hover:bg-primary/20 rounded-t transition-all relative group">
                      <div 
                        className="absolute bottom-0 w-full bg-primary rounded-t transition-all group-hover:bg-primary/80"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>
                  Distribution across service types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsByCategory.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground">{Math.round((item.count / mockAdminProjects.length) * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${(item.count / mockAdminProjects.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status Distribution</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <div className="relative h-48 w-48 rounded-full border-8 border-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{mockAdminProjects.length}</div>
                      <div className="text-xs text-muted-foreground">Total Projects</div>
                    </div>
                    {/* Simple visual representation - in a real app use a chart library */}
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-500 rotate-45" />
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {projectsByStatus.map((status, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${status.color}`} />
                      <span className="text-sm text-muted-foreground">{status.name} ({status.count})</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Categories</CardTitle>
                <CardDescription>Based on project volume and value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectsByCategory.slice(0, 4).map((category, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.count} projects</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">SAR {(category.count * 450000).toLocaleString()}</p>
                        <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                          <TrendingUp className="h-3 w-3" /> +{Math.floor(Math.random() * 20)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Acquisition</CardTitle>
              <CardDescription>New client registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end justify-between gap-2 px-4 pt-8 pb-2">
                {[5, 8, 12, 15, 10, 18, 22, 25, 20, 28, 32, 35].map((height, i) => (
                  <div key={i} className="w-full bg-secondary/30 hover:bg-secondary/50 rounded-t transition-all relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all group-hover:bg-blue-600"
                      style={{ height: `${height * 2.5}%` }}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
