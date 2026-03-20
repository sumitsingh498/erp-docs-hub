import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users, Key, Plus, Search, Trash2, Settings2, Eye, ClipboardList, AlertTriangle } from "lucide-react";
import { useUsersStore, type UserRole, type ERPUser } from "@/data/users-store";
import { useStore } from "@/data/issues-requirements-store";
import { erpMasterData, reportData, MODULES, type ERPModule } from "@/data/mock-data";

const ROLES: UserRole[] = ["Admin", "PM", "Consultant", "Developer", "Tester", "Viewer", "Trainer"];

const rolePermissions: Record<UserRole, string> = {
  Admin: "Full Access — All CRUD + System Config",
  PM: "View, Add, Edit — Project tracking & oversight",
  Consultant: "View, Add, Edit — Module FRD & documentation",
  Developer: "View, Add, Edit — Technical mapping & API docs",
  Tester: "View, Add — Test cases & UAT scripts",
  Viewer: "View Only — Read-only across all modules",
  Trainer: "View, Add — Training SOPs & materials",
};

const roleColors: Record<UserRole, string> = {
  Admin: "bg-red-500/15 text-red-700 border-red-200",
  PM: "bg-blue-500/15 text-blue-700 border-blue-200",
  Consultant: "bg-violet-500/15 text-violet-700 border-violet-200",
  Developer: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  Tester: "bg-amber-500/15 text-amber-700 border-amber-200",
  Viewer: "bg-muted text-muted-foreground border-border",
  Trainer: "bg-cyan-500/15 text-cyan-700 border-cyan-200",
};

const activityLog = [
  { user: "Rajesh Kumar", action: "Updated Item Master Entry", module: "Master", time: "2 hours ago" },
  { user: "Priya Mehta", action: "Added FG Stock Adjustment form", module: "Finance", time: "4 hours ago" },
  { user: "Amit Shah", action: "Changed status of GRN to Active", module: "Material", time: "Yesterday" },
  { user: "Deepak Verma", action: "Added new role: Trainer", module: "Security", time: "2 days ago" },
  { user: "Kiran Desai", action: "Created MRP Run Schedule", module: "PPC/MRP", time: "3 days ago" },
];

