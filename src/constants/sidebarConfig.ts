import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileCheck,
  FileText,
  FileSignature,
  Receipt,
  ClipboardList,
  Settings,
  UserCog,
  Building2,
  Upload,
  Send,
  ListChecks,
  FolderOpen,
  LifeBuoy,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"

// User role types
export type UserRole = "admin" | "client" | "triparty"

// Types for sidebar navigation
export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export interface NavSecondaryItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface SidebarConfig {
  navMain: NavItem[]
  navSecondary: NavSecondaryItem[]
  branding: {
    name: string
    subtitle: string
    logo?: string
  }
}

// ============================================
// ADMIN SIDEBAR CONFIGURATION
// ============================================
export const adminSidebarConfig: SidebarConfig = {
  branding: {
    name: "Legacy Global",
    subtitle: "Admin Portal",
    logo: "/Logos/legacy-logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Projects",
      url: "/admin/projects",
      icon: FolderKanban,
    },
    {
      title: "Clients",
      url: "/admin/clients",
      icon: Users,
    },
    {
      title: "KYC Review",
      url: "/admin/kyc",
      icon: FileCheck,
    },
    {
      title: "Proposals",
      url: "/admin/proposals",
      icon: FileText,
    },
    {
      title: "Contracts",
      url: "/admin/contracts",
      icon: FileSignature,
    },
    {
      title: "Invoices",
      url: "/admin/invoices",
      icon: Receipt,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: ClipboardList,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UserCog,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/admin/support",
      icon: LifeBuoy,
    },
  ],
}

// ============================================
// CLIENT SIDEBAR CONFIGURATION
// ============================================
export const clientSidebarConfig: SidebarConfig = {
  branding: {
    name: "Legacy Global",
    subtitle: "Client Portal",
    logo: "/Logos/legacy-logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/client",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Company Profile",
      url: "/client/profile",
      icon: Building2,
    },
    {
      title: "KYC Documents",
      url: "/client/kyc",
      icon: Upload,
    },
    {
      title: "Project Intake",
      url: "/client/project-intake",
      icon: Send,
    },
    {
      title: "My Projects",
      url: "/client/projects",
      icon: FolderKanban,
    },
    {
      title: "Proposals",
      url: "/client/proposals",
      icon: FileText,
    },
    {
      title: "Contracts",
      url: "/client/contracts",
      icon: FileSignature,
    },
    {
      title: "Documents",
      url: "/client/documents",
      icon: FolderOpen,
    },
    {
      title: "Invoices",
      url: "/client/invoices",
      icon: Receipt,
    },
    {
      title: "Reports",
      url: "/client/reports",
      icon: ClipboardList,
    },
    {
      title: "Settings",
      url: "/client/settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/client/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/client/feedback",
      icon: MessageSquare,
    },
  ],
}

// ============================================
// TRI-PARTY SIDEBAR CONFIGURATION
// (Abdullah Law Firm & Spectrum Engineering)
// ============================================
export const tripartySidebarConfig: SidebarConfig = {
  branding: {
    name: "Legacy Global",
    subtitle: "Partner Portal",
    logo: "/Logos/legacy-logo.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/triparty",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Submit Project",
      url: "/triparty/submit",
      icon: Send,
    },
    {
      title: "My Projects",
      url: "/triparty/projects",
      icon: FolderKanban,
      items: [
        { title: "Submitted Projects", url: "/triparty/projects/submitted" },
        { title: "In Progress", url: "/triparty/projects/active" },
        { title: "Completed", url: "/triparty/projects/completed" },
      ],
    },
    {
      title: "Assigned Tasks",
      url: "/triparty/tasks",
      icon: ListChecks,
      items: [
        { title: "Pending Tasks", url: "/triparty/tasks/pending" },
        { title: "Completed Tasks", url: "/triparty/tasks/completed" },
      ],
    },
    {
      title: "Client Files",
      url: "/triparty/files",
      icon: FolderOpen,
    },
    {
      title: "Project Updates",
      url: "/triparty/updates",
      icon: ClipboardList,
    },
    {
      title: "Invoices",
      url: "/triparty/invoices",
      icon: Receipt,
    },
    {
      title: "Profile & Settings",
      url: "/triparty/settings",
      icon: Settings,
      items: [
        { title: "Company Info", url: "/triparty/settings/company" },
        { title: "Signatories", url: "/triparty/settings/signatories" },
        { title: "Notifications", url: "/triparty/settings/notifications" },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/triparty/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/triparty/feedback",
      icon: MessageSquare,
    },
  ],
}

// ============================================
// GET SIDEBAR CONFIG BY ROLE
// ============================================
export function getSidebarConfig(role: UserRole): SidebarConfig {
  switch (role) {
    case "admin":
      return adminSidebarConfig
    case "client":
      return clientSidebarConfig
    case "triparty":
      return tripartySidebarConfig
    default:
      return clientSidebarConfig
  }
}

// ============================================
// MOCK USER DATA (Replace with actual auth later)
// ============================================
export const mockUsers = {
  admin: {
    name: "Admin User",
    email: "admin@legacyglobalsa.com",
    avatar: "/avatars/admin.jpg",
    role: "admin" as UserRole,
  },
  client: {
    name: "John Client",
    email: "client@company.com",
    avatar: "/avatars/client.jpg",
    role: "client" as UserRole,
  },
  triparty: {
    name: "Abdullah Al-Rasheed",
    email: "contact@alrasheedlaw.com",
    avatar: "/avatars/triparty.jpg",
    role: "triparty" as UserRole,
  },
}
