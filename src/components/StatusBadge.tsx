import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  'Active': 'bg-success/15 text-success border-success/30',
  'In Development': 'bg-warning/15 text-warning border-warning/30',
  'Testing': 'bg-info/15 text-info border-info/30',
  'Deprecated': 'bg-destructive/15 text-destructive border-destructive/30',
};

const priorityStyles: Record<string, string> = {
  'High': 'bg-destructive/15 text-destructive border-destructive/30',
  'Medium': 'bg-warning/15 text-warning border-warning/30',
  'Low': 'bg-muted text-muted-foreground border-border',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", statusStyles[status] || '')}>
      {status}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", priorityStyles[priority] || '')}>
      {priority}
    </Badge>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    'FORM': 'bg-primary/15 text-primary border-primary/30',
    'REPORT': 'bg-accent/15 text-accent border-accent/30',
    'MENU': 'bg-secondary text-secondary-foreground border-border',
    'QUERY': 'bg-muted text-muted-foreground border-border',
  };
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", styles[type] || '')}>
      {type}
    </Badge>
  );
}
