
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingCart, Package, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddMarketItemModal } from "@/components/market/AddMarketItemModal";
import { MarketItemsList } from "@/components/market/MarketItemsList";

const Mercado = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['market-stats'],
    queryFn: async () => {
      const { data: items, error } = await supabase
        .from('market_items')
        .select('id, is_purchased, price');
      
      if (error) throw error;

      const totalItems = items.length;
      const purchasedItems = items.filter(item => item.is_purchased).length;
      const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
      
      return {
        totalItems,
        purchasedItems,
        pendingItems: totalItems - purchasedItems,
        totalValue,
      };
    },
  });

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lista de Compras</h1>
              <p className="text-muted-foreground">Organize suas compras e controle gastos</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Item
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Para Comprar</CardTitle>
              <ShoppingCart className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.pendingItems || 0}</div>
              <p className="text-xs text-muted-foreground">itens pendentes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Comprados</CardTitle>
              <Package className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.purchasedItems || 0}</div>
              <p className="text-xs text-success">itens já comprados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Estimado</CardTitle>
              <DollarSign className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {stats?.totalValue?.toFixed(2) || '0,00'}
              </div>
              <p className="text-xs text-warning">total estimado</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Minha Lista de Compras</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketItemsList />
          </CardContent>
        </Card>

        <AddMarketItemModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
        />
      </div>
    </MainLayout>
  );
};

export default Mercado;
