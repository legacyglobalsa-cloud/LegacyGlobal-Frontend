// ============================================
// MOCK DATA FOR ADMIN PORTAL
// ============================================

// Types
export interface AdminStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalClients: number;
  pendingKYC: number;
  approvedKYC: number;
  pendingProposals: number;
  pendingContracts: number;
  pendingInvoices: number;
  overdueInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface AdminProject {
  id: string;
  name: string;
  description: string;
  serviceCategory: string;
  status: "submitted" | "approved" | "matched" | "in-progress" | "completed" | "closed";
  phase: 1 | 2 | 3 | 4;
  phaseName: string;
  progress: number;
  tripartyId: string;
  tripartyName: string;
  tripartyType: "abdullah" | "spectrum";
  clientId: string | null;
  clientName: string | null;
  projectValue: number;
  startDate: string | null;
  expectedEndDate: string | null;
  createdAt: string;
}

export interface AdminClient {
  id: string;
  companyName: string;
  crNumber: string;
  country: string;
  city: string;
  signatoryName: string;
  signatoryEmail: string;
  signatoryPhone: string;
  kycStatus: "pending" | "submitted" | "in-review" | "approved" | "rejected";
  projectsCount: number;
  totalValue: number;
  createdAt: string;
  lastActivity: string;
}

export interface AdminKYCReview {
  id: string;
  clientId: string;
  clientName: string;
  companyName: string;
  documentType: string;
  documentName: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}

export interface AdminProposal {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  status: "draft" | "sent" | "viewed" | "approved" | "changes-requested" | "expired";
  totalFee: number;
  retainerFee: number;
  successFee: number;
  timeline: string;
  createdAt: string;
  sentAt: string | null;
  expiresAt: string | null;
  respondedAt: string | null;
}

export interface AdminContract {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  type: "nda" | "ncnda" | "consultancy" | "commission" | "triparty" | "sow";
  typeName: string;
  status: "draft" | "sent" | "pending" | "signed" | "active" | "completed" | "expired";
  sentAt: string | null;
  signedAt: string | null;
  expiresAt: string | null;
}

export interface AdminInvoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  type: "retainer" | "milestone" | "success-fee" | "final";
  typeName: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  status: "draft" | "sent" | "pending" | "paid" | "partially-paid" | "overdue";
  dueDate: string;
  issuedAt: string;
  paidAt: string | null;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client" | "triparty";
  companyName: string | null;
  status: "active" | "inactive" | "pending";
  lastLogin: string | null;
  createdAt: string;
}

export interface TriPartyPartner {
  id: string;
  name: string;
  type: "abdullah" | "spectrum";
  fullName: string;
  contactPerson: string;
  email: string;
  phone: string;
  activeProjects: number;
  completedProjects: number;
  status: "active" | "inactive";
}

// ============================================
// MOCK DATA
// ============================================

export const mockAdminStats: AdminStats = {
  totalProjects: 24,
  activeProjects: 8,
  completedProjects: 14,
  totalClients: 18,
  pendingKYC: 3,
  approvedKYC: 15,
  pendingProposals: 4,
  pendingContracts: 6,
  pendingInvoices: 5,
  overdueInvoices: 2,
  totalRevenue: 4850000,
  monthlyRevenue: 425000,
};

export const mockTriPartyPartners: TriPartyPartner[] = [
  {
    id: "tp-001",
    name: "Abdullah Law",
    type: "abdullah",
    fullName: "Abdullah Al-Rasheed Law Firm",
    contactPerson: "Abdullah Al-Rasheed",
    email: "abdullah@alrasheedlaw.com",
    phone: "+966 11 234 5678",
    activeProjects: 5,
    completedProjects: 12,
    status: "active",
  },
  {
    id: "tp-002",
    name: "Spectrum",
    type: "spectrum",
    fullName: "Spectrum Engineering Consultants",
    contactPerson: "Ahmed Hassan",
    email: "ahmed@spectrumeng.com",
    phone: "+966 11 345 6789",
    activeProjects: 3,
    completedProjects: 8,
    status: "active",
  },
];

