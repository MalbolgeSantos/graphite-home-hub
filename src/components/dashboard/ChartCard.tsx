
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: boolean;
}

export function ChartCard({ title, children, className = "", actions = true }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg h-full backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/30">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          {actions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem className="text-foreground hover:bg-muted/50">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PNG
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground hover:bg-muted/50">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
