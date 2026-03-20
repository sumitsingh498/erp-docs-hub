import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatusBadge, PriorityBadge, TypeBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, AlertTriangle, ClipboardList, FileText, Settings2, Trash2, Calendar, User } from "lucide-react";
import type { ERPMasterItem, ERPStatus, Priority } from "@/data/mock-data";

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: "Open" | "In Progress" | "Completed" | "Deferred";
  assignee: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  reportedBy: string;
  assignee: string;
  createdAt: string;
}

// Seed some sample requirements/issues per form
const sampleRequirements: Record<string, Requirement[]> = {
  "1": [
    { id: "REQ-001", title: "Add HSN code validation", description: "HSN code must be validated against government master list before saving.", priority: "High", status: "In Progress", assignee: "Rajesh K.", createdAt: "2026-02-10" },
    { id: "REQ-002", title: "Bulk item upload support", description: "Allow uploading items via Excel with error report.", priority: "Medium", status: "Open", assignee: "Amit S.", createdAt: "2026-02-18" },
  ],
  "2": [
    { id: "REQ-003", title: "Barcode scanning integration", description: "Physical stock verification should support barcode scanner input.", priority: "High", status: "Open", assignee: "Amit S.", createdAt: "2026-03-01" },
  ],
  "3": [
    { id: "REQ-004", title: "Approval workflow for adjustments", description: "FG adjustments above ₹50,000 need manager approval before posting.", priority: "High", status: "In Progress", assignee: "Priya M.", createdAt: "2026-02-25" },
  ],
};

const sampleIssues: Record<string, Issue[]> = {
  "1": [
    { id: "ISS-001", title: "Duplicate item code allowed", description: "System allows saving duplicate item codes when created simultaneously by two users.", severity: "Critical", status: "Open", reportedBy: "Vikram T.", assignee: "Rajesh K.", createdAt: "2026-03-12" },
  ],
  "3": [
    { id: "ISS-002", title: "GL posting fails for negative adjustments", description: "Negative adjustment entries are not generating correct GL debit/credit entries.", severity: "High", status: "In Progress", reportedBy: "Priya M.", assignee: "Suresh R.", createdAt: "2026-03-15" },
    { id: "ISS-003", title: "Remarks field truncated at 100 chars", description: "Users report remarks are cut off. DB column needs to be extended.", severity: "Medium", status: "Open", reportedBy: "Neha G.", assignee: "Amit S.", createdAt: "2026-03-18" },
  ],
};

const severityColors: Record<string, string> = {
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

const issueStatusColors: Record<string, string> = {
  Open: "bg-red-500/15 text-red-700 border-red-200",
  "In Progress": "bg-amber-500/15 text-amber-700 border-amber-200",
  Resolved: "bg-green-500/15 text-green-700 border-green-200",
  Closed: "bg-muted text-muted-foreground border-border",
};

interface Props {
  item: ERPMasterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updated: ERPMasterItem) => void;
}

