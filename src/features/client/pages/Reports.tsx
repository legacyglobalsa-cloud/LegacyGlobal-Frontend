import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  Award,
  TrendingUp,
  Clock,
  FolderOpen
} from "lucide-react";
import { mockProjects } from "@/constants/mockClientData";

// Mock reports data
const mockReports = [
  {
    id: "RPT-001",
    name: "Monthly Progress Report - January 2025",
    type: "progress",
    projectId: "PRJ-001",
    projectName: "Company Formation - Tech Startup LLC",
    generatedAt: "2025-01-31",
    size: 524288,
    status: "ready",
  },
  {
    id: "RPT-002",
    name: "Compliance Summary Report Q4 2024",
    type: "compliance",
    projectId: "PRJ-002",
    projectName: "Commercial License Application",
    generatedAt: "2025-01-05",
    size: 1048576,
    status: "ready",
  },
  {
    id: "RPT-003",
    name: "Project Completion Certificate",
    type: "certificate",
    projectId: "PRJ-002",
    projectName: "Commercial License Application",
    generatedAt: "2025-01-15",
    size: 262144,
    status: "ready",
  },
  {
    id: "RPT-004",
    name: "Financial Summary Report",
    type: "financial",
    projectId: "PRJ-003",
    projectName: "Visa Processing - Workforce",
    generatedAt: "2025-01-20",
    size: 786432,
    status: "ready",
  },
  {
    id: "RPT-005",
    name: "Project Status Overview - February 2025",
    type: "progress",
    projectId: "PRJ-001",
    projectName: "Company Formation - Tech Startup LLC",
    generatedAt: "2025-02-15",
    size: 0,
    status: "pending",
  },
];

const reportTemplates = [
  {
    id: "TPL-001",
    name: "Project Progress Report",
    description: "Comprehensive overview of project milestones, timeline, and current status",
    type: "progress",
    icon: TrendingUp,
  },
  {
    id: "TPL-002",
    name: "Compliance Report",
    description: "Summary of all compliance requirements and their completion status",
    type: "compliance",
    icon: CheckCircle2,
  },
  {
    id: "TPL-003",
    name: "Financial Summary",
    description: "Overview of project costs, invoices, and payment history",
    type: "financial",
    icon: BarChart3,
  },
  {
    id: "TPL-004",
    name: "Project Completion Certificate",
    description: "Official certificate confirming project completion and deliverables",
    type: "certificate",
    icon: Award,
  },
];

export default function ClientReports() {
  const [selectedProject, setSelectedProject] = useState<string>("all");

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      compliance: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      financial: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      certificate: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    };
    return (
      <Badge className={colors[type] || "bg-gray-100 text-gray-800"}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "ready") {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Ready</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Generating...</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "Pending";
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Filter reports
  const filteredReports = selectedProject === "all" 
    ? mockReports 
    : mockReports.filter(r => r.projectId === selectedProject);

  const readyReports = mockReports.filter(r => r.status === "ready");
  const certificates = mockReports.filter(r => r.type === "certificate");

  const handleGenerateReport = (templateId: string) => {
    alert(`Generating report from template ${templateId}. You'll be notified when it's ready.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          View and download project reports and certificates
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-2">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockReports.length}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{readyReports.length}</p>
              <p className="text-sm text-muted-foreground">Ready to Download</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
              <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{certificates.length}</p>
              <p className="text-sm text-muted-foreground">Certificates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockReports.filter(r => r.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Generating</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {/* Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <FolderOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by project:</span>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="All Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {mockProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                {filteredReports.length} report(s) available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReports.length > 0 ? (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">{report.name}</h4>
                          <p className="text-sm text-muted-foreground">{report.projectName}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(report.generatedAt).toLocaleDateString()}
                            </div>
                            <span>•</span>
                            <span>{formatFileSize(report.size)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTypeBadge(report.type)}
                        {getStatusBadge(report.status)}
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={report.status !== "ready"}
                        >
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-lg font-medium">No reports found</p>
                  <p className="text-sm text-muted-foreground">
                    Generate a new report from the templates
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Select a template to generate a new report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-3">
                          <template.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2">
                            {getTypeBadge(template.type)}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleGenerateReport(template.id)}
                            >
                              Generate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Selection for Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Generate</CardTitle>
              <CardDescription>
                Generate a report for a specific project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Select Project</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.filter(p => p.status === "in-progress").map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map(template => (
                        <SelectItem key={template.id} value={template.type}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" /> Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Completion Certificates
              </CardTitle>
              <CardDescription>
                Official certificates for completed projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900 dark:bg-purple-950/20">
                      <div className="flex items-center gap-4">
                        <Award className="h-6 w-6 text-purple-500" />
                        <div>
                          <h4 className="font-medium">{cert.name}</h4>
                          <p className="text-sm text-muted-foreground">{cert.projectName}</p>
                          <p className="text-xs text-muted-foreground">
                            Issued {new Date(cert.generatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Download Certificate
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-lg font-medium">No certificates yet</p>
                  <p className="text-sm text-muted-foreground">
                    Certificates will be issued upon project completion
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
