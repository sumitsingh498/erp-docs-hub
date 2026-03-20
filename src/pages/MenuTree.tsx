import { useState } from "react";
import { menuTree, type MenuNode } from "@/data/mock-data";
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function TreeNode({ node, depth = 0 }: { node: MenuNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children.length > 0;
  const isLeaf = !hasChildren;

  return (
    <div>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-md text-sm hover:bg-muted/60 transition-colors",
          isLeaf && "cursor-default"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown size={14} className="text-muted-foreground shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground shrink-0" />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {hasChildren ? (
          expanded ? <FolderOpen size={15} className="text-warning shrink-0" /> : <Folder size={15} className="text-warning shrink-0" />
        ) : (
          <FileText size={14} className="text-primary shrink-0" />
        )}
        <span className="text-foreground">{node.label}</span>
        {node.formId && (
          <Badge variant="outline" className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20">
            {node.formId}
          </Badge>
        )}
      </button>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuTree() {
  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Menu Tree</h1>
        <p className="text-sm text-muted-foreground">ERP navigation hierarchy — expandable tree structure</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {menuTree.map((root) => (
          <Card key={root.id} className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Folder size={16} className="text-warning" />
                {root.label}
                <Badge variant="secondary" className="ml-auto text-[10px]">{root.module}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {root.children.map((child) => (
                <TreeNode key={child.id} node={child} depth={0} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
