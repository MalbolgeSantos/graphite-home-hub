import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, Car, Home, Coffee } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const recentTransactions = [
  {
    id: 1,
    description: "Supermercado Extra",
    amount: -285.50,
    type: "expense",
    category: "Alimentação",
    date: new Date(),
    icon: ShoppingCart,
    account: "Cartão Visa"
  },
  {
    id: 2,
    description: "Salário",
    amount: 5500.00,
    type: "income",
    category: "Trabalho",
    date: new Date(Date.now() - 86400000),
    icon: ArrowUpRight,
    account: "Conta Corrente"
  },
  {
    id: 3,
    description: "Combustível",
    amount: -95.00,
    type: "expense",
    category: "Transporte",
    date: new Date(Date.now() - 172800000),
    icon: Car,
    account: "Cartão Débito"
  },
  {
    id: 4,
    description: "Aluguel",
    amount: -1200.00,
    type: "expense",
    category: "Moradia",
    date: new Date(Date.now() - 259200000),
    icon: Home,
    account: "Conta Corrente"
  },
  {
    id: 5,
    description: "Café da manhã",
    amount: -15.50,
    type: "expense",
    category: "Alimentação",
    date: new Date(Date.now() - 345600000),
    icon: Coffee,
    account: "Cartão Débito"
  },
];

export function RecentTransactions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-dark border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center">
            <ArrowUpRight className="w-5 h-5 mr-2 text-primary" />
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/30 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === "income" 
                    ? "bg-success/20" 
                    : "bg-destructive/20"
                }`}>
                  <transaction.icon className={`w-5 h-5 ${
                    transaction.type === "income" 
                      ? "text-success" 
                      : "text-destructive"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{transaction.account}</span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className={`font-semibold ${
                  transaction.type === "income" 
                    ? "text-success" 
                    : "text-destructive"
                }`}>
                  {transaction.type === "income" ? "+" : ""}
                  R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(transaction.date, "dd/MM", { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
          
          <div className="pt-3 border-t border-border/30 text-center">
            <button className="text-sm text-primary hover:text-primary/80 transition-colors">
              Ver todas as transações →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}