export default function Settings() {
  const { users, addUser, updateUser, removeUser, assignForm, unassignForm, assignReport, unassignReport } = useUsersStore();
  const { requirements, issues } = useStore();
  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ERPUser | null>(null);
  const [showAssign, setShowAssign] = useState(false);

  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Viewer" as UserRole, department: "", modules: [] as ERPModule[], status: "Active" as "Active" | "Inactive" });

  const activeUsers = users.filter((u) => u.status === "Active").length;
  const filteredUsers = users.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    addUser({ ...newUser, assignedForms: [], assignedReports: [] });
    setNewUser({ name: "", email: "", role: "Viewer", department: "", modules: [], status: "Active" });
    setShowAddUser(false);
  };

  const allForms = erpMasterData.filter((i) => i.type === "FORM");
  const allReports = reportData;

  // Get user-wise issues/requirements
  const getUserIssues = (userName: string) => issues.filter((i) => i.assignee === userName.split(" ")[0] + " " + userName.split(" ")[1]?.charAt(0) + "." || i.assignee === userName);
  const getUserReqs = (userName: string) => requirements.filter((r) => r.assignee === userName.split(" ")[0] + " " + userName.split(" ")[1]?.charAt(0) + "." || r.assignee === userName);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings & User Management</h1>
        <p className="text-sm text-muted-foreground">Users, roles, form/report assignments, and activity log</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><Shield size={20} className="text-primary" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">{ROLES.length}</div>
              <div className="text-xs text-muted-foreground">Roles Defined</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/10"><Users size={20} className="text-accent" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">{activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/10"><Key size={20} className="text-success" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">{users.reduce((a, u) => a + u.assignedForms.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Form Assignments</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-destructive/10"><Settings2 size={20} className="text-destructive" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">{users.reduce((a, u) => a + u.assignedReports.length, 0)}</div>
              <div className="text-xs text-muted-foreground">Report Assignments</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="roles">Role Matrix</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* USERS TAB */}
        <TabsContent value="users" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>
            <Button size="sm" onClick={() => setShowAddUser(true)} className="gap-1.5"><Plus size={14} />Add User</Button>
          </div>
          <div className="border rounded-lg overflow-auto bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[11px] w-[70px]">ID</TableHead>
                  <TableHead className="text-[11px]">Name</TableHead>
                  <TableHead className="text-[11px]">Email</TableHead>
                  <TableHead className="text-[11px] w-[90px]">Role</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Dept</TableHead>
                  <TableHead className="text-[11px] w-[60px]">Forms</TableHead>
                  <TableHead className="text-[11px] w-[60px]">Reports</TableHead>
                  <TableHead className="text-[11px] w-[55px]">Issues</TableHead>
                  <TableHead className="text-[11px] w-[55px]">Reqs</TableHead>
                  <TableHead className="text-[11px] w-[70px]">Status</TableHead>
                  <TableHead className="text-[11px] w-[90px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const uIssues = getUserIssues(user.name);
                  const uReqs = getUserReqs(user.name);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs text-primary">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${roleColors[user.role]}`}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{user.department}</TableCell>
                      <TableCell className="text-sm font-medium text-center">{user.assignedForms.length}</TableCell>
                      <TableCell className="text-sm font-medium text-center">{user.assignedReports.length}</TableCell>
                      <TableCell className="text-center">
                        {uIssues.length > 0 ? (
                          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-700 border-red-200">{uIssues.length}</Badge>
                        ) : <span className="text-xs text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {uReqs.length > 0 ? (
                          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-700 border-blue-200">{uReqs.length}</Badge>
                        ) : <span className="text-xs text-muted-foreground">0</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${user.status === "Active" ? "bg-green-500/15 text-green-700 border-green-200" : "bg-muted text-muted-foreground border-border"}`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" title="View & Assign" onClick={() => { setSelectedUser(user); setShowAssign(true); }}>
                            <Eye size={12} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" title="Remove" onClick={() => removeUser(user.id)}>
                            <Trash2 size={12} className="text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ROLES TAB */}
        <TabsContent value="roles" className="mt-4">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Role Definitions & Permissions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs w-[100px]">Role</TableHead>
                    <TableHead className="text-xs">Permissions</TableHead>
                    <TableHead className="text-xs w-[60px]">Users</TableHead>
                    <TableHead className="text-xs">Assigned Modules</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ROLES.map((role) => {
                    const roleUsers = users.filter((u) => u.role === role);
                    const roleModules = [...new Set(roleUsers.flatMap((u) => u.modules))];
                    return (
                      <TableRow key={role}>
                        <TableCell><Badge variant="outline" className={`text-xs ${roleColors[role]}`}>{role}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{rolePermissions[role]}</TableCell>
                        <TableCell className="text-sm font-medium">{roleUsers.length}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {roleModules.length > 0 ? roleModules.map((m) => (
                              <Badge key={m} variant="secondary" className="text-[10px]">{m}</Badge>
                            )) : <span className="text-xs text-muted-foreground">—</span>}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTIVITY TAB */}
        <TabsContent value="activity" className="mt-4">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activityLog.map((log, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-md bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                    {log.user.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground"><span className="font-medium">{log.user}</span> {log.action}</div>
                    <div className="text-xs text-muted-foreground">{log.module} · {log.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Full Name</Label>
                <Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="h-9 text-sm" placeholder="e.g. Rajesh Kumar" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="h-9 text-sm" placeholder="user@risansi.com" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Role</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v as UserRole })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Department</Label>
                <Input value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} className="h-9 text-sm" placeholder="e.g. Finance" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={newUser.status} onValueChange={(v) => setNewUser({ ...newUser, status: v as "Active" | "Inactive" })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Assigned Modules</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
                {MODULES.map((m) => (
                  <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                    <Checkbox
                      checked={newUser.modules.includes(m)}
                      onCheckedChange={(checked) =>
                        setNewUser({
                          ...newUser,
                          modules: checked ? [...newUser.modules, m] : newUser.modules.filter((x) => x !== m),
                        })
                      }
                    />
                    <span className="text-xs">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowAddUser(false)}>Cancel</Button>
              <Button onClick={handleAddUser} className="gap-1.5"><Plus size={14} />Add User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Detail & Assignment Dialog */}
      {selectedUser && (
        <Dialog open={showAssign} onOpenChange={setShowAssign}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                  {selectedUser.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div>{selectedUser.name}</div>
                  <div className="text-xs text-muted-foreground font-normal">{selectedUser.email} · {selectedUser.role} · {selectedUser.department}</div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="forms">
              <TabsList className="w-full">
                <TabsTrigger value="forms" className="flex-1 gap-1 text-xs">Forms ({selectedUser.assignedForms.length})</TabsTrigger>
                <TabsTrigger value="reports" className="flex-1 gap-1 text-xs">Reports ({selectedUser.assignedReports.length})</TabsTrigger>
                <TabsTrigger value="tracking" className="flex-1 gap-1 text-xs">Issues & Reqs</TabsTrigger>
              </TabsList>

              {/* Assign Forms */}
              <TabsContent value="forms" className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">Toggle forms to assign or unassign from this user.</p>
                <div className="border rounded-md overflow-auto max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-[11px] w-[40px]">✓</TableHead>
                        <TableHead className="text-[11px]">Form ID</TableHead>
                        <TableHead className="text-[11px]">Name</TableHead>
                        <TableHead className="text-[11px]">Module</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allForms.map((f) => {
                        const assigned = selectedUser.assignedForms.includes(f.originalId);
                        return (
                          <TableRow key={f.originalId} className={assigned ? "bg-primary/5" : ""}>
                            <TableCell>
                              <Checkbox
                                checked={assigned}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    assignForm(selectedUser.id, f.originalId);
                                  } else {
                                    unassignForm(selectedUser.id, f.originalId);
                                  }
                                  setSelectedUser({ ...selectedUser, assignedForms: checked ? [...selectedUser.assignedForms, f.originalId] : selectedUser.assignedForms.filter((x) => x !== f.originalId) });
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-xs">{f.originalId}</TableCell>
                            <TableCell className="text-xs">{f.displayName}</TableCell>
                            <TableCell><Badge variant="secondary" className="text-[10px]">{f.module}</Badge></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Assign Reports */}
              <TabsContent value="reports" className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">Toggle reports to assign or unassign from this user.</p>
                <div className="border rounded-md overflow-auto max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-[11px] w-[40px]">✓</TableHead>
                        <TableHead className="text-[11px]">Report ID</TableHead>
                        <TableHead className="text-[11px]">Name</TableHead>
                        <TableHead className="text-[11px]">Module</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allReports.map((r) => {
                        const assigned = selectedUser.assignedReports.includes(r.id);
                        return (
                          <TableRow key={r.id} className={assigned ? "bg-primary/5" : ""}>
                            <TableCell>
                              <Checkbox
                                checked={assigned}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    assignReport(selectedUser.id, r.id);
                                  } else {
                                    unassignReport(selectedUser.id, r.id);
                                  }
                                  setSelectedUser({ ...selectedUser, assignedReports: checked ? [...selectedUser.assignedReports, r.id] : selectedUser.assignedReports.filter((x) => x !== r.id) });
                                }}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-xs">{r.id}</TableCell>
                            <TableCell className="text-xs">{r.name}</TableCell>
                            <TableCell><Badge variant="secondary" className="text-[10px]">{r.module}</Badge></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* User Issues & Requirements */}
              <TabsContent value="tracking" className="mt-3 space-y-4">
                {(() => {
                  const uReqs = getUserReqs(selectedUser.name);
                  const uIssues = getUserIssues(selectedUser.name);
                  return (
                    <>
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2"><ClipboardList size={14} />Requirements ({uReqs.length})</h4>
                        {uReqs.length > 0 ? (
                          <div className="space-y-2">
                            {uReqs.map((r) => (
                              <div key={r.id} className="p-2.5 rounded-md border bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-primary">{r.id}</span>
                                  <span className="text-sm font-medium">{r.title}</span>
                                  <Badge variant="outline" className="text-[10px] ml-auto">{r.status}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">{r.linkedType}: {r.linkedName} · {r.module} · {r.createdAt}</div>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-xs text-muted-foreground">No requirements assigned.</p>}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2"><AlertTriangle size={14} />Issues ({uIssues.length})</h4>
                        {uIssues.length > 0 ? (
                          <div className="space-y-2">
                            {uIssues.map((i) => (
                              <div key={i.id} className="p-2.5 rounded-md border bg-muted/30">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-destructive">{i.id}</span>
                                  <span className="text-sm font-medium">{i.title}</span>
                                  <Badge variant="outline" className="text-[10px] ml-auto">{i.severity} · {i.status}</Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">{i.linkedType}: {i.linkedName} · {i.module} · {i.createdAt}</div>
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-xs text-muted-foreground">No issues assigned.</p>}
                      </div>
                    </>
                  );
                })()}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