export const mockAdminProjects: AdminProject[] = [
  {
    id: "proj-001",
    name: "Steel Import Facilitation - China",
    description: "Facilitation of steel import from Chinese manufacturers including supplier verification, quality inspection, and customs clearance.",
    serviceCategory: "Trading / Import-Export",
    status: "in-progress",
    phase: 3,
    phaseName: "Technical Execution",
    progress: 65,
    tripartyId: "tp-002",
    tripartyName: "Spectrum Engineering",
    tripartyType: "spectrum",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    projectValue: 2500000,
    startDate: "2024-11-20",
    expectedEndDate: "2025-02-28",
    createdAt: "2024-11-10T10:00:00Z",
  },
  {
    id: "proj-002",
    name: "Legal Compliance Review - GCC Expansion",
    description: "Comprehensive legal review and compliance assessment for expanding operations across GCC countries.",
    serviceCategory: "Legal & Licensing",
    status: "in-progress",
    phase: 2,
    phaseName: "Legal & Compliance",
    progress: 40,
    tripartyId: "tp-001",
    tripartyName: "Abdullah Al-Rasheed Law Firm",
    tripartyType: "abdullah",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    projectValue: 450000,
    startDate: "2024-12-01",
    expectedEndDate: "2025-03-15",
    createdAt: "2024-11-20T14:00:00Z",
  },
  {
    id: "proj-003",
    name: "Investor Matching - Real Estate",
    description: "Finding and matching suitable investors for a commercial real estate development project in Jeddah.",
    serviceCategory: "Investments",
    status: "matched",
    phase: 1,
    phaseName: "Due Diligence",
    progress: 15,
    tripartyId: "tp-001",
    tripartyName: "Abdullah Al-Rasheed Law Firm",
    tripartyType: "abdullah",
    clientId: "client-002",
    clientName: "Jeddah Development Corp",
    projectValue: 15000000,
    startDate: null,
    expectedEndDate: null,
    createdAt: "2024-12-05T09:00:00Z",
  },
  {
    id: "proj-004",
    name: "Construction Subcontractor Partnership",
    description: "Establishing partnerships with qualified subcontractors for a major infrastructure project.",
    serviceCategory: "Construction",
    status: "completed",
    phase: 4,
    phaseName: "Closing & Completion",
    progress: 100,
    tripartyId: "tp-002",
    tripartyName: "Spectrum Engineering",
    tripartyType: "spectrum",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    projectValue: 8750000,
    startDate: "2024-08-01",
    expectedEndDate: "2024-11-30",
    createdAt: "2024-07-15T11:00:00Z",
  },
  {
    id: "proj-005",
    name: "Medical Equipment Import License",
    description: "Obtaining import licenses for medical equipment from European manufacturers.",
    serviceCategory: "Healthcare & Medical",
    status: "submitted",
    phase: 1,
    phaseName: "Due Diligence",
    progress: 0,
    tripartyId: "tp-001",
    tripartyName: "Abdullah Al-Rasheed Law Firm",
    tripartyType: "abdullah",
    clientId: null,
    clientName: null,
    projectValue: 0,
    startDate: null,
    expectedEndDate: null,
    createdAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "proj-006",
    name: "Industrial Zone Development Permit",
    description: "Securing development permits for a new industrial zone in the Eastern Province.",
    serviceCategory: "Real Estate",
    status: "approved",
    phase: 1,
    phaseName: "Due Diligence",
    progress: 0,
    tripartyId: "tp-002",
    tripartyName: "Spectrum Engineering",
    tripartyType: "spectrum",
    clientId: null,
    clientName: null,
    projectValue: 0,
    startDate: null,
    expectedEndDate: null,
    createdAt: "2024-12-18T14:00:00Z",
  },
];

