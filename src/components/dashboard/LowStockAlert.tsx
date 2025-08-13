import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Package, Plus } from "lucide-react";

const lowStockItems = [
  {
    id: 1,
    name: "Arroz",
    currentStock: 2,
    minStock: 5,
    unit: "kg",
    category: "Grãos",
    lastPurchase: "2024-01-10"
  },
  {
    id: 2,
    name: "Papel Higiênico",
    currentStock: 3,
    minStock: 8,
    unit: "rolos",
    category: "Higiene",
    lastPurchase: "2024-01-05"
  },
  {
    id: 3,
    name: "Amaciante",
    currentStock: 1,
    minStock: 2,
    unit: "litros",
    category: "Limpeza",
    lastPurchase: "2024-01-01"
  },
];

export function LowStockAlert() {
  const getUrgencyLevel = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage <= 20) return "critical";
    if (percentage <= 50) return "warning";
    return "low";
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical": return "destructive";
      case "warning": return "default";
      default: return "secondary";
    }
  };

  const getUrgencyText = (level: string) => {
    switch (level) {
      case "critical": return "Crítico";
      case "warning": return "Baixo";
      default: return "Atenção";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-dark border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
              Estoque Baixo
            </div>
            <Badge variant="destructive" className="text-xs">
              {lowStockItems.length} itens
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {lowStockItems.map((item) => {
            const urgencyLevel = getUrgencyLevel(item.currentStock, item.minStock);
            
            return (
              <div key={item.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{item.currentStock} {item.unit}</span>
                      <span>•</span>
                      <span>Min: {item.minStock} {item.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getUrgencyColor(urgencyLevel) as any} className="text-xs">
                    {getUrgencyText(urgencyLevel)}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          
          <div className="pt-3 border-t border-border/30">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar à Lista de Compras
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}