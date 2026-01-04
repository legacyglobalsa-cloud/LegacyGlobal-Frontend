
# LegacyGlobal System Architecture & Flow Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [User Roles & Access](#user-roles--access)
3. [System Architecture Diagram](#system-architecture-diagram)
4. [Portal Flow Charts](#portal-flow-charts)
5. [Project Lifecycle Flow](#project-lifecycle-flow)
6. [Data Flow Diagram](#data-flow-diagram)
7. [Email Automation Flow](#email-automation-flow)
8. [Page Connections Map](#page-connections-map)

---

## System Overview

LegacyGlobal operates as a **middleman/facilitator** connecting:
- **Tri-Party Partners** (Abdullah Law Firm & Spectrum Engineering) who have projects
- **Clients** who need services
- **Admin (Legacy)** who manages the matching and execution

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEGACYGLOBAL ECOSYSTEM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐         ┌──────────────┐         ┌──────────────┐       │
│   │  TRI-PARTY   │         │    ADMIN     │         │    CLIENT    │       │
│   │   PARTNERS   │◄───────►│   (LEGACY)   │◄───────►│              │       │
│   │              │         │              │         │              │       │
│   │ • Abdullah   │         │ • Manages    │         │ • Registers  │       │
│   │   Law Firm   │         │   Projects   │         │ • Submits    │       │
│   │ • Spectrum   │         │ • Matches    │         │   KYC        │       │
│   │   Engineering│         │   Clients    │         │ • Signs      │       │
│   │              │         │ • Oversees   │         │   Contracts  │       │
│   │ Submit       │         │   Execution  │         │ • Tracks     │       │
│   │ Projects     │         │              │         │   Progress   │       │
│   └──────────────┘         └──────────────┘         └──────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## User Roles & Access

### Role Hierarchy

```
                    ┌─────────────────┐
                    │      ADMIN      │
                    │    (Legacy)     │
                    │                 │
                    │ FULL ACCESS TO  │
                    │ ALL PORTALS &   │
                    │ ALL DATA        │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                                 │
            ▼                                 ▼
    ┌───────────────┐                 ┌───────────────┐
    │   TRI-PARTY   │                 │    CLIENT     │
    │               │                 │               │
    │ • Own Projects│                 │ • Own Profile │
    │ • Assigned    │                 │ • Assigned    │
    │   Tasks       │                 │   Projects    │
    │ • Client Docs │                 │ • Own Docs    │
    │   (Read-only) │                 │ • Invoices    │
    └───────────────┘                 └───────────────┘
```

### Access Matrix

| Feature | Admin | Tri-Party | Client |
|---------|:-----:|:---------:|:------:|
| Dashboard Overview | ✅ | ✅ | ✅ |
| Submit New Project | ❌ | ✅ | ❌ |
| View All Projects | ✅ | Own Only | Assigned Only |
| Manage Clients | ✅ | ❌ | ❌ |
| KYC Review/Approve | ✅ | ❌ | ❌ |
| Upload KYC | ❌ | ❌ | ✅ |
| Generate Proposals | ✅ | ❌ | ❌ |
| View/Approve Proposals | ✅ | ❌ | ✅ |
| Create Contracts | ✅ | ❌ | ❌ |
| Sign Contracts | ❌ | ❌ | ✅ |
| Generate Invoices | ✅ | ❌ | ❌ |
| View Invoices | ✅ | Own Only | Own Only |
| Manage Users | ✅ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ |

---

## System Architecture Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                  │
│                           (React + TypeScript)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  PUBLIC WEBSITE │  │   AUTH PAGES    │  │   DASHBOARDS    │             │
│  │                 │  │                 │  │                 │             │
│  │ • Home          │  │ • Login         │  │ • Admin Portal  │             │
│  │ • About         │  │ • Signup        │  │ • Client Portal │             │
│  │ • Services      │  │ • OTP           │  │ • TriParty      │             │
│  │ • Partnership   │  │                 │  │   Portal        │             │
│  │ • Subsidiaries  │  │                 │  │                 │             │
│  │ • Contact       │  │                 │  │                 │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
│                    ┌───────────▼───────────┐                               │
│                    │     React Router      │                               │
│                    │   (App.tsx Routes)    │                               │
│                    └───────────┬───────────┘                               │
│                                │                                            │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      API LAYER          │
                    │   (To be implemented)   │
                    │                         │
                    │  • REST API Endpoints   │
                    │  • Authentication       │
                    │  • File Upload          │
                    │  • Email Service        │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    BACKEND LAYER        │
                    │   (To be implemented)   │
                    │                         │
                    │  • Node.js / Express    │
                    │  • Business Logic       │
                    │  • Validation           │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│    DATABASE     │  │  FILE STORAGE   │  │  EMAIL SERVICE  │
│   (PostgreSQL)  │  │   (AWS S3 or    │  │   (SendGrid/    │
│                 │  │   similar)      │  │   Nodemailer)   │
│ • Users         │  │                 │  │                 │
│ • Projects      │  │ • KYC Documents │  │ • Notifications │
│ • Contracts     │  │ • Contracts     │  │ • Reminders     │
│ • Invoices      │  │ • Reports       │  │ • Updates       │
│ • Documents     │  │ • Invoices      │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Frontend Component Architecture

```
src/
├── components/
│   ├── HomePage/
│   │   ├── Navigation.tsx      ─────► Public site navigation
│   │   └── Footer.tsx          ─────► Public site footer
│   │
│   ├── Auth/
│   │   ├── Login.tsx           ─────► User login
│   │   ├── SignUp.tsx          ─────► User registration
│   │   └── Otp.tsx             ─────► OTP verification
│   │
│   ├── Admin/
│   │   ├── AdminDashboard.tsx  ─────► Main admin layout
│   │   └── pages/
│   │       ├── Overview.tsx
│   │       ├── Projects.tsx
│   │       ├── Clients.tsx
│   │       ├── KYCReview.tsx
│   │       ├── Proposals.tsx
│   │       ├── Contracts.tsx
│   │       ├── Invoices.tsx
│   │       ├── Reports.tsx
│   │       ├── Users.tsx
│   │       └── Settings.tsx
│   │
│   ├── Client/
│   │   ├── ClientDashboard.tsx ─────► Main client layout
│   │   └── pages/
│   │       ├── Overview.tsx
│   │       ├── Profile.tsx
│   │       ├── KYCUpload.tsx
│   │       ├── ProjectIntake.tsx
│   │       ├── MyProjects.tsx
│   │       ├── Proposals.tsx
│   │       ├── Contracts.tsx
│   │       ├── Documents.tsx
│   │       ├── Invoices.tsx
│   │       ├── Reports.tsx
│   │       └── Settings.tsx
│   │
│   ├── TriParty/
│   │   ├── TriPartyDashboard.tsx ───► Main tri-party layout
│   │   └── pages/
│   │       ├── Overview.tsx
│   │       ├── SubmitProject.tsx
│   │       ├── MyProjects.tsx
│   │       ├── Tasks.tsx
│   │       ├── ClientFiles.tsx
│   │       ├── Updates.tsx
│   │       ├── Invoices.tsx
│   │       └── Settings.tsx
│   │
│   ├── ui/                     ─────► shadcn/ui components
│   └── app-sidebar.tsx         ─────► Role-based sidebar
│
├── constants/
│   └── sidebarConfig.ts        ─────► Sidebar navigation configs
│
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   ├── Partnership.tsx
│   ├── SubsidiaryCompanies.tsx
│   ├── Contact.tsx
│   └── NotFound.tsx
│
└── App.tsx                     ─────► Main router configuration
```

---

## Portal Flow Charts

### Admin Portal Flow

```
                            ┌─────────────────┐
                            │  ADMIN LOGIN    │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    DASHBOARD    │
                            │    OVERVIEW     │
                            └────────┬────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│   PROJECT     │          │    CLIENT     │          │    INVOICE    │
│  MANAGEMENT   │          │  MANAGEMENT   │          │  MANAGEMENT   │
├───────────────┤          ├───────────────┤          ├───────────────┤
│               │          │               │          │               │
│ • View all    │          │ • View all    │          │ • Generate    │
│   projects    │          │   clients     │          │   invoices    │
│ • Assign      │          │ • Review KYC  │          │ • Track       │
│   clients     │          │ • Approve/    │          │   payments    │
│ • Update      │          │   Reject      │          │ • Send        │
│   status      │          │ • Assign to   │          │   reminders   │
│               │          │   projects    │          │               │
└───────┬───────┘          └───────┬───────┘          └───────────────┘
        │                          │
        │                          ▼
        │                  ┌───────────────┐
        │                  │   PROPOSAL    │
        │                  │  GENERATION   │
        │                  ├───────────────┤
        │                  │ • Create from │
        │                  │   template    │
        │                  │ • Send to     │
        │                  │   client      │
        │                  │ • Track       │
        │                  │   approval    │
        │                  └───────┬───────┘
        │                          │
        └──────────────┬───────────┘
                       │
                       ▼
               ┌───────────────┐
               │   CONTRACT    │
               │  MANAGEMENT   │
               ├───────────────┤
               │ • Generate    │
               │   contracts   │
               │ • Send for    │
               │   signature   │
               │ • Store       │
               │   signed docs │
               └───────────────┘
```

### Client Portal Flow

```
                            ┌─────────────────┐
                            │  CLIENT LOGIN   │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    DASHBOARD    │
                            │    OVERVIEW     │
                            └────────┬────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│ COMPANY PROFILE │        │   KYC UPLOAD    │        │ PROJECT INTAKE  │
│     SETUP       │        │                 │        │                 │
├─────────────────┤        ├─────────────────┤        ├─────────────────┤
│ • Company info  │        │ • Upload docs   │        │ • Select        │
│ • CR number     │───────►│ • CR/Trade      │───────►│   service       │
│ • VAT number    │        │   license       │        │ • Define scope  │
│ • Signatory     │        │ • VAT cert      │        │ • Set timeline  │
│   details       │        │ • ID docs       │        │ • Confidentiality│
│ • Contact info  │        │ • Bank letter   │        │   level         │
└─────────────────┘        └────────┬────────┘        └────────┬────────┘
                                    │                          │
                                    ▼                          │
                           ┌─────────────────┐                 │
                           │  WAITING FOR    │                 │
                           │  KYC APPROVAL   │                 │
                           └────────┬────────┘                 │
                                    │                          │
                                    │◄─────────────────────────┘
                                    ▼
                           ┌─────────────────┐
                           │ VIEW PROPOSAL   │
                           ├─────────────────┤
                           │ • Review scope  │
                           │ • Review fees   │
                           │ • Approve or    │
                           │   Request       │
                           │   Changes       │
                           └────────┬────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
           ┌───────────────┐               ┌───────────────┐
           │   APPROVED    │               │    CHANGES    │
           │               │               │   REQUESTED   │
           └───────┬───────┘               └───────┬───────┘
                   │                               │
                   │                               │
                   ▼                               │
           ┌───────────────┐                       │
           │ SIGN CONTRACT │◄──────────────────────┘
           │               │       (After revision)
           ├───────────────┤
           │ • NDA         │
           │ • Consultancy │
           │ • Commission  │
           │ • Tri-party   │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ PROJECT       │
           │ TRACKING      │
           ├───────────────┤
           │ • Phase 1: DD │
           │ • Phase 2:    │
           │   Legal       │
           │ • Phase 3:    │
           │   Technical   │
           │ • Phase 4:    │
           │   Closing     │
           └───────┬───────┘
                   │
                   ▼
           ┌───────────────┐
           │ VIEW INVOICES │
           │ & REPORTS     │
           └───────────────┘
```

### Tri-Party Portal Flow

```
                            ┌─────────────────┐
                            │ TRI-PARTY LOGIN │
                            │ (Abdullah/      │
                            │  Spectrum)      │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │    DASHBOARD    │
                            │    OVERVIEW     │
                            └────────┬────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
     ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
     │ SUBMIT PROJECT  │    │   MY PROJECTS   │    │  ASSIGNED TASKS │
     ├─────────────────┤    ├─────────────────┤    ├─────────────────┤
     │ • Project name  │    │ • View all my   │    │ • Legal tasks   │
     │ • Description   │    │   submitted     │    │   (Abdullah)    │
     │ • Requirements  │    │   projects      │    │ • Technical     │
     │ • Timeline      │    │ • Track status  │    │   tasks         │
     │ • Budget range  │    │ • View assigned │    │   (Spectrum)    │
     │ • Category      │    │   client        │    │ • Deadlines     │
     └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
              │                      │                      │
              │                      │                      │
              ▼                      ▼                      ▼
     ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
     │ WAITING FOR     │    │  CLIENT FILES   │    │ SUBMIT UPDATES  │
     │ ADMIN REVIEW    │    │  (READ-ONLY)    │    │                 │
     │                 │    ├─────────────────┤    ├─────────────────┤
     │ Status:         │    │ • View KYC docs │    │ • Progress      │
     │ • Submitted     │    │ • View signed   │    │   notes         │
     │ • Approved      │    │   contracts     │    │ • Upload        │
     │ • Matched       │    │ • Project files │    │   deliverables  │
     │ • In Progress   │    │                 │    │ • Mark tasks    │
     │ • Completed     │    │                 │    │   complete      │
     └─────────────────┘    └─────────────────┘    └─────────────────┘
                                                           │
                                                           ▼
                                                   ┌─────────────────┐
                                                   │ VIEW INVOICES   │
                                                   │                 │
                                                   │ • Invoices from │
                                                   │   Legacy        │
                                                   │ • Payment       │
                                                   │   status        │
                                                   └─────────────────┘
```

---

## Project Lifecycle Flow

### Complete Project Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROJECT LIFECYCLE FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 0: PROJECT ORIGIN
═══════════════════════

    ┌──────────────────┐
    │    TRI-PARTY     │
    │    SUBMITS       │
    │    PROJECT       │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  ADMIN REVIEWS   │────────►│  PROJECT POOL    │
    │  & APPROVES      │         │  (Available for  │
    └──────────────────┘         │   matching)      │
                                 └────────┬─────────┘
                                          │
═══════════════════════════════════════════════════════════════════════════════

PHASE 1: CLIENT REGISTRATION & KYC
═══════════════════════════════════

    ┌──────────────────┐
    │  CLIENT VISITS   │
    │  WEBSITE         │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  REGISTERS /     │────────►│  📧 WELCOME      │
    │  APPLIES         │         │  EMAIL SENT      │
    └────────┬─────────┘         └──────────────────┘
             │
             ▼
    ┌──────────────────┐
    │  COMPANY PROFILE │
    │  SETUP           │
    │  • Company info  │
    │  • CR number     │
    │  • Signatory     │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐         ┌──────────────────┐
    │  UPLOADS KYC     │────────►│  📧 KYC RECEIVED │
    │  DOCUMENTS       │         │  (to Admin)      │
    └────────┬─────────┘         └──────────────────┘
             │
             ▼
    ┌──────────────────┐
    │  ADMIN REVIEWS   │
    │  KYC             │
    └────────┬─────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
┌──────────┐  ┌──────────┐
│ APPROVED │  │ REJECTED │
│          │  │          │
│ 📧 Email │  │ 📧 Email │
│ to Client│  │ with     │
│          │  │ reasons  │
└────┬─────┘  └────┬─────┘
     │             │
     │             └──────────────► (Client re-uploads)
     │
═══════════════════════════════════════════════════════════════════════════════

PHASE 2: MATCHING & PROPOSAL
════════════════════════════

     │
     ▼
┌──────────────────┐
│  ADMIN MATCHES   │
│  CLIENT TO       │
│  TRI-PARTY       │
│  PROJECT         │
└────────┬─────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│ 📧 CLIENT        │      │ 📧 TRI-PARTY     │
│ NOTIFIED OF      │      │ NOTIFIED OF      │
│ PROJECT MATCH    │      │ CLIENT MATCH     │
└────────┬─────────┘      └──────────────────┘
         │
         ▼
┌──────────────────┐
│  ADMIN CREATES   │
│  PROPOSAL        │
│  • Scope         │
│  • Fees          │
│  • Timeline      │
│  • Phases        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│  PROPOSAL SENT   │────────►│  📧 PROPOSAL     │
│  TO CLIENT       │         │  READY EMAIL     │
└────────┬─────────┘         └──────────────────┘
         │
         ▼
┌──────────────────┐
│  CLIENT REVIEWS  │
│  PROPOSAL        │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│APPROVE │ │  REQUEST   │
│        │ │  CHANGES   │
│        │ │            │
│        │ │ 📧 to Admin│
└───┬────┘ └─────┬──────┘
    │            │
    │            └───────────► (Admin revises)
    │
═══════════════════════════════════════════════════════════════════════════════

PHASE 3: CONTRACT SIGNING
═════════════════════════

    │
    ▼
┌──────────────────┐
│  ADMIN GENERATES │
│  CONTRACTS       │
│  • NDA/NCNDA     │
│  • Consultancy   │
│  • Commission    │
│  • Tri-party     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│  CONTRACT SENT   │────────►│  📧 CONTRACT     │
│  TO CLIENT       │         │  READY FOR       │
│                  │         │  SIGNATURE       │
└────────┬─────────┘         └──────────────────┘
         │
         ▼
┌──────────────────┐
│  CLIENT SIGNS    │
│  DIGITALLY       │
└────────┬─────────┘
         │
         ├─────────────────────────────────────────┐
         │                                         │
         ▼                                         ▼
┌──────────────────┐                      ┌──────────────────┐
│  📧 SIGNED       │                      │  📧 SIGNED       │
│  CONTRACT TO:    │                      │  CONTRACT TO     │
│  • Client        │                      │  TRI-PARTY       │
│  • Admin         │                      │                  │
└────────┬─────────┘                      └──────────────────┘
         │
═══════════════════════════════════════════════════════════════════════════════

PHASE 4: PROJECT EXECUTION
══════════════════════════

         │
         ▼
┌──────────────────┐
│  RETAINER        │         ┌──────────────────┐
│  INVOICE         │────────►│  📧 INVOICE      │
│  GENERATED       │         │  TO CLIENT       │
└────────┬─────────┘         └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    PROJECT BOARD ACTIVATED                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────┐ │
│  │  PHASE 1   │  │  PHASE 2   │  │  PHASE 3   │  │PHASE 4 │ │
│  │    DUE     │─►│   LEGAL    │─►│ TECHNICAL  │─►│CLOSING │ │
│  │ DILIGENCE  │  │ COMPLIANCE │  │ EXECUTION  │  │        │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────┘ │
│                                                              │
│  Tasks assigned to:                                          │
│  • Abdullah Law Firm (Legal)                                 │
│  • Spectrum Engineering (Technical)                          │
│  • Legacy (Commercial coordination)                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
         │
         │ (On milestone completion)
         ▼
┌──────────────────┐         ┌──────────────────┐
│  MILESTONE       │────────►│  📧 INVOICE      │
│  INVOICE         │         │  TO CLIENT       │
│  GENERATED       │         │                  │
└────────┬─────────┘         └──────────────────┘
         │
═══════════════════════════════════════════════════════════════════════════════

PHASE 5: COMPLETION
═══════════════════

         │
         ▼
┌──────────────────┐
│  ALL PHASES      │
│  COMPLETED       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│  COMPLETION      │────────►│  📧 COMPLETION   │
│  REPORT          │         │  NOTIFICATION    │
│  GENERATED       │         │  TO ALL PARTIES  │
└────────┬─────────┘         └──────────────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│  FINAL INVOICE   │────────►│  📧 FINAL        │
│  (SUCCESS FEE)   │         │  INVOICE         │
│  IF APPLICABLE   │         │                  │
└────────┬─────────┘         └──────────────────┘
         │
         ▼
┌──────────────────┐
│  PROJECT CLOSED  │
│                  │
│  Client can      │
│  download:       │
│  • Reports       │
│  • Certificates  │
│  • Documents     │
└──────────────────┘
```

---

## Data Flow Diagram

### Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA ENTITY RELATIONSHIPS                            │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌───────────────┐
                              │     USER      │
                              ├───────────────┤
                              │ id            │
                              │ email         │
                              │ password_hash │
                              │ role          │◄─────┐
                              │ company_id    │      │
                              │ created_at    │      │
                              └───────┬───────┘      │
                                      │              │
           ┌──────────────────────────┼──────────────┼──────────────────┐
           │                          │              │                  │
           ▼                          ▼              │                  ▼
   ┌───────────────┐          ┌───────────────┐     │          ┌───────────────┐
   │    CLIENT     │          │   TRI_PARTY   │     │          │     ADMIN     │
   │   COMPANY     │          │   COMPANY     │     │          │               │
   ├───────────────┤          ├───────────────┤     │          │  (System      │
   │ id            │          │ id            │     │          │   Owner)      │
   │ name          │          │ name          │     │          │               │
   │ cr_number     │          │ cr_number     │     │          └───────────────┘
   │ vat_number    │          │ type          │     │
   │ country       │          │ (abdullah/    │     │
   │ address       │          │  spectrum)    │     │
   │ signatory_name│          │ contact_info  │     │
   │ signatory_id  │          └───────┬───────┘     │
   │ kyc_status    │                  │             │
   └───────┬───────┘                  │             │
           │                          │             │
           │                          │             │
           │        ┌─────────────────┘             │
           │        │                               │
           │        ▼                               │
           │ ┌───────────────┐                      │
           │ │    PROJECT    │                      │
           │ ├───────────────┤                      │
           │ │ id            │                      │
           │ │ name          │                      │
           │ │ description   │                      │
           │ │ triparty_id   │◄─────────────────────┤
           │ │ client_id     │◄─────────────────────┤
           │ │ status        │                      │
           │ │ created_by    │◄─────────────────────┘
           │ │ phase         │
           │ │ created_at    │
           │ └───────┬───────┘
           │         │
           │         │
     ┌─────┴─────────┼─────────────────────────────────────┐
     │               │                                     │
     ▼               ▼                                     ▼
┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   KYC    │  │   PROPOSAL   │  │   CONTRACT   │  │   INVOICE    │
│ DOCUMENT │  │              │  │              │  │              │
├──────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤
│ id       │  │ id           │  │ id           │  │ id           │
│ client_id│  │ project_id   │  │ project_id   │  │ project_id   │
│ type     │  │ scope        │  │ type         │  │ type         │
│ file_url │  │ fees         │  │ file_url     │  │ amount       │
│ status   │  │ timeline     │  │ signed_at    │  │ status       │
│ uploaded │  │ status       │  │ signed_by    │  │ due_date     │
└──────────┘  │ created_at   │  │ created_at   │  │ created_at   │
              └──────────────┘  └──────────────┘  └──────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                              TASK MANAGEMENT                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌───────────────┐
                         │     TASK      │
                         ├───────────────┤
                         │ id            │
                         │ project_id    │──────────► PROJECT
                         │ assigned_to   │──────────► TRI_PARTY or ADMIN
                         │ title         │
                         │ description   │
                         │ phase         │
                         │ status        │
                         │ due_date      │
                         │ completed_at  │
                         └───────────────┘
```

---

## Email Automation Flow

### Email Triggers Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EMAIL AUTOMATION TRIGGERS                            │
└─────────────────────────────────────────────────────────────────────────────┘

EVENT                           RECIPIENT(S)              EMAIL TYPE
═════                           ════════════              ══════════

┌─────────────────┐
│ Client Registers│────────────► Client ──────────────► Welcome Pack
└─────────────────┘              Admin ───────────────► New Client Alert


┌─────────────────┐
│ KYC Submitted   │────────────► Admin ───────────────► Review Required
└─────────────────┘


┌─────────────────┐
│ KYC Approved    │────────────► Client ──────────────► Approval + Next Steps
└─────────────────┘


┌─────────────────┐
│ KYC Rejected    │────────────► Client ──────────────► Rejection + Reasons
└─────────────────┘


┌─────────────────┐
│ Project         │────────────► Admin ───────────────► New Project Alert
│ Submitted       │
│ (by Tri-Party)  │
└─────────────────┘


┌─────────────────┐
│ Client Matched  │────────────► Client ──────────────► Match Notification
│ to Project      │              Tri-Party ───────────► Client Assigned
└─────────────────┘


┌─────────────────┐
│ Proposal Sent   │────────────► Client ──────────────► Proposal Ready
└─────────────────┘


┌─────────────────┐
│ Proposal        │────────────► Admin ───────────────► Approval Notification
│ Approved        │              Tri-Party ───────────► Approval Notification
└─────────────────┘


┌─────────────────┐
│ Changes         │────────────► Admin ───────────────► Client Feedback
│ Requested       │
└─────────────────┘


┌─────────────────┐
│ Contract Ready  │────────────► Client ──────────────► Sign Request
└─────────────────┘


┌─────────────────┐
│ Contract Signed │────────────► Client ──────────────► Signed Copy
│                 │              Admin ───────────────► Signed Copy
│                 │              Tri-Party ───────────► Signed Copy
└─────────────────┘


┌─────────────────┐
│ Invoice         │────────────► Client ──────────────► Invoice Details
│ Generated       │
└─────────────────┘


┌─────────────────┐
│ Invoice Due     │────────────► Client ──────────────► Reminder
│ (3 days before) │                                     (Friendly)
└─────────────────┘


┌─────────────────┐
│ Invoice Due     │────────────► Client ──────────────► Reminder
│ (On due date)   │                                     (Urgent)
└─────────────────┘


┌─────────────────┐
│ Invoice Overdue │────────────► Client ──────────────► Overdue Notice
│ (3 days after)  │              Admin ───────────────► Overdue Alert
└─────────────────┘


┌─────────────────┐
│ Phase Complete  │────────────► Client ──────────────► Progress Update
└─────────────────┘


┌─────────────────┐
│ Project         │────────────► Client ──────────────► Completion Report
│ Completed       │              Admin ───────────────► Completion Summary
│                 │              Tri-Party ───────────► Completion Summary
└─────────────────┘
```

---

## Page Connections Map

### URL Structure & Routing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           URL ROUTING STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

PUBLIC ROUTES (No Auth Required)
════════════════════════════════

/                           ──────► Home.tsx
/subsidiaries               ──────► SubsidiaryCompanies.tsx
/services                   ──────► Services.tsx
/about                      ──────► About.tsx
/partnership                ──────► Partnership.tsx
/contact                    ──────► Contact.tsx


AUTH ROUTES (Guest Only)
════════════════════════

/login                      ──────► Login.tsx
/signup                     ──────► SignUp.tsx
/otp                        ──────► Otp.tsx


ADMIN PORTAL ROUTES (Admin Role Required)
═════════════════════════════════════════

/admin                      ──────► AdminDashboard.tsx
  └── /admin/               ──────► pages/Overview.tsx
  └── /admin/projects       ──────► pages/Projects.tsx
  └── /admin/triparty       ──────► pages/TriPartyProjects.tsx
  └── /admin/clients        ──────► pages/Clients.tsx
  └── /admin/kyc            ──────► pages/KYCReview.tsx
  └── /admin/proposals      ──────► pages/Proposals.tsx
  └── /admin/contracts      ──────► pages/Contracts.tsx
  └── /admin/invoices       ──────► pages/Invoices.tsx
  └── /admin/reports        ──────► pages/Reports.tsx
  └── /admin/users          ──────► pages/Users.tsx
  └── /admin/settings       ──────► pages/Settings.tsx


CLIENT PORTAL ROUTES (Client Role Required)
═══════════════════════════════════════════

/client                     ──────► ClientDashboard.tsx
  └── /client/              ──────► pages/Overview.tsx
  └── /client/profile       ──────► pages/Profile.tsx
  └── /client/kyc           ──────► pages/KYCUpload.tsx
  └── /client/intake        ──────► pages/ProjectIntake.tsx
  └── /client/projects      ──────► pages/MyProjects.tsx
  └── /client/proposals     ──────► pages/Proposals.tsx
  └── /client/contracts     ──────► pages/Contracts.tsx
  └── /client/documents     ──────► pages/Documents.tsx
  └── /client/invoices      ──────► pages/Invoices.tsx
  └── /client/reports       ──────► pages/Reports.tsx
  └── /client/settings      ──────► pages/Settings.tsx


TRI-PARTY PORTAL ROUTES (TriParty Role Required)
════════════════════════════════════════════════

/triparty                   ──────► TriPartyDashboard.tsx
  └── /triparty/            ──────► pages/Overview.tsx
  └── /triparty/submit      ──────► pages/SubmitProject.tsx
  └── /triparty/projects    ──────► pages/MyProjects.tsx
  └── /triparty/tasks       ──────► pages/Tasks.tsx
  └── /triparty/files       ──────► pages/ClientFiles.tsx
  └── /triparty/updates     ──────► pages/Updates.tsx
  └── /triparty/invoices    ──────► pages/Invoices.tsx
  └── /triparty/settings    ──────► pages/Settings.tsx


ERROR ROUTES
════════════

/*                          ──────► NotFound.tsx (404)
```

### Navigation Flow Between Pages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTER-PAGE NAVIGATION FLOWS                               │
└─────────────────────────────────────────────────────────────────────────────┘


                    ┌──────────────────────────────┐
                    │        PUBLIC WEBSITE        │
                    │                              │
                    │   Home ◄──► Services         │
                    │     │         │              │
                    │     ▼         ▼              │
                    │   About    Partnership       │
                    │     │         │              │
                    │     └────┬────┘              │
                    │          ▼                   │
                    │      Contact                 │
                    │          │                   │
                    │          ▼                   │
                    │   "Get Started" / "Apply"    │
                    └──────────┬───────────────────┘
                               │
                               ▼
                    ┌──────────────────────────────┐
                    │       AUTH GATEWAY           │
                    │                              │
                    │   Login ◄────► SignUp        │
                    │     │            │           │
                    │     └─────┬──────┘           │
                    │           ▼                  │
                    │         OTP                  │
                    │           │                  │
                    └───────────┼──────────────────┘
                                │
           ┌────────────────────┼────────────────────┐
           │                    │                    │
           ▼                    ▼                    ▼
   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
   │ ADMIN PORTAL  │    │ CLIENT PORTAL │    │TRIPARTY PORTAL│
   │               │    │               │    │               │
   │ Sidebar Nav:  │    │ Sidebar Nav:  │    │ Sidebar Nav:  │
   │               │    │               │    │               │
   │ Overview──────│────│───Overview    │    │ Overview      │
   │    │          │    │      │        │    │    │          │
   │    ▼          │    │      ▼        │    │    ▼          │
   │ Projects◄─────│────│──►Projects    │    │ Submit        │
   │    │          │    │      │        │    │ Project       │
   │    ▼          │    │      │        │    │    │          │
   │ TriParty      │    │      ▼        │    │    ▼          │
   │ Projects      │    │ Proposals     │    │ My Projects   │
   │    │          │    │      │        │    │    │          │
   │    ▼          │    │      ▼        │    │    ▼          │
   │ Clients ◄─────│────│►Contracts     │    │ Tasks         │
   │    │          │    │      │        │    │    │          │
   │    ▼          │    │      ▼        │    │    ▼          │
   │ KYC Review    │    │ Invoices      │    │ Client Files  │
   │    │          │    │               │    │    │          │
   │    ▼          │    │               │    │    ▼          │
   │ Proposals─────│────│───────────────│────│──Updates      │
   │    │          │    │               │    │               │
   │    ▼          │    │               │    │               │
   │ Contracts─────│────│───────────────│────│───────────────│
   │    │          │    │               │    │               │
   │    ▼          │    │               │    │               │
   │ Invoices──────│────│───────────────│────│──Invoices     │
   │               │    │               │    │               │
   └───────────────┘    └───────────────┘    └───────────────┘
```

---

## Implementation Priority

### Phase 1: Core Foundation (Week 1-2)
```
Priority 1: Authentication & Role-Based Access
├── Backend: User model, JWT auth, role middleware
├── Frontend: Connect Login/Signup to backend
└── Routes: Protect dashboard routes by role

Priority 2: Basic Dashboard Shell
├── Admin Overview with stats
├── Client Overview with status
└── TriParty Overview with project count
```

### Phase 2: Project & KYC (Week 3-4)
```
Priority 3: TriParty Project Submission
├── Submit project form
├── Admin approval workflow
└── Project listing

Priority 4: Client KYC Flow
├── KYC upload interface
├── Admin review interface
└── Status tracking
```

### Phase 3: Proposals & Contracts (Week 5-6)
```
Priority 5: Proposal System
├── Template-based proposal builder
├── Client view & approve
└── Change request handling

Priority 6: Contract System
├── Contract generation
├── Digital signature (basic)
└── Document storage
```

### Phase 4: Invoicing & Completion (Week 7-8)
```
Priority 7: Invoice Management
├── Invoice generation
├── Status tracking
└── PDF download

Priority 8: Email Automation
├── Trigger-based emails
├── Template system
└── Notification queue
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           QUICK REFERENCE CARD                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PROJECT STATUSES:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Submitted → Approved → Matched → In Progress → Completed → Closed  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  KYC STATUSES:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Pending → Submitted → In Review → Approved / Rejected / Clarify    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROPOSAL STATUSES:                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Draft → Sent → Viewed → Approved / Changes Requested               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  CONTRACT STATUSES:                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Draft → Sent → Signed → Active → Completed                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  INVOICE STATUSES:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Draft → Sent → Paid / Partially Paid / Overdue                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  PROJECT PHASES:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Phase 1: Due Diligence                                              │   │
│  │ Phase 2: Legal & Compliance                                         │   │
│  │ Phase 3: Technical / Sourcing / Negotiation                         │   │
│  │ Phase 4: Closing & Completion                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  USER ROLES:                                                                │
│  • admin    → Full system access                                           │
│  • client   → Own projects, KYC, contracts, invoices                       │
│  • triparty → Submit projects, tasks, view assigned client files           │
│                                                                             │
│  KEY URLS:                                                                  │
│  • Public:    /                                                            │
│  • Login:     /login                                                       │
│  • Admin:     /admin/*                                                     │
│  • Client:    /client/*                                                    │
│  • TriParty:  /triparty/*                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Review this documentation** - Understand the complete flow
2. **Set up backend** - Create API endpoints matching this architecture
3. **Implement authentication** - JWT-based with role separation
4. **Build pages incrementally** - Follow the priority order
5. **Test each flow** - Ensure data flows correctly between portals
6. **Add email service** - Connect triggers to email templates

---

*Document Version: 1.0*
*Last Updated: December 27, 2025*
*Project: LegacyGlobal System*