export const mockAdminClients: AdminClient[] = [
  {
    id: "client-001",
    companyName: "Al-Faisal Trading Company",
    crNumber: "1010567890",
    country: "Saudi Arabia",
    city: "Riyadh",
    signatoryName: "Mohammed Al-Faisal",
    signatoryEmail: "m.alfaisal@alfaisaltrading.com",
    signatoryPhone: "+966 50 123 4567",
    kycStatus: "approved",
    projectsCount: 3,
    totalValue: 11700000,
    createdAt: "2024-11-15T10:30:00Z",
    lastActivity: "2024-12-28T14:00:00Z",
  },
  {
    id: "client-002",
    companyName: "Jeddah Development Corp",
    crNumber: "4030123456",
    country: "Saudi Arabia",
    city: "Jeddah",
    signatoryName: "Khalid Al-Saud",
    signatoryEmail: "k.alsaud@jeddahdev.com",
    signatoryPhone: "+966 55 987 6543",
    kycStatus: "approved",
    projectsCount: 1,
    totalValue: 15000000,
    createdAt: "2024-12-01T09:00:00Z",
    lastActivity: "2024-12-27T11:00:00Z",
  },
  {
    id: "client-003",
    companyName: "Gulf Medical Supplies",
    crNumber: "1010789012",
    country: "Saudi Arabia",
    city: "Dammam",
    signatoryName: "Sara Al-Hamad",
    signatoryEmail: "s.alhamad@gulfmedical.com",
    signatoryPhone: "+966 50 456 7890",
    kycStatus: "in-review",
    projectsCount: 0,
    totalValue: 0,
    createdAt: "2024-12-20T14:00:00Z",
    lastActivity: "2024-12-26T16:00:00Z",
  },
  {
    id: "client-004",
    companyName: "Eastern Logistics LLC",
    crNumber: "2050345678",
    country: "Saudi Arabia",
    city: "Khobar",
    signatoryName: "Omar Al-Rashid",
    signatoryEmail: "o.alrashid@easternlog.com",
    signatoryPhone: "+966 55 321 9876",
    kycStatus: "pending",
    projectsCount: 0,
    totalValue: 0,
    createdAt: "2024-12-25T10:00:00Z",
    lastActivity: "2024-12-25T10:00:00Z",
  },
  {
    id: "client-005",
    companyName: "Riyadh Tech Solutions",
    crNumber: "1010456789",
    country: "Saudi Arabia",
    city: "Riyadh",
    signatoryName: "Fatima Al-Qahtani",
    signatoryEmail: "f.alqahtani@riyadhtech.com",
    signatoryPhone: "+966 50 654 3210",
    kycStatus: "submitted",
    projectsCount: 0,
    totalValue: 0,
    createdAt: "2024-12-22T11:00:00Z",
    lastActivity: "2024-12-24T09:00:00Z",
  },
];

