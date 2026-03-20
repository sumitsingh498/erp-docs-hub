import { create } from "zustand";
import type { Priority } from "./mock-data";

export type ReqStatus = "Open" | "In Progress" | "Completed" | "Deferred";
export type IssueSeverity = "Critical" | "High" | "Medium" | "Low";
export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type LinkedType = "Form" | "Report" | "Module" | "Menu" | "Documentation" | "General";

export interface HistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
}

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
  history: HistoryEntry[];
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
  history: HistoryEntry[];
}

interface Store {
  requirements: Requirement[];
  issues: Issue[];
  addRequirement: (req: Omit<Requirement, "id" | "createdAt" | "history">) => void;
  addIssue: (iss: Omit<Issue, "id" | "createdAt" | "history">) => void;
  updateRequirementStatus: (id: string, status: ReqStatus, changedBy?: string) => void;
  updateIssueStatus: (id: string, status: IssueStatus, changedBy?: string) => void;
  updateRequirementField: (id: string, field: string, value: string, changedBy?: string) => void;
  updateIssueField: (id: string, field: string, value: string, changedBy?: string) => void;
  removeRequirement: (id: string) => void;
  removeIssue: (id: string) => void;
}

let reqCounter = 10;
let issCounter = 10;
let histCounter = 100;

const makeHist = (field: string, oldVal: string, newVal: string, user = "System"): HistoryEntry => ({
  id: `H-${++histCounter}`,
  timestamp: new Date().toISOString(),
  user,
  field,
  oldValue: oldVal,
  newValue: newVal,
});

const seedRequirements: Requirement[] = [
  { id: "REQ-001", title: "Add HSN code validation", description: "HSN code must be validated against government master list before saving.", priority: "High", status: "In Progress", assignee: "Rajesh K.", linkedType: "Form", linkedId: "ERP0000000074", linkedName: "Item Master Entry", module: "Master", createdAt: "2026-02-10", history: [{ id: "H-001", timestamp: "2026-02-10T09:00:00Z", user: "Rajesh K.", field: "status", oldValue: "Open", newValue: "In Progress" }] },
  { id: "REQ-002", title: "Bulk item upload support", description: "Allow uploading items via Excel with error report.", priority: "Medium", status: "Open", assignee: "Amit S.", linkedType: "Form", linkedId: "ERP0000000074", linkedName: "Item Master Entry", module: "Master", createdAt: "2026-02-18", history: [] },
  { id: "REQ-003", title: "Barcode scanning integration", description: "Physical stock verification should support barcode scanner input.", priority: "High", status: "Open", assignee: "Amit S.", linkedType: "Form", linkedId: "MTL0000000631", linkedName: "Physical Stock Verification", module: "Material", createdAt: "2026-03-01", history: [] },
  { id: "REQ-004", title: "Approval workflow for adjustments", description: "FG adjustments above ₹50,000 need manager approval before posting.", priority: "High", status: "In Progress", assignee: "Priya M.", linkedType: "Form", linkedId: "ERP0000000112", linkedName: "FG Stock Adjustment", module: "Finance", createdAt: "2026-02-25", history: [{ id: "H-002", timestamp: "2026-03-01T14:00:00Z", user: "Priya M.", field: "status", oldValue: "Open", newValue: "In Progress" }] },
  { id: "REQ-005", title: "Multi-currency support for AP", description: "Accounts payable invoice should support foreign currency with exchange rate.", priority: "Medium", status: "Open", assignee: "Priya M.", linkedType: "Form", linkedId: "FIN0000000230", linkedName: "Accounts Payable Invoice", module: "Finance", createdAt: "2026-03-05", history: [] },
  { id: "REQ-006", title: "Trial Balance export to Tally format", description: "Trial balance report must export in Tally-compatible XML.", priority: "Low", status: "Open", assignee: "Priya M.", linkedType: "Report", linkedId: "FIN0000000215", linkedName: "Trial Balance Report", module: "Finance", createdAt: "2026-03-08", history: [] },
  { id: "REQ-007", title: "BOM version comparison", description: "Allow comparing two BOM versions side by side.", priority: "Medium", status: "Open", assignee: "Suresh R.", linkedType: "Form", linkedId: "ENG0000000035", linkedName: "Bill of Materials", module: "Production", createdAt: "2026-03-10", history: [] },
  { id: "REQ-008", title: "MRP demand forecast integration", description: "MRP run should consider sales forecast data from marketing module.", priority: "High", status: "Open", assignee: "Kiran D.", linkedType: "Module", linkedId: "PPC/MRP", linkedName: "PPC/MRP Module", module: "PPC/MRP", createdAt: "2026-03-12", history: [] },
  { id: "REQ-009", title: "FRD template standardization", description: "All module FRD documents should follow the same template structure.", priority: "Medium", status: "In Progress", assignee: "Admin", linkedType: "Documentation", linkedId: "DOC-001", linkedName: "FRD Standards", module: "General", createdAt: "2026-03-01", history: [{ id: "H-003", timestamp: "2026-03-05T10:00:00Z", user: "Admin", field: "status", oldValue: "Open", newValue: "In Progress" }] },
];

