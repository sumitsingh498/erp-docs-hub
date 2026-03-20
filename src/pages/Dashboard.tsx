import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { dashboardStats } from "@/data/mock-data";
import {
  Database, FileText, LayoutGrid, AlertTriangle,
  CheckCircle2, Clock, XCircle, Layers,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const kpiCards = [
  { label: "Total Objects", value: dashboardStats.totalObjects, icon: Database, color: "text-primary" },
  { label: "Total Forms", value: dashboardStats.totalForms, icon: LayoutGrid, color: "text-accent" },
  { label: "Total Reports", value: dashboardStats.totalReports, icon: FileText, color: "text-success" },
  { label: "% Complete", value: `${dashboardStats.percentComplete}%`, icon: CheckCircle2, color: "text-success" },
  { label: "Open Risks", value: dashboardStats.openRisks, icon: AlertTriangle, color: "text-warning" },
  { label: "Active Phases", value: dashboardStats.activePhases, icon: Layers, color: "text-info" },
];

const statusIcons: Record<string, typeof CheckCircle2> = {
  Active: CheckCircle2,
  'In Development': Clock,
  Testing: AlertTriangle,
  Deprecated: XCircle,
};

const barColors = ["#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#6366f1", "#ec4899", "#14b8a6"];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">RISANSI GoERP.ai — Implementation Overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={color} />
              </div>
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Phase Progress */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Implementation Phases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardStats.phases.map((phase) => (
              <div key={phase.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{phase.name}</span>
                  <span className="text-muted-foreground text-xs">{phase.period} · {phase.progress}%</span>
                </div>
                <Progress value={phase.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Chart */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Objects by Module</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dashboardStats.moduleCounts}>
                <XAxis dataKey="module" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="forms" name="Forms" radius={[3, 3, 0, 0]}>
                  {dashboardStats.moduleCounts.map((_, i) => (
                    <Cell key={i} fill={barColors[i % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dashboardStats.statusBreakdown.map(({ status, count }) => {
              const Icon = statusIcons[status] || CheckCircle2;
              return (
                <div key={status} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Icon size={18} className="text-muted-foreground" />
                  <div>
                    <div className="text-lg font-bold text-foreground">{count}</div>
                    <div className="text-xs text-muted-foreground">{status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
