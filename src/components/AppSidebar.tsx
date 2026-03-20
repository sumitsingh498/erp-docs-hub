import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Database, GitBranch, FolderOpen,
  FileText, Code2, Shield, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/master-register", label: "Master Register", icon: Database },
  { path: "/menu-tree", label: "Menu Tree", icon: GitBranch },
  { path: "/modules", label: "Modules", icon: FolderOpen },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/technical-mapping", label: "Technical Mapping", icon: Code2 },
  { path: "/settings", label: "Settings & RBAC", icon: Shield },
];

export default function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col z-50 transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-primary">GoERP.ai</span>
            <span className="text-[10px] text-sidebar-foreground/60">RISANSI Documentation</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-[10px] text-sidebar-foreground/40">v1.0.0 · RISANSI ERP</div>
        )}
      </div>
    </aside>
  );
}
