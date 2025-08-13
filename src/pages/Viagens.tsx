
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Calendar, DollarSign } from "lucide-react";

const Viagens = () => {
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
            <Button className="bg-primary hover:bg-primary/90">
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
              <div className="text-2xl font-bold text-foreground">2</div>
              <p className="text-xs text-muted-foreground">viagens planejadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçamento Total</CardTitle>
              <DollarSign className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">R$ 5.200,00</div>
              <p className="text-xs text-success">dentro do orçamento</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dias até Próxima</CardTitle>
              <Calendar className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">15</div>
              <p className="text-xs text-accent">Rio de Janeiro</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Viagens Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funcionalidade em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Viagens;