export default function FormDetailDialog({ item, open, onOpenChange, onSave }: Props) {
  const [editData, setEditData] = useState<ERPMasterItem | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showNewReq, setShowNewReq] = useState(false);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [newReq, setNewReq] = useState({ title: "", description: "", priority: "Medium" as Priority, assignee: "" });
  const [newIssue, setNewIssue] = useState({ title: "", description: "", severity: "Medium" as Issue["severity"], assignee: "" });

  // Sync state when item changes
  const currentItem = editData?.id === item?.id ? editData : item;

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && item) {
      setEditData({ ...item });
      setRequirements(sampleRequirements[item.id] || []);
      setIssues(sampleIssues[item.id] || []);
      setShowNewReq(false);
      setShowNewIssue(false);
    }
    onOpenChange(isOpen);
  };

  const updateField = <K extends keyof ERPMasterItem>(key: K, value: ERPMasterItem[K]) => {
    if (editData) setEditData({ ...editData, [key]: value });
  };

  const handleSave = () => {
    if (editData && onSave) {
      onSave({ ...editData, updatedAt: new Date().toISOString().split("T")[0] });
    }
    onOpenChange(false);
  };

  const addRequirement = () => {
    if (!newReq.title.trim()) return;
    const req: Requirement = {
      id: `REQ-${String(requirements.length + 4).padStart(3, "0")}`,
      ...newReq,
      status: "Open",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setRequirements([...requirements, req]);
    setNewReq({ title: "", description: "", priority: "Medium", assignee: "" });
    setShowNewReq(false);
  };

  const addIssue = () => {
    if (!newIssue.title.trim()) return;
    const iss: Issue = {
      id: `ISS-${String(issues.length + 4).padStart(3, "0")}`,
      ...newIssue,
      status: "Open",
      reportedBy: "Current User",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setIssues([...issues, iss]);
    setNewIssue({ title: "", description: "", severity: "Medium", assignee: "" });
    setShowNewIssue(false);
  };

  const removeRequirement = (id: string) => setRequirements(requirements.filter((r) => r.id !== id));
  const removeIssue = (id: string) => setIssues(issues.filter((i) => i.id !== id));

  if (!currentItem) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-3 border-b bg-muted/30">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                <span className="font-mono text-primary text-sm">{currentItem.originalId}</span>
                <span className="text-muted-foreground font-normal">·</span>
                {currentItem.displayName}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <TypeBadge type={currentItem.type} />
                <StatusBadge status={currentItem.status} />
                <PriorityBadge priority={currentItem.priority} />
                <span className="text-xs text-muted-foreground">{currentItem.module} / {currentItem.subModule}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center gap-1.5 bg-background border rounded-md px-2.5 py-1">
                <Progress value={currentItem.percentComplete} className="h-1.5 w-14" />
                <span className="text-xs font-medium">{currentItem.percentComplete}%</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="px-6 pt-3 pb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="details" className="text-xs gap-1.5"><Settings2 size={13} />Details</TabsTrigger>
            <TabsTrigger value="requirements" className="text-xs gap-1.5">
              <ClipboardList size={13} />Requirements
              {requirements.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{requirements.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-xs gap-1.5">
              <AlertTriangle size={13} />Issues
              {issues.length > 0 && <Badge variant="destructive" className="ml-1 text-[10px] px-1.5 py-0">{issues.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Display Name</Label>
                <Input value={editData?.displayName || ""} onChange={(e) => updateField("displayName", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Original Name</Label>
                <Input value={editData?.originalName || ""} onChange={(e) => updateField("originalName", e.target.value)} className="h-9 text-sm font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={editData?.status || "Active"} onValueChange={(v) => updateField("status", v as ERPStatus)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["Active", "In Development", "Testing", "Deprecated"] as ERPStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <Select value={editData?.priority || "Medium"} onValueChange={(v) => updateField("priority", v as Priority)}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["High", "Medium", "Low"] as Priority[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Owner</Label>
                <Input value={editData?.owner || ""} onChange={(e) => updateField("owner", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">% Complete</Label>
                <Input type="number" min={0} max={100} value={editData?.percentComplete ?? 0} onChange={(e) => updateField("percentComplete", Number(e.target.value))} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sub Module</Label>
                <Input value={editData?.subModule || ""} onChange={(e) => updateField("subModule", e.target.value)} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">File Name</Label>
                <Input value={editData?.fileName || ""} className="h-9 text-sm font-mono" readOnly />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Remarks</Label>
              <Textarea value={editData?.remarks || ""} onChange={(e) => updateField("remarks", e.target.value)} className="text-sm min-h-[60px]" placeholder="Add notes or remarks..." />
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1"><Calendar size={12} /> Created: {currentItem.createdAt}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Updated: {currentItem.updatedAt}</span>
              </div>
              <Button size="sm" onClick={handleSave} className="gap-1.5"><Save size={14} />Save Changes</Button>
            </div>
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-3 mt-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Business requirements linked to this object</p>
              <Button size="sm" variant="outline" onClick={() => setShowNewReq(true)} className="gap-1.5 text-xs"><Plus size={13} />Add Requirement</Button>
            </div>

            {showNewReq && (
              <div className="border rounded-lg p-4 bg-muted/20 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input value={newReq.title} onChange={(e) => setNewReq({ ...newReq, title: e.target.value })} className="h-8 text-sm" placeholder="Requirement title" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Priority</Label>
                      <Select value={newReq.priority} onValueChange={(v) => setNewReq({ ...newReq, priority: v as Priority })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(["High", "Medium", "Low"] as Priority[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Assignee</Label>
                      <Input value={newReq.assignee} onChange={(e) => setNewReq({ ...newReq, assignee: e.target.value })} className="h-8 text-xs" placeholder="Name" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={newReq.description} onChange={(e) => setNewReq({ ...newReq, description: e.target.value })} className="text-sm min-h-[50px]" placeholder="Describe the requirement..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowNewReq(false)} className="text-xs">Cancel</Button>
                  <Button size="sm" onClick={addRequirement} className="text-xs gap-1"><Plus size={12} />Add</Button>
                </div>
              </div>
            )}

            {requirements.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] w-[80px]">ID</TableHead>
                      <TableHead className="text-[11px]">Title</TableHead>
                      <TableHead className="text-[11px] w-[80px]">Priority</TableHead>
                      <TableHead className="text-[11px] w-[90px]">Status</TableHead>
                      <TableHead className="text-[11px] w-[90px]">Assignee</TableHead>
                      <TableHead className="text-[11px] w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requirements.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono text-xs text-primary">{req.id}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{req.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{req.description}</div>
                        </TableCell>
                        <TableCell><PriorityBadge priority={req.priority} /></TableCell>
                        <TableCell><Badge variant="outline" className={`text-[10px] ${reqStatusColors[req.status]}`}>{req.status}</Badge></TableCell>
                        <TableCell className="text-xs">{req.assignee}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeRequirement(req.id)}><Trash2 size={12} className="text-muted-foreground" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !showNewReq ? (
              <div className="border rounded-lg p-8 text-center">
                <ClipboardList className="mx-auto mb-2 text-muted-foreground" size={28} />
                <p className="text-sm text-muted-foreground">No requirements yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add business requirements to track against this form</p>
              </div>
            ) : null}
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-3 mt-0">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Bugs, defects, and issues reported against this object</p>
              <Button size="sm" variant="outline" onClick={() => setShowNewIssue(true)} className="gap-1.5 text-xs"><Plus size={13} />Report Issue</Button>
            </div>

            {showNewIssue && (
              <div className="border rounded-lg p-4 bg-destructive/5 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input value={newIssue.title} onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} className="h-8 text-sm" placeholder="Issue title" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Severity</Label>
                      <Select value={newIssue.severity} onValueChange={(v) => setNewIssue({ ...newIssue, severity: v as Issue["severity"] })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(["Critical", "High", "Medium", "Low"] as Issue["severity"][]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Assignee</Label>
                      <Input value={newIssue.assignee} onChange={(e) => setNewIssue({ ...newIssue, assignee: e.target.value })} className="h-8 text-xs" placeholder="Name" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Textarea value={newIssue.description} onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} className="text-sm min-h-[50px]" placeholder="Describe the issue..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowNewIssue(false)} className="text-xs">Cancel</Button>
                  <Button size="sm" variant="destructive" onClick={addIssue} className="text-xs gap-1"><AlertTriangle size={12} />Report</Button>
                </div>
              </div>
            )}

            {issues.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] w-[70px]">ID</TableHead>
                      <TableHead className="text-[11px]">Title</TableHead>
                      <TableHead className="text-[11px] w-[80px]">Severity</TableHead>
                      <TableHead className="text-[11px] w-[90px]">Status</TableHead>
                      <TableHead className="text-[11px] w-[80px]">Reported</TableHead>
                      <TableHead className="text-[11px] w-[80px]">Assignee</TableHead>
                      <TableHead className="text-[11px] w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((iss) => (
                      <TableRow key={iss.id}>
                        <TableCell className="font-mono text-xs text-destructive">{iss.id}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{iss.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{iss.description}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={`text-[10px] ${severityColors[iss.severity]}`}>{iss.severity}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={`text-[10px] ${issueStatusColors[iss.status]}`}>{iss.status}</Badge></TableCell>
                        <TableCell className="text-xs">{iss.reportedBy}</TableCell>
                        <TableCell className="text-xs">{iss.assignee}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeIssue(iss.id)}><Trash2 size={12} className="text-muted-foreground" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : !showNewIssue ? (
              <div className="border rounded-lg p-8 text-center">
                <AlertTriangle className="mx-auto mb-2 text-muted-foreground" size={28} />
                <p className="text-sm text-muted-foreground">No issues reported</p>
                <p className="text-xs text-muted-foreground mt-1">Report bugs or defects found during testing</p>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
