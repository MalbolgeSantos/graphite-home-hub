import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, MapPin, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Travel {
  id: string;
  destination: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  spent_amount: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function TravelsList() {
  const [deleteTravel, setDeleteTravel] = useState<Travel | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: travels = [], isLoading } = useQuery({
    queryKey: ['travels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Travel[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('travels-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'travels' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['travels'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDelete = async () => {
    if (!deleteTravel) return;

    try {
      const { error } = await supabase
        .from('travels')
        .delete()
        .eq('id', deleteTravel.id);

      if (error) throw error;

      toast({
        title: "Viagem excluída!",
        description: `Viagem para "${deleteTravel.destination}" foi excluída com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['travels'] });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir viagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteTravel(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      planned: "Planejada",
      booked: "Reservada",
      ongoing: "Em andamento",
      completed: "Concluída",
      cancelled: "Cancelada",
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      planned: "outline",
      booked: "secondary",
      ongoing: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return statusColors[status] || "outline";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (travels.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma viagem encontrada.</p>
            <p className="text-sm">Clique em "Nova Viagem" para começar a planejar.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {travels.map((travel) => (
          <Card key={travel.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {travel.destination}
                </CardTitle>
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
                    onClick={() => setDeleteTravel(travel)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Badge variant={getStatusColor(travel.status)}>
                  {getStatusLabel(travel.status)}
                </Badge>

                {travel.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {travel.description}
                  </p>
                )}

                {(travel.start_date || travel.end_date) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="text-muted-foreground">
                      {travel.start_date && new Date(travel.start_date).toLocaleDateString('pt-BR')}
                      {travel.start_date && travel.end_date && ' - '}
                      {travel.end_date && new Date(travel.end_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}

                {travel.budget && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-muted-foreground">Orçamento:</span>
                    </div>
                    <span className="font-medium">
                      R$ {travel.budget.toFixed(2)}
                    </span>
                  </div>
                )}

                {travel.spent_amount && travel.spent_amount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Gasto:</span>
                    <span className="font-medium text-destructive">
                      R$ {travel.spent_amount.toFixed(2)}
                    </span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Criado em: {new Date(travel.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmationDialog
        open={!!deleteTravel}
        onOpenChange={() => setDeleteTravel(null)}
        title="Excluir viagem"
        description={`Tem certeza que deseja excluir a viagem para "${deleteTravel?.destination}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
}