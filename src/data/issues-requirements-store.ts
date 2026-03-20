import { create } from "zustand";
import type { Priority } from "./mock-data";

export type ReqStatus = "Open" | "In Progress" | "Completed" | "Deferred";
export type IssueSeverity = "Critical" | "High" | "Medium" | "Low";
export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type LinkedType = "Form" | "Report" | "Module" | "Menu" | "Documentation" | "General";

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: ReqStatus;
  assignee: string;
  linkedType: LinkedType;
  linkedId: string;
  linkedName: string;
  module: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: IssueSeverity;
  status: IssueStatus;
  reportedBy: string;
  assignee: string;
  linkedType: LinkedType;
  linkedId: string;
  linkedName: string;
  module: string;
  createdAt: string;
}

interface Store {
  requirements: Requirement[];
  issues: Issue[];
  addRequirement: (req: Omit<Requirement, "id" | "createdAt">) => void;
  addIssue: (iss: Omit<Issue, "id" | "createdAt">) => void;
  updateRequirementStatus: (id: string, status: ReqStatus) => void;
  updateIssueStatus: (id: string, status: IssueStatus) => void;
  removeRequirement: (id: string) => void;
  removeIssue: (id: string) => void;
}

let reqCounter = 10;
let issCounter = 10;

const seedRequirements: Requirement[] = [
  { id: "REQ-001", title: "Add HSN code validation", description: "HSN code must be validated against government master list before saving.", priority: "High", status: "In Progress", assignee: "Rajesh K.", linkedType: "Form", linkedId: "ERP0000000074", linkedName: "Item Master Entry", module: "Master", createdAt: "2026-02-10" },
  { id: "REQ-002", title: "Bulk item upload support", description: "Allow uploading items via Excel with error report.", priority: "Medium", status: "Open", assignee: "Amit S.", linkedType: "Form", linkedId: "ERP0000000074", linkedName: "Item Master Entry", module: "Master", createdAt: "2026-02-18" },
  { id: "REQ-003", title: "Barcode scanning integration", description: "Physical stock verification should support barcode scanner input.", priority: "High", status: "Open", assignee: "Amit S.", linkedType: "Form", linkedId: "MTL0000000631", linkedName: "Physical Stock Verification", module: "Material", createdAt: "2026-03-01" },
  { id: "REQ-004", title: "Approval workflow for adjustments", description: "FG adjustments above ₹50,000 need manager approval before posting.", priority: "High", status: "In Progress", assignee: "Priya M.", linkedType: "Form", linkedId: "ERP0000000112", linkedName: "FG Stock Adjustment", module: "Finance", createdAt: "2026-02-25" },
  { id: "REQ-005", title: "Multi-currency support for AP", description: "Accounts payable invoice should support foreign currency with exchange rate.", priority: "Medium", status: "Open", assignee: "Priya M.", linkedType: "Form", linkedId: "FIN0000000230", linkedName: "Accounts Payable Invoice", module: "Finance", createdAt: "2026-03-05" },
  { id: "REQ-006", title: "Trial Balance export to Tally format", description: "Trial balance report must export in Tally-compatible XML.", priority: "Low", status: "Open", assignee: "Priya M.", linkedType: "Report", linkedId: "FIN0000000215", linkedName: "Trial Balance Report", module: "Finance", createdAt: "2026-03-08" },
  { id: "REQ-007", title: "BOM version comparison", description: "Allow comparing two BOM versions side by side.", priority: "Medium", status: "Open", assignee: "Suresh R.", linkedType: "Form", linkedId: "ENG0000000035", linkedName: "Bill of Materials", module: "Production", createdAt: "2026-03-10" },
  { id: "REQ-008", title: "MRP demand forecast integration", description: "MRP run should consider sales forecast data from marketing module.", priority: "High", status: "Open", assignee: "Kiran D.", linkedType: "Module", linkedId: "PPC/MRP", linkedName: "PPC/MRP Module", module: "PPC/MRP", createdAt: "2026-03-12" },
  { id: "REQ-009", title: "FRD template standardization", description: "All module FRD documents should follow the same template structure.", priority: "Medium", status: "In Progress", assignee: "Admin", linkedType: "Documentation", linkedId: "DOC-001", linkedName: "FRD Standards", module: "General", createdAt: "2026-03-01" },
];

