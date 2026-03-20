import { useState } from "react";
import { useStore, type ReqStatus, type IssueStatus, type IssueSeverity, type LinkedType } from "@/data/issues-requirements-store";
import { MODULES, type Priority } from "@/data/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PriorityBadge } from "@/components/StatusBadge";
import { Plus, Search, ClipboardList, AlertTriangle, Trash2 } from "lucide-react";

const sevColors: Record<string, string> = {
  Critical: "bg-red-500/15 text-red-700 border-red-200",
  High: "bg-orange-500/15 text-orange-700 border-orange-200",
  Medium: "bg-yellow-500/15 text-yellow-700 border-yellow-200",
  Low: "bg-green-500/15 text-green-700 border-green-200",
};
const reqStatusColors: Record<string, string> = {
  Open: "bg-blue-500/15 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-500/15 text-amber-700 border-amber-200",
  Completed: "bg-green-500/15 text-green-700 border-green-200",
  Deferred: "bg-muted text-muted-foreground border-border",
};
const issStatusColors: Record<string, string> = {
  Open: "bg-red-500/15 text-red-700 border-red-200",
  "In Progress": "bg-amber-500/15 text-amber-700 border-amber-200",
  Resolved: "bg-green-500/15 text-green-700 border-green-200",
  Closed: "bg-muted text-muted-foreground border-border",
};

const LINKED_TYPES: LinkedType[] = ["Form", "Report", "Module", "Menu", "Documentation", "General"];

