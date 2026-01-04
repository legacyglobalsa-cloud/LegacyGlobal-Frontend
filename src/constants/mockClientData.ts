// ============================================
// MOCK DATA FOR CLIENT PORTAL
// ============================================

// Types
export interface ClientCompany {
  id: string;
  name: string;
  crNumber: string;
  registrationNumber: string;
  vatNumber: string;
  country: string;
  city: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  businessCategory: string;
  industry: string;
  signatory: {
    name: string;
    idNumber: string;
    email: string;
    phone: string;
  };
  kycStatus: "pending" | "submitted" | "in-review" | "approved" | "rejected";
  createdAt: string;
}

export interface KYCDocument {
  id: string;
  type: "cr_license" | "vat_certificate" | "signatory_id" | "bank_letter" | "company_profile" | "proof_of_address" | "source_of_funds";
  name: string;
  fileName: string;
  fileSize: string;
  status: "pending" | "uploaded" | "approved" | "rejected";
  uploadedAt: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  serviceCategory: string;
  status: "matched" | "kyc-pending" | "proposal-sent" | "in-progress" | "completed" | "closed";
  phase: 1 | 2 | 3 | 4;
  phaseName: string;
  progress: number;
  startDate: string;
  expectedEndDate: string;
  tripartyPartner: string;
  projectValue: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  projectName: string;
  status: "pending" | "viewed" | "approved" | "changes-requested";
  scope: string;
  totalFee: string;
  retainerFee: string;
  successFee: string;
  timeline: string;
  phases: {
    name: string;
    duration: string;
    deliverables: string[];
  }[];
  sentAt: string;
  expiresAt: string;
}

export interface Contract {
  id: string;
  projectId: string;
  projectName: string;
  type: "nda" | "ncnda" | "consultancy" | "commission" | "triparty" | "sow";
  typeName: string;
  status: "pending" | "sent" | "signed" | "active" | "completed";
  sentAt: string;
  signedAt: string | null;
  expiresAt: string | null;
  fileUrl: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  type: "retainer" | "milestone" | "success-fee" | "final";
  typeName: string;
  description: string;
  amount: number;
  vatAmount: number;
  totalAmount: number;
  currency: string;
  status: "draft" | "sent" | "pending" | "paid" | "partially-paid" | "overdue";
  dueDate: string;
  issuedAt: string;
  paidAt: string | null;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  type: "report" | "certificate" | "contract" | "proposal" | "other";
  category: "legal" | "compliance" | "report" | "financial" | "certification";
  size: number;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  description: string;
  phase: number;
  createdAt: string;
  createdBy: string;
}

// ============================================
// MOCK DATA
// ============================================

export const mockClientCompany: ClientCompany = {
  id: "client-001",
  name: "Al-Faisal Trading Company",
  crNumber: "1010567890",
  registrationNumber: "CR-1010567890",
  vatNumber: "310456789012345",
  country: "Saudi Arabia",
  city: "Riyadh",
  address: "King Fahd Road, Building 45, 3rd Floor",
  website: "www.alfaisaltrading.com",
  email: "info@alfaisaltrading.com",
  phone: "+966 11 456 7890",
  businessCategory: "Trading",
  industry: "Trading & Import/Export",
  signatory: {
    name: "Mohammed Al-Faisal",
    idNumber: "1087654321",
    email: "m.alfaisal@alfaisaltrading.com",
    phone: "+966 50 123 4567",
  },
  kycStatus: "approved",
  createdAt: "2024-11-15T10:30:00Z",
};

