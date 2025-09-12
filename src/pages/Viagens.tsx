
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddTravelModal } from "@/components/travels/AddTravelModal";
import { TravelsList } from "@/components/travels/TravelsList";

const Viagens = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['travels-stats'],
    queryFn: async () => {
      const { data: travels, error } = await supabase
        .from('travels')
        .select('id, budget, status, start_date');
      
      if (error) throw error;

      const totalTravels = travels.length;
      const plannedTravels = travels.filter(t => t.status === 'planned').length;
      const totalBudget = travels.reduce((sum, travel) => sum + (travel.budget || 0), 0);
      
      return {
        totalTravels,
        plannedTravels,
        totalBudget,
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
              <h1 className="text-3xl font-bold text-foreground">Viagens</h1>
              <p className="text-muted-foreground">Planeje e acompanhe suas viagens</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Viagem
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Próximas Viagens</CardTitle>
              <MapPin className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.plannedTravels || 0}</div>
              <p className="text-xs text-muted-foreground">viagens planejadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçamento Total</CardTitle>
              <DollarSign className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {stats?.totalBudget?.toFixed(2) || '0,00'}
              </div>
              <p className="text-xs text-success">orçamento planejado</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Viagens</CardTitle>
              <Calendar className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalTravels || 0}</div>
              <p className="text-xs text-accent">viagens cadastradas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Minhas Viagens</CardTitle>
          </CardHeader>
          <CardContent>
            <TravelsList />
          </CardContent>
        </Card>

        <AddTravelModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
        />
      </div>
    </MainLayout>
  );
};

export default Viagens;
