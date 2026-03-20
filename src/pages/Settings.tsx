import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Users, Key } from "lucide-react";

const roles = [
  { role: "Admin", permissions: "Full Access", users: 2, description: "System administration and configuration" },
  { role: "PM", permissions: "View, Add, Edit", users: 3, description: "Project management and tracking" },
  { role: "Consultant", permissions: "View, Add, Edit", users: 5, description: "Module documentation and FRD" },
  { role: "Developer", permissions: "View, Add, Edit (Technical)", users: 8, description: "Technical mapping and API documentation" },
  { role: "Tester", permissions: "View, Add (Test Cases)", users: 4, description: "Test case and UAT management" },
  { role: "Viewer", permissions: "View Only", users: 12, description: "Read-only access to all documentation" },
  { role: "Trainer", permissions: "View, Add (SOPs)", users: 2, description: "Training material management" },
];

const activityLog = [
  { user: "Rajesh K.", action: "Updated Item Master Entry", module: "Master", time: "2 hours ago" },
  { user: "Priya M.", action: "Added FG Stock Adjustment form", module: "Finance", time: "4 hours ago" },
  { user: "Amit S.", action: "Changed status of GRN to Active", module: "Material", time: "Yesterday" },
  { user: "Admin", action: "Added new role: Trainer", module: "Security", time: "2 days ago" },
  { user: "Kiran D.", action: "Created MRP Run Schedule", module: "PPC/MRP", time: "3 days ago" },
];

export default function Settings() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings & RBAC</h1>
        <p className="text-sm text-muted-foreground">Role-based access control and activity log</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><Shield size={20} className="text-primary" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">7</div>
              <div className="text-xs text-muted-foreground">Roles Defined</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/10"><Users size={20} className="text-accent" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">36</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/10"><Key size={20} className="text-success" /></div>
            <div>
              <div className="text-2xl font-bold text-foreground">4</div>
              <div className="text-xs text-muted-foreground">Permission Levels</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Role Definitions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Permissions</TableHead>
                <TableHead className="text-xs">Users</TableHead>
                <TableHead className="text-xs">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.role}>
                  <TableCell><Badge variant="outline" className="text-xs">{r.role}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.permissions}</TableCell>
                  <TableCell className="text-sm font-medium">{r.users}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activityLog.map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-md bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                {log.user.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm text-foreground"><span className="font-medium">{log.user}</span> {log.action}</div>
                <div className="text-xs text-muted-foreground">{log.module} · {log.time}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
