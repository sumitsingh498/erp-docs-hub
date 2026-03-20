import { useState } from "react";
import { MODULES, erpMasterData, dashboardStats } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, TypeBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";

export default function Modules() {
  const [selectedModule, setSelectedModule] = useState<string>("Master");
  const moduleForms = erpMasterData.filter((i) => i.module === selectedModule && i.type === "FORM");
  const moduleReports = erpMasterData.filter((i) => i.module === selectedModule && i.type === "REPORT");
  const moduleStats = dashboardStats.moduleCounts.find((m) => m.module === selectedModule);

  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Module Documentation</h1>
        <p className="text-sm text-muted-foreground">FRD — Functional documentation by module</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {MODULES.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedModule(m)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedModule === m
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{moduleStats?.forms || 0}</div>
            <div className="text-xs text-muted-foreground">Forms</div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{moduleStats?.reports || 0}</div>
            <div className="text-xs text-muted-foreground">Reports</div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">
              {moduleForms.length + moduleReports.length}
            </div>
            <div className="text-xs text-muted-foreground">Documented Objects</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forms">
        <TabsList>
          <TabsTrigger value="forms">Forms ({moduleForms.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({moduleReports.length})</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="forms" className="mt-3">
          <div className="border rounded-lg overflow-auto bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Sub Module</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Progress</TableHead>
                  <TableHead className="text-xs">Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleForms.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs text-primary">{item.originalId}</TableCell>
                    <TableCell className="text-sm">{item.displayName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.subModule}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={item.percentComplete} className="h-1.5 w-16" />
                        <span className="text-xs">{item.percentComplete}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{item.owner}</TableCell>
                  </TableRow>
                ))}
                {moduleForms.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No forms documented yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="mt-3">
          <div className="border rounded-lg overflow-auto bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleReports.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs text-primary">{item.originalId}</TableCell>
                    <TableCell className="text-sm">{item.displayName}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-xs">{item.owner}</TableCell>
                  </TableRow>
                ))}
                {moduleReports.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">No reports documented yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="overview" className="mt-3">
          <Card className="border shadow-sm">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-foreground">{selectedModule} Module Overview</h3>
              <p className="text-sm text-muted-foreground">
                The {selectedModule} module handles core business processes related to {selectedModule.toLowerCase()} management. 
                This includes all forms, reports, and configurations required for day-to-day operations.
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Key Roles</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">Module Admin</Badge>
                  <Badge variant="secondary">Data Entry</Badge>
                  <Badge variant="secondary">Approver</Badge>
                  <Badge variant="secondary">Viewer</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