export const mockKYCDocuments: KYCDocument[] = [
  {
    id: "kyc-001",
    type: "cr_license",
    name: "Commercial Registration / Trade License",
    fileName: "CR_License_AlFaisal.pdf",
    fileSize: "2.4 MB",
    status: "approved",
    uploadedAt: "2024-11-16T09:00:00Z",
    reviewedAt: "2024-11-17T14:30:00Z",
    rejectionReason: null,
  },
  {
    id: "kyc-002",
    type: "vat_certificate",
    name: "VAT Certificate",
    fileName: "VAT_Certificate_AlFaisal.pdf",
    fileSize: "1.2 MB",
    status: "approved",
    uploadedAt: "2024-11-16T09:15:00Z",
    reviewedAt: "2024-11-17T14:35:00Z",
    rejectionReason: null,
  },
  {
    id: "kyc-003",
    type: "signatory_id",
    name: "Authorized Signatory ID",
    fileName: "ID_Mohammed_AlFaisal.pdf",
    fileSize: "856 KB",
    status: "approved",
    uploadedAt: "2024-11-16T09:20:00Z",
    reviewedAt: "2024-11-17T14:40:00Z",
    rejectionReason: null,
  },
  {
    id: "kyc-004",
    type: "bank_letter",
    name: "Bank Letter / Company Profile",
    fileName: "Bank_Letter_AlFaisal.pdf",
    fileSize: "1.8 MB",
    status: "approved",
    uploadedAt: "2024-11-16T09:30:00Z",
    reviewedAt: "2024-11-17T14:45:00Z",
    rejectionReason: null,
  },
  {
    id: "kyc-005",
    type: "proof_of_address",
    name: "Proof of Address",
    fileName: "Address_Proof_AlFaisal.pdf",
    fileSize: "1.1 MB",
    status: "approved",
    uploadedAt: "2024-11-16T09:35:00Z",
    reviewedAt: "2024-11-17T14:50:00Z",
    rejectionReason: null,
  },
  {
    id: "kyc-006",
    type: "source_of_funds",
    name: "Source of Funds Declaration",
    fileName: null as unknown as string,
    fileSize: "",
    status: "pending",
    uploadedAt: null,
    reviewedAt: null,
    rejectionReason: null,
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    name: "Steel Import Facilitation - China",
    description: "Facilitation of steel import from Chinese manufacturers including supplier verification, quality inspection, and customs clearance.",
    serviceCategory: "Trading / Import-Export",
    status: "in-progress",
    phase: 3,
    phaseName: "Technical Execution",
    progress: 65,
    startDate: "2024-11-20",
    expectedEndDate: "2025-02-28",
    tripartyPartner: "Spectrum Engineering",
    projectValue: "SAR 2,500,000",
    createdAt: "2024-11-18T10:00:00Z",
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
    startDate: "2024-12-01",
    expectedEndDate: "2025-03-15",
    tripartyPartner: "Abdullah Al-Rasheed Law Firm",
    projectValue: "SAR 450,000",
    createdAt: "2024-11-25T14:00:00Z",
  },
  {
    id: "proj-003",
    name: "Investor Matching - Real Estate",
    description: "Finding and matching suitable investors for a commercial real estate development project in Jeddah.",
    serviceCategory: "Investments",
    status: "proposal-sent",
    phase: 1,
    phaseName: "Due Diligence",
    progress: 15,
    startDate: "2024-12-15",
    expectedEndDate: "2025-06-30",
    tripartyPartner: "Abdullah Al-Rasheed Law Firm",
    projectValue: "SAR 15,000,000",
    createdAt: "2024-12-10T09:00:00Z",
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
    startDate: "2024-08-01",
    expectedEndDate: "2024-11-30",
    tripartyPartner: "Spectrum Engineering",
    projectValue: "SAR 8,750,000",
    createdAt: "2024-07-20T11:00:00Z",
  },
];

export const mockProposals: Proposal[] = [
  {
    id: "prop-001",
    projectId: "proj-003",
    projectName: "Investor Matching - Real Estate",
    status: "pending",
    scope: "Legacy Global will facilitate the identification, screening, and introduction of qualified investors for the commercial real estate development project. This includes due diligence on potential investors, coordination of meetings, and support through the investment negotiation process.",
    totalFee: "SAR 375,000",
    retainerFee: "SAR 75,000",
    successFee: "SAR 300,000 (2% of investment secured)",
    timeline: "6 months",
    phases: [
      {
        name: "Phase 1: Due Diligence & Investor Profiling",
        duration: "4 weeks",
        deliverables: [
          "Project investment memorandum",
          "Target investor profile",
          "Initial investor shortlist (10-15 prospects)",
        ],
      },
      {
        name: "Phase 2: Investor Outreach & Screening",
        duration: "8 weeks",
        deliverables: [
          "Investor approach strategy",
          "Qualified investor shortlist (5-7 prospects)",
          "Initial interest confirmations",
        ],
      },
      {
        name: "Phase 3: Negotiation Support",
        duration: "8 weeks",
        deliverables: [
          "Meeting coordination",
          "Term sheet negotiation support",
          "Due diligence facilitation",
        ],
      },
      {
        name: "Phase 4: Closing",
        duration: "4 weeks",
        deliverables: [
          "Final documentation review",
          "Closing coordination",
          "Post-closing handover",
        ],
      },
    ],
    sentAt: "2024-12-12T10:00:00Z",
    expiresAt: "2024-12-26T23:59:59Z",
  },
];

