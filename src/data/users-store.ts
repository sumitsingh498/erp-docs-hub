import { create } from "zustand";
import type { ERPModule } from "./mock-data";

export type UserRole = "Admin" | "PM" | "Consultant" | "Developer" | "Tester" | "Viewer" | "Trainer";

export interface ERPUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  assignedForms: string[];   // originalId references
  assignedReports: string[]; // report id references
  modules: ERPModule[];
  status: "Active" | "Inactive";
  createdAt: string;
}

interface UsersStore {
  users: ERPUser[];
  addUser: (user: Omit<ERPUser, "id" | "createdAt">) => void;
  updateUser: (id: string, updates: Partial<ERPUser>) => void;
  removeUser: (id: string) => void;
  assignForm: (userId: string, formId: string) => void;
  unassignForm: (userId: string, formId: string) => void;
  assignReport: (userId: string, reportId: string) => void;
  unassignReport: (userId: string, reportId: string) => void;
}

let counter = 10;

const seedUsers: ERPUser[] = [
  { id: "USR-001", name: "Rajesh Kumar", email: "rajesh.k@risansi.com", role: "Consultant", department: "ERP Implementation", assignedForms: ["ERP0000000074", "ERP0000000088", "ERP0000000095"], assignedReports: [], modules: ["Master"], status: "Active", createdAt: "2025-12-01" },
  { id: "USR-002", name: "Priya Mehta", email: "priya.m@risansi.com", role: "Consultant", department: "Finance", assignedForms: ["ERP0000000112", "FIN0000000201", "FIN0000000230"], assignedReports: ["R1", "R7"], modules: ["Finance"], status: "Active", createdAt: "2025-12-01" },
  { id: "USR-003", name: "Amit Shah", email: "amit.s@risansi.com", role: "Developer", department: "Technical", assignedForms: ["MTL0000000631", "MTL0000000645"], assignedReports: ["R2", "R6"], modules: ["Material"], status: "Active", createdAt: "2025-12-15" },
  { id: "USR-004", name: "Suresh Reddy", email: "suresh.r@risansi.com", role: "Developer", department: "Technical", assignedForms: ["ENG0000000021", "ENG0000000035"], assignedReports: ["R5"], modules: ["Production"], status: "Active", createdAt: "2026-01-05" },
  { id: "USR-005", name: "Neha Gupta", email: "neha.g@risansi.com", role: "Consultant", department: "Sales", assignedForms: ["SAL0000000045", "SAL0000000060"], assignedReports: ["R3"], modules: ["Sale"], status: "Active", createdAt: "2026-01-10" },
  { id: "USR-006", name: "Vikram Tiwari", email: "vikram.t@risansi.com", role: "Tester", department: "QC", assignedForms: ["QC0000000018"], assignedReports: ["R4"], modules: ["Quality"], status: "Active", createdAt: "2026-01-15" },
  { id: "USR-007", name: "Kiran Desai", email: "kiran.d@risansi.com", role: "Developer", department: "Planning", assignedForms: ["PPC0000000055", "PPC0000000062"], assignedReports: ["R8"], modules: ["PPC/MRP"], status: "Active", createdAt: "2026-02-01" },
  { id: "USR-008", name: "Anita Patel", email: "anita.p@risansi.com", role: "PM", department: "Project Management", assignedForms: ["MKT0000000033"], assignedReports: [], modules: ["Marketing"], status: "Active", createdAt: "2026-02-10" },
  { id: "USR-009", name: "Deepak Verma", email: "deepak.v@risansi.com", role: "Admin", department: "IT Admin", assignedForms: ["SEC0000000009"], assignedReports: [], modules: ["Security", "Master"], status: "Active", createdAt: "2025-11-15" },
  { id: "USR-010", name: "Ritu Sharma", email: "ritu.s@risansi.com", role: "Trainer", department: "Training", assignedForms: [], assignedReports: [], modules: ["Master", "Finance", "Material"], status: "Active", createdAt: "2026-02-20" },
  { id: "USR-011", name: "Manish Joshi", email: "manish.j@risansi.com", role: "Viewer", department: "Management", assignedForms: [], assignedReports: ["R1", "R3", "R5"], modules: [], status: "Active", createdAt: "2026-03-01" },
  { id: "USR-012", name: "Sunita Rao", email: "sunita.r@risansi.com", role: "Viewer", department: "Management", assignedForms: [], assignedReports: ["R1", "R2"], modules: [], status: "Inactive", createdAt: "2026-01-20" },
];

export const useUsersStore = create<UsersStore>((set) => ({
  users: seedUsers,
  addUser: (user) =>
    set((s) => ({
      users: [...s.users, { ...user, id: `USR-${String(++counter).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0] }],
    })),
  updateUser: (id, updates) =>
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)) })),
  removeUser: (id) =>
    set((s) => ({ users: s.users.filter((u) => u.id !== id) })),
  assignForm: (userId, formId) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === userId && !u.assignedForms.includes(formId)
          ? { ...u, assignedForms: [...u.assignedForms, formId] }
          : u
      ),
    })),
  unassignForm: (userId, formId) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === userId ? { ...u, assignedForms: u.assignedForms.filter((f) => f !== formId) } : u
      ),
    })),
  assignReport: (userId, reportId) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === userId && !u.assignedReports.includes(reportId)
          ? { ...u, assignedReports: [...u.assignedReports, reportId] }
          : u
      ),
    })),
  unassignReport: (userId, reportId) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === userId ? { ...u, assignedReports: u.assignedReports.filter((r) => r !== reportId) } : u
      ),
    })),
}));
