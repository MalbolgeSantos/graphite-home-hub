import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit, ShoppingCart, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface MarketItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number | null;
  category: string | null;
  is_purchased: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  purchase_date: string | null;
}

export function MarketItemsList() {
  const [deleteItem, setDeleteItem] = useState<MarketItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['market-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .order('is_purchased', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MarketItem[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('market-items-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'market_items' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['market-items'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleTogglePurchased = async (item: MarketItem) => {
    try {
      const { error } = await supabase
        .from('market_items')
        .update({
          is_purchased: !item.is_purchased,
          purchase_date: !item.is_purchased ? new Date().toISOString() : null,
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: !item.is_purchased ? "Item comprado!" : "Item desmarcado",
        description: `${item.name} foi ${!item.is_purchased ? 'marcado como comprado' : 'desmarcado'}.`,
      });

      queryClient.invalidateQueries({ queryKey: ['market-items'] });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      const { error } = await supabase
        .from('market_items')
        .delete()
        .eq('id', deleteItem.id);

      if (error) throw error;

      toast({
        title: "Item excluído!",
        description: `Item "${deleteItem.name}" foi excluído com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['market-items'] });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteItem(null);
    }
  };

  const getCategoryLabel = (category: string | null) => {
    const categories: Record<string, string> = {
      alimentacao: "Alimentação",
      higiene: "Higiene",
      limpeza: "Limpeza",
      vestuario: "Vestuário",
      eletronicos: "Eletrônicos",
      casa: "Casa",
      farmacia: "Farmácia",
      outros: "Outros",
    };
    return category ? categories[category] || category : null;
  };

  const pendingItems = items.filter(item => !item.is_purchased);
  const purchasedItems = items.filter(item => item.is_purchased);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum item na lista de compras.</p>
            <p className="text-sm">Clique em "Novo Item" para começar.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {pendingItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Para Comprar ({pendingItems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.is_purchased}
                        onCheckedChange={() => handleTogglePurchased(item)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} {item.unit}
                            </p>
                            {item.price && (
                              <p className="text-sm font-medium text-green-600">
                                R$ {item.price.toFixed(2)}
                              </p>
                            )}
                            {item.category && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {getCategoryLabel(item.category)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-muted"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => setDeleteItem(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {purchasedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Comprados ({purchasedItems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={item.is_purchased}
                        onCheckedChange={() => handleTogglePurchased(item)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium line-clamp-1 line-through">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} {item.unit}
                            </p>
                            {item.price && (
                              <p className="text-sm font-medium text-green-600">
                                R$ {item.price.toFixed(2)}
                              </p>
                            )}
                            {item.purchase_date && (
                              <p className="text-xs text-muted-foreground">
                                Comprado em: {new Date(item.purchase_date).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteItem(item)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={!!deleteItem}
        onOpenChange={() => setDeleteItem(null)}
        title="Excluir item"
        description={`Tem certeza que deseja excluir "${deleteItem?.name}" da lista de compras? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
}