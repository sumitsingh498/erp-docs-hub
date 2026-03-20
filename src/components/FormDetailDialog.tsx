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
import { Plus, Save, AlertTriangle, ClipboardList, Settings2, Trash2, Calendar } from "lucide-react";
import { useStore, type ReqStatus, type IssueStatus, type IssueSeverity } from "@/data/issues-requirements-store";
import type { ERPMasterItem, ERPStatus, Priority } from "@/data/mock-data";

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

interface Props {
  item: ERPMasterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (updated: ERPMasterItem) => void;
}

export default function FormDetailDialog({ item, open, onOpenChange, onSave }: Props) {
  const [editData, setEditData] = useState<ERPMasterItem | null>(null);
  const [showNewReq, setShowNewReq] = useState(false);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [newReq, setNewReq] = useState({ title: "", description: "", priority: "Medium" as Priority, assignee: "" });
  const [newIssue, setNewIssue] = useState({ title: "", description: "", severity: "Medium" as IssueSeverity, assignee: "" });

  const { requirements, issues, addRequirement, addIssue, removeRequirement, removeIssue, updateRequirementStatus, updateIssueStatus } = useStore();

  const currentItem = editData?.id === item?.id ? editData : item;
  const itemReqs = requirements.filter((r) => r.linkedId === currentItem?.originalId);
  const itemIssues = issues.filter((i) => i.linkedId === currentItem?.originalId);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && item) {
      setEditData({ ...item });
      setShowNewReq(false);
      setShowNewIssue(false);
    }
    onOpenChange(isOpen);
  };

  const updateField = <K extends keyof ERPMasterItem>(key: K, value: ERPMasterItem[K]) => {
    if (editData) setEditData({ ...editData, [key]: value });
  };

  const handleSave = () => {
    if (editData && onSave) onSave({ ...editData, updatedAt: new Date().toISOString().split("T")[0] });
    onOpenChange(false);
  };

  const handleAddReq = () => {
    if (!newReq.title.trim() || !currentItem) return;
    addRequirement({
      ...newReq,
      status: "Open",
      linkedType: currentItem.type === "FORM" ? "Form" : currentItem.type === "REPORT" ? "Report" : "General",
      linkedId: currentItem.originalId,
      linkedName: currentItem.displayName,
      module: currentItem.module,
    });
    setNewReq({ title: "", description: "", priority: "Medium", assignee: "" });
    setShowNewReq(false);
  };

  const handleAddIssue = () => {
    if (!newIssue.title.trim() || !currentItem) return;
    addIssue({
      ...newIssue,
      status: "Open",
      reportedBy: "Current User",
      linkedType: currentItem.type === "FORM" ? "Form" : currentItem.type === "REPORT" ? "Report" : "General",
      linkedId: currentItem.originalId,
      linkedName: currentItem.displayName,
      module: currentItem.module,
    });
    setNewIssue({ title: "", description: "", severity: "Medium", assignee: "" });
    setShowNewIssue(false);
  };

  if (!currentItem) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-0">
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
              {itemReqs.length > 0 && <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{itemReqs.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-xs gap-1.5">
              <AlertTriangle size={13} />Issues
              {itemIssues.length > 0 && <Badge variant="destructive" className="ml-1 text-[10px] px-1.5 py-0">{itemIssues.length}</Badge>}
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
                        <SelectContent>{(["High", "Medium", "Low"] as Priority[]).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
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
                  <Button size="sm" onClick={handleAddReq} className="text-xs gap-1"><Plus size={12} />Add</Button>
                </div>
              </div>
            )}
            {itemReqs.length > 0 ? (
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
                    {itemReqs.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono text-xs text-primary">{req.id}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{req.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{req.description}</div>
                        </TableCell>
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
                      <Select value={newIssue.severity} onValueChange={(v) => setNewIssue({ ...newIssue, severity: v as IssueSeverity })}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{(["Critical", "High", "Medium", "Low"] as IssueSeverity[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
                  <Button size="sm" variant="destructive" onClick={handleAddIssue} className="text-xs gap-1"><AlertTriangle size={12} />Report</Button>
                </div>
              </div>
            )}
            {itemIssues.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] w-[70px]">ID</TableHead>
                      <TableHead className="text-[11px]">Title</TableHead>
                      <TableHead className="text-[11px] w-[80px]">Severity</TableHead>
                      <TableHead className="text-[11px] w-[90px]">Status</TableHead>
                      <TableHead className="text-[11px] w-[80px]">Assignee</TableHead>
                      <TableHead className="text-[11px] w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemIssues.map((iss) => (
                      <TableRow key={iss.id}>
                        <TableCell className="font-mono text-xs text-destructive">{iss.id}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{iss.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{iss.description}</div>
                        </TableCell>
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