export const mockContracts: Contract[] = [
  {
    id: "cont-001",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    type: "nda",
    typeName: "Non-Disclosure Agreement",
    status: "signed",
    sentAt: "2024-11-18T10:00:00Z",
    signedAt: "2024-11-18T15:30:00Z",
    expiresAt: "2025-11-18T23:59:59Z",
    fileUrl: "/contracts/nda-proj-001.pdf",
  },
  {
    id: "cont-002",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    type: "consultancy",
    typeName: "Consultancy Agreement",
    status: "signed",
    sentAt: "2024-11-19T09:00:00Z",
    signedAt: "2024-11-19T14:00:00Z",
    expiresAt: null,
    fileUrl: "/contracts/consultancy-proj-001.pdf",
  },
  {
    id: "cont-003",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    type: "triparty",
    typeName: "Tri-Party Agreement",
    status: "signed",
    sentAt: "2024-11-19T09:00:00Z",
    signedAt: "2024-11-20T11:00:00Z",
    expiresAt: null,
    fileUrl: "/contracts/triparty-proj-001.pdf",
  },
  {
    id: "cont-004",
    projectId: "proj-002",
    projectName: "Legal Compliance Review - GCC Expansion",
    type: "ncnda",
    typeName: "Non-Circumvention Non-Disclosure Agreement",
    status: "signed",
    sentAt: "2024-11-28T10:00:00Z",
    signedAt: "2024-11-28T16:00:00Z",
    expiresAt: "2026-11-28T23:59:59Z",
    fileUrl: "/contracts/ncnda-proj-002.pdf",
  },
  {
    id: "cont-005",
    projectId: "proj-002",
    projectName: "Legal Compliance Review - GCC Expansion",
    type: "consultancy",
    typeName: "Consultancy Agreement",
    status: "signed",
    sentAt: "2024-11-29T09:00:00Z",
    signedAt: "2024-11-30T10:00:00Z",
    expiresAt: null,
    fileUrl: "/contracts/consultancy-proj-002.pdf",
  },
  {
    id: "cont-006",
    projectId: "proj-003",
    projectName: "Investor Matching - Real Estate",
    type: "nda",
    typeName: "Non-Disclosure Agreement",
    status: "pending",
    sentAt: "2024-12-12T10:00:00Z",
    signedAt: null,
    expiresAt: null,
    fileUrl: "/contracts/nda-proj-003.pdf",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-001",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    type: "retainer",
    typeName: "Retainer Fee",
    description: "Initial retainer fee for project kickoff",
    amount: 50000,
    vatAmount: 7500,
    totalAmount: 57500,
    currency: "SAR",
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
    type: "milestone",
    typeName: "Milestone Payment - Phase 2",
    description: "Payment upon completion of Phase 2 - Legal & Compliance",
    amount: 30000,
    vatAmount: 4500,
    totalAmount: 34500,
    currency: "SAR",
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
    type: "retainer",
    typeName: "Retainer Fee",
    description: "Initial retainer fee for legal compliance review",
    amount: 45000,
    vatAmount: 6750,
    totalAmount: 51750,
    currency: "SAR",
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
    type: "milestone",
    typeName: "Milestone Payment - Phase 3",
    description: "Payment upon completion of Phase 3 - Technical Execution",
    amount: 35000,
    vatAmount: 5250,
    totalAmount: 40250,
    currency: "SAR",
    status: "pending",
    dueDate: "2025-01-15",
    issuedAt: "2024-12-20T10:00:00Z",
    paidAt: null,
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-005",
    projectId: "proj-004",
    projectName: "Construction Subcontractor Partnership",
    type: "success-fee",
    typeName: "Success Fee",
    description: "Success fee upon project completion",
    amount: 175000,
    vatAmount: 26250,
    totalAmount: 201250,
    currency: "SAR",
    status: "paid",
    dueDate: "2024-12-10",
    issuedAt: "2024-11-30T10:00:00Z",
    paidAt: "2024-12-08T16:00:00Z",
  },
];