const seedIssues: Issue[] = [
  { id: "ISS-001", title: "Duplicate item code allowed", description: "System allows saving duplicate item codes when created simultaneously by two users.", severity: "Critical", status: "Open", reportedBy: "Vikram T.", assignee: "Rajesh K.", linkedType: "Form", linkedId: "ERP0000000074", linkedName: "Item Master Entry", module: "Master", createdAt: "2026-03-12", history: [] },
  { id: "ISS-002", title: "GL posting fails for negative adjustments", description: "Negative adjustment entries are not generating correct GL debit/credit entries.", severity: "High", status: "In Progress", reportedBy: "Priya M.", assignee: "Suresh R.", linkedType: "Form", linkedId: "ERP0000000112", linkedName: "FG Stock Adjustment", module: "Finance", createdAt: "2026-03-15", history: [{ id: "H-004", timestamp: "2026-03-16T11:00:00Z", user: "Suresh R.", field: "status", oldValue: "Open", newValue: "In Progress" }] },
  { id: "ISS-003", title: "Remarks field truncated at 100 chars", description: "Users report remarks are cut off. DB column needs to be extended.", severity: "Medium", status: "Open", reportedBy: "Neha G.", assignee: "Amit S.", linkedType: "Form", linkedId: "ERP0000000112", linkedName: "FG Stock Adjustment", module: "Finance", createdAt: "2026-03-18", history: [] },
  { id: "ISS-004", title: "Stock ledger report shows wrong opening balance", description: "Opening balance for month does not match previous month closing in some items.", severity: "High", status: "Open", reportedBy: "Amit S.", assignee: "Amit S.", linkedType: "Report", linkedId: "MTL0000000660", linkedName: "Stock Ledger Report", module: "Material", createdAt: "2026-03-14", history: [] },
  { id: "ISS-005", title: "Sales order saves without customer validation", description: "Orders can be created with inactive customer codes.", severity: "High", status: "Open", reportedBy: "Neha G.", assignee: "Neha G.", linkedType: "Form", linkedId: "SAL0000000045", linkedName: "Sales Order Entry", module: "Sale", createdAt: "2026-03-16", history: [] },
  { id: "ISS-006", title: "Menu tree not loading for Security module", description: "Clicking Security module in menu tree shows blank page.", severity: "Medium", status: "Resolved", reportedBy: "Admin", assignee: "Admin", linkedType: "Module", linkedId: "Security", linkedName: "Security Module", module: "Security", createdAt: "2026-03-10", history: [{ id: "H-005", timestamp: "2026-03-12T16:00:00Z", user: "Admin", field: "status", oldValue: "Open", newValue: "Resolved" }] },
  { id: "ISS-007", title: "Data migration mapping document outdated", description: "Migration mapping doc references old table names that were renamed.", severity: "Low", status: "Open", reportedBy: "Kiran D.", assignee: "Admin", linkedType: "Documentation", linkedId: "DOC-002", linkedName: "Data Migration Mapping", module: "General", createdAt: "2026-03-17", history: [] },
];

export const useStore = create<Store>((set) => ({
  requirements: seedRequirements,
  issues: seedIssues,
  addRequirement: (req) =>
    set((s) => ({
      requirements: [
        ...s.requirements,
        { ...req, id: `REQ-${String(++reqCounter).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0], history: [makeHist("created", "", "Created", req.assignee || "System")] },
      ],
    })),
  addIssue: (iss) =>
    set((s) => ({
      issues: [
        ...s.issues,
        { ...iss, id: `ISS-${String(++issCounter).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0], history: [makeHist("created", "", "Reported", iss.reportedBy || "System")] },
      ],
    })),
  updateRequirementStatus: (id, status, changedBy = "System") =>
    set((s) => ({
      requirements: s.requirements.map((r) =>
        r.id === id ? { ...r, status, history: [...r.history, makeHist("status", r.status, status, changedBy)] } : r
      ),
    })),
  updateIssueStatus: (id, status, changedBy = "System") =>
    set((s) => ({
      issues: s.issues.map((i) =>
        i.id === id ? { ...i, status, history: [...i.history, makeHist("status", i.status, status, changedBy)] } : i
      ),
    })),
  updateRequirementField: (id, field, value, changedBy = "System") =>
    set((s) => ({
      requirements: s.requirements.map((r) =>
        r.id === id ? { ...r, [field]: value, history: [...r.history, makeHist(field, (r as any)[field] || "", value, changedBy)] } : r
      ),
    })),
  updateIssueField: (id, field, value, changedBy = "System") =>
    set((s) => ({
      issues: s.issues.map((i) =>
        i.id === id ? { ...i, [field]: value, history: [...i.history, makeHist(field, (i as any)[field] || "", value, changedBy)] } : i
      ),
    })),
  removeRequirement: (id) =>
    set((s) => ({ requirements: s.requirements.filter((r) => r.id !== id) })),
  removeIssue: (id) =>
    set((s) => ({ issues: s.issues.filter((i) => i.id !== id) })),
}));
