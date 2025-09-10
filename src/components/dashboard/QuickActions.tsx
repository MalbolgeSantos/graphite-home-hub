import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CreditCard, Target, ShoppingCart, Receipt } from "lucide-react";
import { AddTransactionModal } from "./AddTransactionModal";
import { AddAccountModal } from "./AddAccountModal";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      title: "Nova Transação",
      icon: Plus,
      description: "Adicionar receita ou despesa",
      onClick: () => setShowAddTransaction(true),
      className: "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20",
    },
    {
      title: "Nova Conta",
      icon: CreditCard,
      description: "Adicionar conta bancária",
      onClick: () => setShowAddAccount(true),
      className: "bg-success/10 hover:bg-success/20 text-success border-success/20",
    },
    {
      title: "Ver Metas",
      icon: Target,
      description: "Acompanhar objetivos",
      onClick: () => navigate("/financas"),
      className: "bg-warning/10 hover:bg-warning/20 text-warning border-warning/20",
    },
    {
      title: "Lista de Compras",
      icon: ShoppingCart,
      description: "Gerenciar compras",
      onClick: () => navigate("/mercado"),
      className: "bg-accent/10 hover:bg-accent/20 text-accent border-accent/20",
    },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {actions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    onClick={action.onClick}
                    className={`h-auto p-4 flex-col gap-2 w-full ${action.className}`}
                  >
                    <action.icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs opacity-80">{action.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AddTransactionModal 
        open={showAddTransaction} 
        onOpenChange={setShowAddTransaction} 
      />
      
      <AddAccountModal 
        open={showAddAccount} 
        onOpenChange={setShowAddAccount} 
      />
    </>
  );
}