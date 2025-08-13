import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard, Zap, Car } from "lucide-react";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const upcomingBills = [
  {
    id: 1,
    title: "Cartão de Crédito",
    amount: 2850.50,
    dueDate: addDays(new Date(), 3),
    status: "urgent",
    icon: CreditCard,
    category: "Financeiro"
  },
  {
    id: 2,
    title: "Energia Elétrica",
    amount: 180.30,
    dueDate: addDays(new Date(), 7),
    status: "upcoming",
    icon: Zap,
    category: "Casa"
  },
  {
    id: 3,
    title: "Seguro do Carro",
    amount: 450.00,
    dueDate: addDays(new Date(), 12),
    status: "normal",
    icon: Car,
    category: "Transporte"
  },
];

export function UpcomingBillsCard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent": return "destructive";
      case "upcoming": return "default";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "urgent": return "Urgente";
      case "upcoming": return "Próximo";
      default: return "Normal";
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
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-primary" />
            Próximas Contas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {upcomingBills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <bill.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{bill.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(bill.dueDate, "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold text-foreground">
                  R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <Badge variant={getStatusColor(bill.status) as any} className="text-xs">
                  {getStatusText(bill.status)}
                </Badge>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border/30">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total próximos 30 dias</span>
              <span className="font-semibold text-accent">
                R$ {upcomingBills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}