export default function IssuesRequirements() {
  const { requirements, issues, addRequirement, addIssue, updateRequirementStatus, updateIssueStatus, removeRequirement, removeIssue } = useStore();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [showAddReq, setShowAddReq] = useState(false);
  const [showAddIssue, setShowAddIssue] = useState(false);

  const [newReq, setNewReq] = useState({ title: "", description: "", priority: "Medium" as Priority, assignee: "", linkedType: "General" as LinkedType, linkedId: "", linkedName: "", module: "" });
  const [newIssue, setNewIssue] = useState({ title: "", description: "", severity: "Medium" as IssueSeverity, assignee: "", reportedBy: "", linkedType: "General" as LinkedType, linkedId: "", linkedName: "", module: "" });

  const filteredReqs = requirements.filter((r) => {
    const ms = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.linkedName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const mm = moduleFilter === "all" || r.module === moduleFilter;
    return ms && mm;
  });

  const filteredIssues = issues.filter((i) => {
    const ms = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.linkedName.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase());
    const mm = moduleFilter === "all" || i.module === moduleFilter;
    return ms && mm;
  });

  const pendingReqs = requirements.filter((r) => r.status === "Open" || r.status === "In Progress").length;
  const pendingIssues = issues.filter((i) => i.status === "Open" || i.status === "In Progress").length;
  const criticalIssues = issues.filter((i) => i.severity === "Critical" && i.status !== "Closed" && i.status !== "Resolved").length;

  const handleAddReq = () => {
    if (!newReq.title.trim()) return;
    addRequirement({ ...newReq, status: "Open" });
    setNewReq({ title: "", description: "", priority: "Medium", assignee: "", linkedType: "General", linkedId: "", linkedName: "", module: "" });
    setShowAddReq(false);
  };

  const handleAddIssue = () => {
    if (!newIssue.title.trim()) return;
    addIssue({ ...newIssue, status: "Open" });
    setNewIssue({ title: "", description: "", severity: "Medium", assignee: "", reportedBy: "", linkedType: "General", linkedId: "", linkedName: "", module: "" });
    setShowAddIssue(false);
  };

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Issues & Requirements</h1>
          <p className="text-sm text-muted-foreground">Track requirements and issues across all modules, forms, reports & documentation</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAddReq(true)} className="gap-1.5"><ClipboardList size={14} />New Requirement</Button>
          <Button size="sm" variant="destructive" onClick={() => setShowAddIssue(true)} className="gap-1.5"><AlertTriangle size={14} />Report Issue</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border shadow-sm"><CardContent className="p-4">
          <div className="text-2xl font-bold text-foreground">{pendingReqs}</div>
          <div className="text-xs text-muted-foreground">Pending Requirements</div>
        </CardContent></Card>
        <Card className="border shadow-sm"><CardContent className="p-4">
          <div className="text-2xl font-bold text-foreground">{pendingIssues}</div>
          <div className="text-xs text-muted-foreground">Open Issues</div>
        </CardContent></Card>
        <Card className="border shadow-sm"><CardContent className="p-4">
          <div className="text-2xl font-bold text-destructive">{criticalIssues}</div>
          <div className="text-xs text-muted-foreground">Critical Issues</div>
        </CardContent></Card>
        <Card className="border shadow-sm"><CardContent className="p-4">
          <div className="text-2xl font-bold text-foreground">{requirements.length + issues.length}</div>
          <div className="text-xs text-muted-foreground">Total Items</div>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by title, ID, linked name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {[...MODULES, "General"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="requirements">
        <TabsList>
          <TabsTrigger value="requirements" className="gap-1.5">Requirements ({filteredReqs.length})</TabsTrigger>
          <TabsTrigger value="issues" className="gap-1.5">Issues ({filteredIssues.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="mt-3">
          <div className="border rounded-lg overflow-auto bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[11px] w-[80px]">ID</TableHead>
                  <TableHead className="text-[11px]">Title</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Linked To</TableHead>
                  <TableHead className="text-[11px] w-[100px]">Linked Name</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Module</TableHead>
                  <TableHead className="text-[11px] w-[70px]">Priority</TableHead>
                  <TableHead className="text-[11px] w-[90px]">Status</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Assignee</TableHead>
                  <TableHead className="text-[11px] w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReqs.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs text-primary">{req.id}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{req.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{req.description}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{req.linkedType}</Badge></TableCell>
                    <TableCell className="text-xs">{req.linkedName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{req.module}</TableCell>
                    <TableCell><PriorityBadge priority={req.priority} /></TableCell>
                    <TableCell>
                      <Select value={req.status} onValueChange={(v) => updateRequirementStatus(req.id, v as ReqStatus)}>
                        <SelectTrigger className="h-6 text-[10px] w-[85px] border-0 p-0 px-1">
                          <Badge variant="outline" className={`text-[10px] ${reqStatusColors[req.status]}`}>{req.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {(["Open", "In Progress", "Completed", "Deferred"] as ReqStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs">{req.assignee}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeRequirement(req.id)}><Trash2 size={12} className="text-muted-foreground" /></Button></TableCell>
                  </TableRow>
                ))}
                {filteredReqs.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">No requirements found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-3">
          <div className="border rounded-lg overflow-auto bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[11px] w-[70px]">ID</TableHead>
                  <TableHead className="text-[11px]">Title</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Linked To</TableHead>
                  <TableHead className="text-[11px] w-[100px]">Linked Name</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Module</TableHead>
                  <TableHead className="text-[11px] w-[75px]">Severity</TableHead>
                  <TableHead className="text-[11px] w-[90px]">Status</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Reported</TableHead>
                  <TableHead className="text-[11px] w-[80px]">Assignee</TableHead>
                  <TableHead className="text-[11px] w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((iss) => (
                  <TableRow key={iss.id}>
                    <TableCell className="font-mono text-xs text-destructive">{iss.id}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{iss.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{iss.description}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{iss.linkedType}</Badge></TableCell>
                    <TableCell className="text-xs">{iss.linkedName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{iss.module}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${sevColors[iss.severity]}`}>{iss.severity}</Badge></TableCell>
                    <TableCell>
                      <Select value={iss.status} onValueChange={(v) => updateIssueStatus(iss.id, v as IssueStatus)}>
                        <SelectTrigger className="h-6 text-[10px] w-[85px] border-0 p-0 px-1">
                          <Badge variant="outline" className={`text-[10px] ${issStatusColors[iss.status]}`}>{iss.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {(["Open", "In Progress", "Resolved", "Closed"] as IssueStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs">{iss.reportedBy}</TableCell>
                    <TableCell className="text-xs">{iss.assignee}</TableCell>
                    <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeIssue(iss.id)}><Trash2 size={12} className="text-muted-foreground" /></Button></TableCell>
                  </TableRow>
                ))}
                {filteredIssues.length === 0 && (
                  <TableRow><TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-8">No issues found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Requirement Dialog */}
      <Dialog open={showAddReq} onOpenChange={setShowAddReq}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Requirement</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input value={newReq.title} onChange={(e) => setNewReq({ ...newReq, title: e.target.value })} className="h-9 text-sm" placeholder="Requirement title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Linked Type</Label>
                <Select value={newReq.linkedType} onValueChange={(v) => setNewReq({ ...newReq, linkedType: v as LinkedType })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{LINKED_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Linked Name</Label>
                <Input value={newReq.linkedName} onChange={(e) => setNewReq({ ...newReq, linkedName: e.target.value })} className="h-9 text-sm" placeholder="e.g. Item Master Entry" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Module</Label>
                <Select value={newReq.module || "General"} onValueChange={(v) => setNewReq({ ...newReq, module: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{[...MODULES, "General"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Priority</Label>
                <Select value={newReq.priority} onValueChange={(v) => setNewReq({ ...newReq, priority: v as Priority })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{(["High", "Medium", "Low"] as Priority[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Assignee</Label>
                <Input value={newReq.assignee} onChange={(e) => setNewReq({ ...newReq, assignee: e.target.value })} className="h-9 text-sm" placeholder="Name" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea value={newReq.description} onChange={(e) => setNewReq({ ...newReq, description: e.target.value })} className="text-sm min-h-[60px]" placeholder="Describe the requirement..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowAddReq(false)}>Cancel</Button>
              <Button onClick={handleAddReq} className="gap-1.5"><Plus size={14} />Add Requirement</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Issue Dialog */}
      <Dialog open={showAddIssue} onOpenChange={setShowAddIssue}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Report Issue</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input value={newIssue.title} onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} className="h-9 text-sm" placeholder="Issue title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Linked Type</Label>
                <Select value={newIssue.linkedType} onValueChange={(v) => setNewIssue({ ...newIssue, linkedType: v as LinkedType })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{LINKED_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Linked Name</Label>
                <Input value={newIssue.linkedName} onChange={(e) => setNewIssue({ ...newIssue, linkedName: e.target.value })} className="h-9 text-sm" placeholder="e.g. Sales Order Entry" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Module</Label>
                <Select value={newIssue.module || "General"} onValueChange={(v) => setNewIssue({ ...newIssue, module: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{[...MODULES, "General"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Severity</Label>
                <Select value={newIssue.severity} onValueChange={(v) => setNewIssue({ ...newIssue, severity: v as IssueSeverity })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{(["Critical", "High", "Medium", "Low"] as IssueSeverity[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Assignee</Label>
                <Input value={newIssue.assignee} onChange={(e) => setNewIssue({ ...newIssue, assignee: e.target.value })} className="h-9 text-sm" placeholder="Name" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Reported By</Label>
              <Input value={newIssue.reportedBy} onChange={(e) => setNewIssue({ ...newIssue, reportedBy: e.target.value })} className="h-9 text-sm" placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea value={newIssue.description} onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} className="text-sm min-h-[60px]" placeholder="Describe the issue..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowAddIssue(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleAddIssue} className="gap-1.5"><AlertTriangle size={14} />Report Issue</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