const seedIssues: Issue[] = [
  { id: "ISS-001", title: "Duplicate item code allowed", description: "System allows saving duplicate item codes when created simultaneously by two users.", severity: "Critical", status: "Open", reportedBy: "Vikram T.", assignee: "Rajesh K.", linkedType: "Form", linkedId: "ERP0000000074", linkedName: "Item Master Entry", module: "Master", createdAt: "2026-03-12" },
  { id: "ISS-002", title: "GL posting fails for negative adjustments", description: "Negative adjustment entries are not generating correct GL debit/credit entries.", severity: "High", status: "In Progress", reportedBy: "Priya M.", assignee: "Suresh R.", linkedType: "Form", linkedId: "ERP0000000112", linkedName: "FG Stock Adjustment", module: "Finance", createdAt: "2026-03-15" },
  { id: "ISS-003", title: "Remarks field truncated at 100 chars", description: "Users report remarks are cut off. DB column needs to be extended.", severity: "Medium", status: "Open", reportedBy: "Neha G.", assignee: "Amit S.", linkedType: "Form", linkedId: "ERP0000000112", linkedName: "FG Stock Adjustment", module: "Finance", createdAt: "2026-03-18" },
  { id: "ISS-004", title: "Stock ledger report shows wrong opening balance", description: "Opening balance for month does not match previous month closing in some items.", severity: "High", status: "Open", reportedBy: "Amit S.", assignee: "Amit S.", linkedType: "Report", linkedId: "MTL0000000660", linkedName: "Stock Ledger Report", module: "Material", createdAt: "2026-03-14" },
  { id: "ISS-005", title: "Sales order saves without customer validation", description: "Orders can be created with inactive customer codes.", severity: "High", status: "Open", reportedBy: "Neha G.", assignee: "Neha G.", linkedType: "Form", linkedId: "SAL0000000045", linkedName: "Sales Order Entry", module: "Sale", createdAt: "2026-03-16" },
  { id: "ISS-006", title: "Menu tree not loading for Security module", description: "Clicking Security module in menu tree shows blank page.", severity: "Medium", status: "Resolved", reportedBy: "Admin", assignee: "Admin", linkedType: "Module", linkedId: "Security", linkedName: "Security Module", module: "Security", createdAt: "2026-03-10" },
  { id: "ISS-007", title: "Data migration mapping document outdated", description: "Migration mapping doc references old table names that were renamed.", severity: "Low", status: "Open", reportedBy: "Kiran D.", assignee: "Admin", linkedType: "Documentation", linkedId: "DOC-002", linkedName: "Data Migration Mapping", module: "General", createdAt: "2026-03-17" },
];

export const useStore = create<Store>((set) => ({
  requirements: seedRequirements,
  issues: seedIssues,
  addRequirement: (req) =>
    set((s) => ({
      requirements: [
        ...s.requirements,
        { ...req, id: `REQ-${String(++reqCounter).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0] },
      ],
    })),
  addIssue: (iss) =>
    set((s) => ({
      issues: [
        ...s.issues,
        { ...iss, id: `ISS-${String(++issCounter).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0] },
      ],
    })),
  updateRequirementStatus: (id, status) =>
    set((s) => ({ requirements: s.requirements.map((r) => (r.id === id ? { ...r, status } : r)) })),
  updateIssueStatus: (id, status) =>
    set((s) => ({ issues: s.issues.map((i) => (i.id === id ? { ...i, status } : i)) })),
  removeRequirement: (id) =>
    set((s) => ({ requirements: s.requirements.filter((r) => r.id !== id) })),
  removeIssue: (id) =>
    set((s) => ({ issues: s.issues.filter((i) => i.id !== id) })),
}));