export const mockDocuments: ProjectDocument[] = [
  {
    id: "doc-001",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    name: "Supplier Due Diligence Report.pdf",
    type: "report",
    category: "compliance",
    size: 3355443,
    fileSize: "3.2 MB",
    uploadedBy: "Spectrum Engineering",
    uploadedAt: "2024-12-05T10:00:00Z",
    downloadUrl: "/documents/supplier-dd-report.pdf",
  },
  {
    id: "doc-002",
    projectId: "proj-001",
    projectName: "Steel Import Facilitation - China",
    name: "Quality Inspection Certificate.pdf",
    type: "certificate",
    category: "certification",
    size: 1887436,
    fileSize: "1.8 MB",
    uploadedBy: "Spectrum Engineering",
    uploadedAt: "2024-12-18T14:00:00Z",
    downloadUrl: "/documents/quality-cert.pdf",
  },
  {
    id: "doc-003",
    projectId: "proj-002",
    projectName: "Legal Compliance Review - GCC Expansion",
    name: "GCC Regulatory Framework Analysis.pdf",
    type: "report",
    category: "legal",
    size: 5662310,
    fileSize: "5.4 MB",
    uploadedBy: "Abdullah Al-Rasheed Law Firm",
    uploadedAt: "2024-12-15T11:00:00Z",
    downloadUrl: "/documents/gcc-regulatory-analysis.pdf",
  },
  {
    id: "doc-004",
    projectId: "proj-004",
    projectName: "Construction Subcontractor Partnership",
    name: "Project Completion Certificate.pdf",
    type: "certificate",
    category: "certification",
    size: 911360,
    fileSize: "890 KB",
    uploadedBy: "Legacy Global",
    uploadedAt: "2024-11-30T16:00:00Z",
    downloadUrl: "/documents/completion-cert.pdf",
  },
  {
    id: "doc-005",
    projectId: "proj-004",
    projectName: "Construction Subcontractor Partnership",
    name: "Final Project Report.pdf",
    type: "report",
    category: "report",
    size: 8598323,
    fileSize: "8.2 MB",
    uploadedBy: "Legacy Global",
    uploadedAt: "2024-11-30T16:30:00Z",
    downloadUrl: "/documents/final-report.pdf",
  },
];

export const mockProjectUpdates: ProjectUpdate[] = [
  {
    id: "upd-001",
    projectId: "proj-001",
    title: "Supplier verification completed",
    description: "All three shortlisted suppliers have passed the verification process. Moving forward with quotation requests.",
    phase: 2,
    createdAt: "2024-12-01T10:00:00Z",
    createdBy: "Spectrum Engineering",
  },
  {
    id: "upd-002",
    projectId: "proj-001",
    title: "Quality inspection scheduled",
    description: "Factory inspection visit scheduled for December 20, 2024. Our technical team will conduct on-site quality assessment.",
    phase: 3,
    createdAt: "2024-12-15T09:00:00Z",
    createdBy: "Spectrum Engineering",
  },
  {
    id: "upd-003",
    projectId: "proj-001",
    title: "Quality inspection completed successfully",
    description: "Factory inspection completed. All quality parameters meet the required standards. Proceeding with contract negotiation.",
    phase: 3,
    createdAt: "2024-12-22T16:00:00Z",
    createdBy: "Spectrum Engineering",
  },
  {
    id: "upd-004",
    projectId: "proj-002",
    title: "Initial compliance assessment completed",
    description: "Completed initial review of current compliance status. Identified 5 areas requiring attention for GCC expansion.",
    phase: 2,
    createdAt: "2024-12-10T11:00:00Z",
    createdBy: "Abdullah Al-Rasheed Law Firm",
  },
  {
    id: "upd-005",
    projectId: "proj-002",
    title: "UAE regulatory requirements documented",
    description: "Completed documentation of all regulatory requirements for UAE market entry. Report uploaded to documents section.",
    phase: 2,
    createdAt: "2024-12-20T14:00:00Z",
    createdBy: "Abdullah Al-Rasheed Law Firm",
  },
];

// Service categories for project intake
export const serviceCategories = [
  "Trading / Import-Export",
  "Construction",
  "Entertainment",
  "Legal & Licensing",
  "Recruitment",
  "Real Estate",
  "Investments",
  "Technology",
  "Manufacturing",
  "Consulting",
  "Other",
];

// Engagement models for project intake
export const engagementModels = [
  { value: "consultancy", label: "Consultancy Fee" },
  { value: "retainer", label: "Retainer + Milestones" },
  { value: "success", label: "Success-Based Commission" },
  { value: "mixed", label: "Mixed Model" },
];

// Urgency options for project intake
export const urgencyOptions = [
  { value: "immediate", label: "Immediate (Within 2 weeks)" },
  { value: "30-days", label: "Standard (30 days)" },
  { value: "90-days", label: "Flexible (90 days)" },
];

// Confidentiality levels for project intake
export const confidentialityLevels = [
  { value: "standard", label: "Standard" },
  { value: "strict", label: "Strict (Enhanced NDA Required)" },
];

// Dashboard stats
export const mockDashboardStats = {
  activeProjects: 2,
  pendingActions: 3,
  documentsToSign: 1,
  pendingInvoices: 1,
  totalProjectValue: "SAR 17,950,000",
  completedProjects: 1,
};
