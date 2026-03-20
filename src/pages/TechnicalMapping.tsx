import { useState } from "react";
import { technicalMappings, MODULES, type ERPModule } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database, Globe, Cpu, Search } from "lucide-react";

export default function TechnicalMapping() {
  const [activeModule, setActiveModule] = useState<"all" | ERPModule>("all");
  const [search, setSearch] = useState("");

  const filtered = technicalMappings.filter((tm) => {
    const matchModule = activeModule === "all" || tm.module === activeModule;
    const matchSearch =
      !search ||
      tm.formName.toLowerCase().includes(search.toLowerCase()) ||
      tm.formId.toLowerCase().includes(search.toLowerCase()) ||
      tm.tableName.toLowerCase().includes(search.toLowerCase()) ||
      tm.apiEndpoint.toLowerCase().includes(search.toLowerCase());
    return matchModule && matchSearch;
  });

  const modulesWithMappings = MODULES.filter((m) =>
    technicalMappings.some((tm) => tm.module === m)
  );

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Technical Mapping</h1>
        <p className="text-sm text-muted-foreground">Form → Table → API → Logic mapping</p>
      </div>

      {/* Module Tabs + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveModule("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeModule === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({technicalMappings.length})
          </button>
          {modulesWithMappings.map((m) => {
            const count = technicalMappings.filter((tm) => tm.module === m).length;
            return (
              <button
                key={m}
                onClick={() => setActiveModule(m)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeModule === m
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {m} ({count})
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 min-w-[180px] max-w-xs ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mappings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      {/* Mappings */}
      <div className="grid gap-4">
        {filtered.map((tm) => (
          <Card key={tm.id} className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                {tm.formName}
                <Badge variant="outline" className="ml-2 text-[10px] bg-primary/10 text-primary border-primary/20 font-mono">
                  {tm.formId}
                </Badge>
                <Badge variant="secondary" className="ml-auto text-[10px]">{tm.module}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                  <Database size={15} className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-foreground">Tables</div>
                    <div className="text-xs text-muted-foreground font-mono">{tm.tableName}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                  <Globe size={15} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-foreground">API Endpoint</div>
                    <div className="text-xs text-muted-foreground font-mono">{tm.apiEndpoint}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                  <Cpu size={15} className="text-success mt-0.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-foreground">Logic</div>
                    <div className="text-xs text-muted-foreground">{tm.logicDescription}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No technical mappings found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
