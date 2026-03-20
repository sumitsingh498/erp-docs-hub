import { technicalMappings } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Globe, Cpu } from "lucide-react";

export default function TechnicalMapping() {
  return (
    <div className="p-6 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Technical Mapping</h1>
        <p className="text-sm text-muted-foreground">Form → Table → API → Logic mapping</p>
      </div>

      <div className="grid gap-4">
        {technicalMappings.map((tm) => (
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
      </div>
    </div>
  );
}
