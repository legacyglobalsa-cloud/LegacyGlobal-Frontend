import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AppSidebar } from "@/components/common/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Import Client Pages
import Overview from "./pages/Overview";
import Profile from "./pages/Profile";
import KYCUpload from "./pages/KYCUpload";
import ProjectIntake from "./pages/ProjectIntake";
import MyProjects from "./pages/MyProjects";
import Proposals from "./pages/Proposals";
import Contracts from "./pages/Contracts";
import Documents from "./pages/Documents";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Breadcrumb mapping
const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  "": { title: "Overview" },
  "overview": { title: "Overview" },
  "profile": { title: "Company Profile" },
  "kyc": { title: "KYC Upload" },
  "project-intake": { title: "New Project Application" },
  "projects": { title: "My Projects" },
  "proposals": { title: "Proposals" },
  "contracts": { title: "Contracts" },
  "documents": { title: "Documents" },
  "invoices": { title: "Invoices" },
  "reports": { title: "Reports" },
  "settings": { title: "Settings" },
};

export default function ClientDashboard() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[1] || "";
  const breadcrumb = breadcrumbMap[currentPage] || { title: "Dashboard" };

  return (
    <SidebarProvider>
      <AppSidebar role="client" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/client">Client Portal</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="kyc" element={<KYCUpload />} />
            <Route path="project-intake" element={<ProjectIntake />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="documents" element={<Documents />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
