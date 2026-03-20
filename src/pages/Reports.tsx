import { useState, useMemo } from "react";
import { reportData, MODULES } from "@/data/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

const categoryColors: Record<string, string> = {
  MIS: "bg-primary/15 text-primary border-primary/30",
  Operational: "bg-accent/15 text-accent border-accent/30",
  Statutory: "bg-destructive/15 text-destructive border-destructive/30",
  Analytical: "bg-warning/15 text-warning border-warning/30",
};

export default function Reports() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = useMemo(() => {
    return reportData.filter((r) => {
      const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "all" || r.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [search, catFilter]);

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Report Register</h1>
        <p className="text-sm text-muted-foreground">All reports — MIS, Operational, Statutory & Analytical</p>
      </div>

      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[140px] h-9 text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="MIS">MIS</SelectItem>
            <SelectItem value="Operational">Operational</SelectItem>
            <SelectItem value="Statutory">Statutory</SelectItem>
            <SelectItem value="Analytical">Analytical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-auto bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-xs">ID</TableHead>
              <TableHead className="text-xs">Name</TableHead>
              <TableHead className="text-xs">Module</TableHead>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-xs">Frequency</TableHead>
              <TableHead className="text-xs">Used By</TableHead>
              <TableHead className="text-xs">Format</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                <TableCell className="text-sm font-medium">{r.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.module}</TableCell>
                <TableCell><Badge variant="outline" className={`text-xs ${categoryColors[r.category]}`}>{r.category}</Badge></TableCell>
                <TableCell className="text-xs">{r.frequency}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.usedByRole}</TableCell>
                <TableCell className="text-xs">{r.exportFormat}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