export const mockKYCReviews: AdminKYCReview[] = [
  {
    id: "kyc-rev-001",
    clientId: "client-003",
    clientName: "Sara Al-Hamad",
    companyName: "Gulf Medical Supplies",
    documentType: "cr_license",
    documentName: "Commercial Registration",
    fileUrl: "/documents/gulf-medical-cr.pdf",
    status: "pending",
    submittedAt: "2024-12-26T10:00:00Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
  {
    id: "kyc-rev-002",
    clientId: "client-003",
    clientName: "Sara Al-Hamad",
    companyName: "Gulf Medical Supplies",
    documentType: "vat_certificate",
    documentName: "VAT Certificate",
    fileUrl: "/documents/gulf-medical-vat.pdf",
    status: "pending",
    submittedAt: "2024-12-26T10:05:00Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
  {
    id: "kyc-rev-003",
    clientId: "client-005",
    clientName: "Fatima Al-Qahtani",
    companyName: "Riyadh Tech Solutions",
    documentType: "cr_license",
    documentName: "Commercial Registration",
    fileUrl: "/documents/riyadh-tech-cr.pdf",
    status: "pending",
    submittedAt: "2024-12-24T09:00:00Z",
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: null,
  },
  {
    id: "kyc-rev-004",
    clientId: "client-001",
    clientName: "Mohammed Al-Faisal",
    companyName: "Al-Faisal Trading Company",
    documentType: "cr_license",
    documentName: "Commercial Registration",
    fileUrl: "/documents/alfaisal-cr.pdf",
    status: "approved",
    submittedAt: "2024-11-16T09:00:00Z",
    reviewedAt: "2024-11-17T14:30:00Z",
    reviewedBy: "Admin User",
    rejectionReason: null,
  },
];

export const mockAdminProposals: AdminProposal[] = [
  {
    id: "prop-001",
    projectId: "proj-003",
    projectName: "Investor Matching - Real Estate",
    clientId: "client-002",
    clientName: "Jeddah Development Corp",
    status: "sent",
    totalFee: 375000,
    retainerFee: 75000,
    successFee: 300000,
    timeline: "6 months",
    createdAt: "2024-12-10T10:00:00Z",
    sentAt: "2024-12-12T14:00:00Z",
    expiresAt: "2025-01-12T14:00:00Z",
    respondedAt: null,
  },
  {
    id: "prop-002",
    projectId: "proj-005",
    projectName: "Medical Equipment Import License",
    clientId: null,
    clientName: null,
    status: "draft",
    totalFee: 0,
    retainerFee: 0,
    successFee: 0,
    timeline: "",
    createdAt: "2024-12-22T11:00:00Z",
    sentAt: null,
    expiresAt: null,
    respondedAt: null,
  },
  {
    id: "prop-003",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    status: "approved",
    totalFee: 125000,
    retainerFee: 50000,
    successFee: 75000,
    timeline: "3 months",
    createdAt: "2024-11-12T10:00:00Z",
    sentAt: "2024-11-14T10:00:00Z",
    expiresAt: "2024-12-14T10:00:00Z",
    respondedAt: "2024-11-18T09:00:00Z",
  },
];

export const mockAdminContracts: AdminContract[] = [
  {
    id: "con-001",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "nda",
    typeName: "Non-Disclosure Agreement",
    status: "signed",
    sentAt: "2024-11-19T10:00:00Z",
    signedAt: "2024-11-19T14:00:00Z",
    expiresAt: "2025-11-19T14:00:00Z",
  },
  {
    id: "con-002",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "consultancy",
    typeName: "Consultancy Agreement",
    status: "active",
    sentAt: "2024-11-19T10:00:00Z",
    signedAt: "2024-11-20T11:00:00Z",
    expiresAt: null,
  },
  {
    id: "con-003",
    projectId: "proj-003",
    projectName: "Investor Matching - Real Estate",
    clientId: "client-002",
    clientName: "Jeddah Development Corp",
    type: "nda",
    typeName: "Non-Disclosure Agreement",
    status: "pending",
    sentAt: "2024-12-15T10:00:00Z",
    signedAt: null,
    expiresAt: null,
  },
  {
    id: "con-004",
    projectId: "proj-002",
    projectName: "Legal Compliance Review - GCC Expansion",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "consultancy",
    typeName: "Consultancy Agreement",
    status: "active",
    sentAt: "2024-11-28T10:00:00Z",
    signedAt: "2024-11-30T09:00:00Z",
    expiresAt: null,
  },
];

export const mockAdminInvoices: AdminInvoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-001",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "retainer",
    typeName: "Retainer Fee",
    amount: 50000,
    vatAmount: 7500,
    totalAmount: 57500,
    status: "paid",
    dueDate: "2024-11-25",
    issuedAt: "2024-11-20T10:00:00Z",
    paidAt: "2024-11-23T14:30:00Z",
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-002",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "milestone",
    typeName: "Milestone Payment - Phase 2",
    amount: 30000,
    vatAmount: 4500,
    totalAmount: 34500,
    status: "paid",
    dueDate: "2024-12-15",
    issuedAt: "2024-12-10T10:00:00Z",
    paidAt: "2024-12-14T11:00:00Z",
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-003",
    projectId: "proj-002",
    projectName: "Legal Compliance Review - GCC Expansion",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "retainer",
    typeName: "Retainer Fee",
    amount: 45000,
    vatAmount: 6750,
    totalAmount: 51750,
    status: "paid",
    dueDate: "2024-12-05",
    issuedAt: "2024-12-01T10:00:00Z",
    paidAt: "2024-12-04T09:00:00Z",
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-004",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    clientId: "client-001",
    clientName: "Al-Faisal Trading Company",
    type: "milestone",
    typeName: "Milestone Payment - Phase 3",
    amount: 35000,
    vatAmount: 5250,
    totalAmount: 40250,
    status: "pending",
    dueDate: "2025-01-15",
    issuedAt: "2024-12-20T10:00:00Z",
    paidAt: null,
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-005",
    projectId: "proj-003",
    projectName: "Investor Matching - Real Estate",
    clientId: "client-002",
    clientName: "Jeddah Development Corp",
    type: "retainer",
    typeName: "Retainer Fee",
    amount: 75000,
    vatAmount: 11250,
    totalAmount: 86250,
    status: "overdue",
    dueDate: "2024-12-20",
    issuedAt: "2024-12-10T10:00:00Z",
    paidAt: null,
  },
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: "user-001",
    name: "Admin User",
    email: "admin@legacyglobal.com",
    role: "admin",
    companyName: "Legacy Global",
    status: "active",
    lastLogin: "2024-12-30T08:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-002",
    name: "Mohammed Al-Faisal",
    email: "m.alfaisal@alfaisaltrading.com",
    role: "client",
    companyName: "Al-Faisal Trading Company",
    status: "active",
    lastLogin: "2024-12-28T14:00:00Z",
    createdAt: "2024-11-15T10:30:00Z",
  },
  {
    id: "user-003",
    name: "Khalid Al-Saud",
    email: "k.alsaud@jeddahdev.com",
    role: "client",
    companyName: "Jeddah Development Corp",
    status: "active",
    lastLogin: "2024-12-27T11:00:00Z",
    createdAt: "2024-12-01T09:00:00Z",
  },
  {
    id: "user-004",
    name: "Abdullah Al-Rasheed",
    email: "abdullah@alrasheedlaw.com",
    role: "triparty",
    companyName: "Abdullah Al-Rasheed Law Firm",
    status: "active",
    lastLogin: "2024-12-29T10:00:00Z",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "user-005",
    name: "Ahmed Hassan",
    email: "ahmed@spectrumeng.com",
    role: "triparty",
    companyName: "Spectrum Engineering Consultants",
    status: "active",
    lastLogin: "2024-12-28T16:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
  },
];

// Service categories for projects
export const serviceCategories = [
  "Trading / Import-Export",
  "Legal & Licensing",
  "Investments",
  "Construction",
  "Healthcare & Medical",
  "Real Estate",
  "Technology",
  "Manufacturing",
  "Energy & Utilities",
  "Hospitality",
];

// Dashboard quick stats for cards
export const mockDashboardStats = {
  projects: {
    total: 24,
    active: 8,
    pending: 2,
    completed: 14,
  },
  clients: {
    total: 18,
    active: 15,
    pendingKYC: 3,
  },
  revenue: {
    total: 4850000,
    thisMonth: 425000,
    pending: 126500,
    overdue: 86250,
  },
  tasks: {
    pending: 12,
    overdue: 3,
    completed: 45,
  },
};
