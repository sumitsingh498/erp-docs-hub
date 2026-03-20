import { useState, useMemo } from "react";
import { erpMasterData, MODULES, type ERPType, type ERPStatus, type ERPMasterItem } from "@/data/mock-data";
import { StatusBadge, PriorityBadge, TypeBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Search, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormDetailDialog from "@/components/FormDetailDialog";

export default function MasterRegister() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ERPMasterItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDetail = (item: ERPMasterItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const filtered = useMemo(() => {
    return erpMasterData.filter((item) => {
      const matchSearch = !search || 
        item.displayName.toLowerCase().includes(search.toLowerCase()) ||
        item.originalId.toLowerCase().includes(search.toLowerCase()) ||
        item.originalName.toLowerCase().includes(search.toLowerCase());
      const matchModule = moduleFilter === "all" || item.module === moduleFilter;
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchModule && matchType && matchStatus;
    });
  }, [search, moduleFilter, typeFilter, statusFilter]);

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ERP Master Register</h1>
          <p className="text-sm text-muted-foreground">Central registry of all forms, reports, menus & queries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Upload size={14} className="mr-1.5" />Import</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1.5" />Export</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name, file..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {MODULES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[120px] h-9 text-sm"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(['FORM', 'REPORT', 'MENU', 'QUERY'] as ERPType[]).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-9 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {(['Active', 'In Development', 'Testing', 'Deprecated'] as ERPStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-auto bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs w-[130px]">Original ID</TableHead>
              <TableHead className="text-xs">Display Name</TableHead>
              <TableHead className="text-xs w-[90px]">Module</TableHead>
              <TableHead className="text-xs w-[70px]">Type</TableHead>
              <TableHead className="text-xs w-[110px]">Status</TableHead>
              <TableHead className="text-xs w-[80px]">Priority</TableHead>
              <TableHead className="text-xs w-[100px]">Progress</TableHead>
              <TableHead className="text-xs w-[90px]">Owner</TableHead>
              <TableHead className="text-xs w-[120px]">File Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => openDetail(item)}>
                <TableCell className="font-mono text-xs text-primary underline decoration-dotted underline-offset-2 hover:text-primary/80">{item.originalId}</TableCell>
                <TableCell className="text-sm font-medium">{item.displayName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.module}</TableCell>
                <TableCell><TypeBadge type={item.type} /></TableCell>
                <TableCell><StatusBadge status={item.status} /></TableCell>
                <TableCell><PriorityBadge priority={item.priority} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={item.percentComplete} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-8">{item.percentComplete}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.owner}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{item.fileName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <FormDetailDialog item={selectedItem} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
