import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Calendar,
  Building2,
  DollarSign,
  ChevronRight,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockProjects, mockProjectUpdates, type Project } from "@/constants/mockClientData";

export default function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Completed</Badge>;
      case "proposal-sent":
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">Proposal Sent</Badge>;
      case "matched":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">Matched</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPhaseBadge = (phase: number, phaseName: string) => {
    return (
      <Badge variant="outline" className="font-normal">
        Phase {phase}: {phaseName}
      </Badge>
    );
  };

  const activeProjects = mockProjects.filter(p => p.status === "in-progress" || p.status === "proposal-sent" || p.status === "matched");
  const completedProjects = mockProjects.filter(p => p.status === "completed" || p.status === "closed");

  const projectUpdates = selectedProject 
    ? mockProjectUpdates.filter(u => u.projectId === selectedProject.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">
            Track and manage all your projects
          </p>
        </div>
        <Button asChild>
          <Link to="/client/intake">
            Start New Project <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <FolderKanban className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProjects.length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedProjects.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockProjects.filter(p => p.status === "proposal-sent").length}</p>
              <p className="text-sm text-muted-foreground">Awaiting Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="rounded-full bg-primary/10 p-2">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockProjects.length}</p>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedProject?.id === project.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.serviceCategory}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(project.status)}
                          {getPhaseBadge(project.phase, project.phaseName)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(project.expectedEndDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>{project.tripartyPartner}</span>
                          </div>
                        </div>
                        <span className="font-medium text-primary">{project.projectValue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedProject?.id === project.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{project.serviceCategory}</p>
                        </div>
                        {getStatusBadge(project.status)}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span>Completed {new Date(project.expectedEndDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>{project.tripartyPartner}</span>
                          </div>
                        </div>
                        <span className="font-medium text-primary">{project.projectValue}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Project Details Sidebar */}
        <div className="space-y-4">
          {selectedProject ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedProject.name}</CardTitle>
                  <CardDescription>{selectedProject.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      {getStatusBadge(selectedProject.status)}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phase</span>
                      <span className="font-medium">Phase {selectedProject.phase}: {selectedProject.phaseName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Partner</span>
                      <span className="font-medium">{selectedProject.tripartyPartner}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-medium">{selectedProject.projectValue}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Date</span>
                      <span className="font-medium">{new Date(selectedProject.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected End</span>
                      <span className="font-medium">{new Date(selectedProject.expectedEndDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Phase Progress */}
                  <div className="space-y-2 pt-4">
                    <p className="text-sm font-medium">Phase Progress</p>
                    <div className="space-y-2">
                      {[
                        { num: 1, name: "Due Diligence" },
                        { num: 2, name: "Legal & Compliance" },
                        { num: 3, name: "Technical Execution" },
                        { num: 4, name: "Closing & Completion" },
                      ].map((phase) => (
                        <div key={phase.num} className="flex items-center gap-2">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            selectedProject.phase > phase.num
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                              : selectedProject.phase === phase.num
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                                : "bg-muted text-muted-foreground"
                          }`}>
                            {selectedProject.phase > phase.num ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              phase.num
                            )}
                          </div>
                          <span className={`text-sm ${
                            selectedProject.phase >= phase.num ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {phase.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectUpdates.length > 0 ? (
                    <div className="space-y-4">
                      {projectUpdates.slice(0, 3).map((update) => (
                        <div key={update.id} className="space-y-1 border-l-2 border-primary/20 pl-3">
                          <p className="text-sm font-medium">{update.title}</p>
                          <p className="text-xs text-muted-foreground">{update.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(update.createdAt).toLocaleDateString()} • {update.createdBy}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No updates yet</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Select a project to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
