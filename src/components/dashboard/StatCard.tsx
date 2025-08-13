
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "stable";
}

export function StatCard({ title, value, change, icon: Icon, description, trend }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <p className="text-3xl font-bold text-foreground mb-2 tracking-tight">{value}</p>
              {description && (
                <p className="text-xs text-muted-foreground/80">{description}</p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              {change && (
                <Badge 
                  variant={change.type === "positive" ? "default" : change.type === "negative" ? "destructive" : "secondary"}
                  className={`text-xs font-medium ${
                    change.type === "positive" 
                      ? "bg-success/20 text-success border-success/30" 
                      : change.type === "negative" 
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : "bg-muted/20 text-muted-foreground border-muted/30"
                  }`}
                >
                  {change.value}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
