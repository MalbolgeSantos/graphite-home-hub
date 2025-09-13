import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Search,
  Filter,
  Plus,
  Barcode,
  Calendar,
  DollarSign
} from "lucide-react";

const Estoque = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: marketItems, isLoading } = useQuery({
    queryKey: ['market_items', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Simular dados de estoque baseados nos itens de mercado
  const stockItems = marketItems?.map(item => ({
    ...item,
    stock_quantity: Math.floor(Math.random() * 20) + 1,
    min_quantity: Math.floor(Math.random() * 5) + 1,
    location: `Localização ${Math.floor(Math.random() * 5) + 1}`,
    expiry_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    last_purchase: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  })) || [];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case "low_stock":
        return matchesSearch && item.stock_quantity <= item.min_quantity;
      case "out_of_stock":
        return matchesSearch && item.stock_quantity === 0;
      case "expiring_soon":
        const daysUntilExpiry = Math.ceil((item.expiry_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return matchesSearch && daysUntilExpiry <= 7;
      default:
        return matchesSearch;
    }
  });

  const lowStockItems = stockItems.filter(item => item.stock_quantity <= item.min_quantity);
  const outOfStockItems = stockItems.filter(item => item.stock_quantity === 0);
  const totalValue = stockItems.reduce((sum, item) => sum + (item.stock_quantity * (Number(item.price) || 0)), 0);

  const getStockStatus = (item: any) => {
    if (item.stock_quantity === 0) return { status: "Sem estoque", color: "destructive" };
    if (item.stock_quantity <= item.min_quantity) return { status: "Estoque baixo", color: "warning" };
    return { status: "Em estoque", color: "success" };
  };

  const getDaysUntilExpiry = (date: Date) => {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-4 md:p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Controle de Estoque</h1>
              <p className="text-muted-foreground">Gerencie seu estoque doméstico e itens de casa</p>
            </div>
            <Button className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </motion.div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens</CardTitle>
              <Package className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">{stockItems.length}</div>
              <p className="text-xs text-muted-foreground">itens cadastrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
              <AlertTriangle className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">{lowStockItems.length}</div>
              <p className="text-xs text-warning">itens com estoque baixo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sem Estoque</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">{outOfStockItems.length}</div>
              <p className="text-xs text-destructive">itens esgotados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
              <DollarSign className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-success">valor do estoque</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle>Pesquisar e Filtrar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar itens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={filter === "all" ? "default" : "outline"} 
                  onClick={() => setFilter("all")}
                  size="sm"
                >
                  Todos
                </Button>
                <Button 
                  variant={filter === "low_stock" ? "default" : "outline"} 
                  onClick={() => setFilter("low_stock")}
                  size="sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Estoque Baixo
                </Button>
                <Button 
                  variant={filter === "out_of_stock" ? "default" : "outline"} 
                  onClick={() => setFilter("out_of_stock")}
                  size="sm"
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  Sem Estoque
                </Button>
                <Button 
                  variant={filter === "expiring_soon" ? "default" : "outline"} 
                  onClick={() => setFilter("expiring_soon")}
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Vencendo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Itens */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle>Itens do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Nenhum item encontrado com os filtros aplicados" : "Nenhum item no estoque"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  const daysUntilExpiry = getDaysUntilExpiry(item.expiry_date);
                  
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-foreground">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <p className="text-xs text-muted-foreground">{item.location}</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground">{item.stock_quantity}</div>
                          <p className="text-xs text-muted-foreground">{item.unit || 'un'}</p>
                          <p className="text-xs text-muted-foreground">Mín: {item.min_quantity}</p>
                        </div>
                        
                        <div className="text-center">
                          <Badge variant={stockStatus.color === "warning" ? "secondary" : stockStatus.color === "success" ? "default" : "destructive"}>
                            {stockStatus.status}
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm font-semibold text-foreground">
                            R$ {(Number(item.price) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                          <p className="text-xs text-muted-foreground">por {item.unit || 'un'}</p>
                          <p className="text-xs text-muted-foreground">
                            Total: R$ {(item.stock_quantity * (Number(item.price) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-foreground">
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} dias` : "Vencido"}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.expiry_date.toLocaleDateString('pt-BR')}
                          </p>
                          {daysUntilExpiry <= 7 && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              {daysUntilExpiry <= 0 ? "Vencido" : "Vencendo"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alertas de Estoque */}
        {lowStockItems.length > 0 && (
          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Alertas de Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="p-3 bg-background/50 rounded-lg">
                    <h4 className="font-semibold text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Restam apenas {item.stock_quantity} {item.unit || 'un'}
                    </p>
                    <Badge variant="secondary" className="mt-1">Repor estoque</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Estoque;