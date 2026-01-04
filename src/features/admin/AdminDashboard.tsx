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

// Import Admin Pages
import Overview from "./pages/Overview";
import Projects from "./pages/Projects";
import Clients from "./pages/Clients";
import KYCReview from "./pages/KYCReview";
import KYCReviewDetail from "./pages/KYCReviewDetail";
import Proposals from "./pages/Proposals";
import Contracts from "./pages/Contracts";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

// Breadcrumb mapping
const breadcrumbMap: Record<string, { title: string; parent?: string }> = {
  "": { title: "Dashboard" },
  overview: { title: "Dashboard" },
  projects: { title: "Projects" },
  clients: { title: "Clients" },
  kyc: { title: "KYC Review" },
  proposals: { title: "Proposals" },
  contracts: { title: "Contracts" },
  invoices: { title: "Invoices" },
  reports: { title: "Reports" },
  users: { title: "Users" },
  settings: { title: "Settings" },
};

export default function AdminDashboard() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[1] || "";
  const breadcrumb = breadcrumbMap[currentPage] || { title: "Dashboard" };

  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
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
                    <Link to="/admin">Admin Portal</Link>
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
            <Route path="projects" element={<Projects />} />
            <Route path="clients" element={<Clients />} />
            <Route path="kyc" element={<KYCReview />} />
            <Route path="kyc/:companyId" element={<KYCReviewDetail />} />
            <Route path="proposals" element={<Proposals />} />
            <Route path="contracts" element={<Contracts />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
