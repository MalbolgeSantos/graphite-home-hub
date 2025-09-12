
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Shield, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddDocumentModal } from "@/components/documents/AddDocumentModal";
import { DocumentsList } from "@/components/documents/DocumentsList";

const Documentos = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['documents-stats'],
    queryFn: async () => {
      const { data: documents, error } = await supabase
        .from('documents')
        .select('id, expiry_date')
        .eq('is_archived', false);
      
      if (error) throw error;

      const totalDocuments = documents.length;
      const today = new Date();
      const expiringCount = documents.filter(doc => {
        if (!doc.expiry_date) return false;
        const expiry = new Date(doc.expiry_date);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
      }).length;
      
      return {
        totalDocuments,
        expiringCount,
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
              <h1 className="text-3xl font-bold text-foreground">Documentos</h1>
              <p className="text-muted-foreground">Gerencie seus documentos importantes com segurança</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Novo Documento
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Documentos</CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalDocuments || 0}</div>
              <p className="text-xs text-muted-foreground">documentos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Segurança</CardTitle>
              <Shield className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <p className="text-xs text-success">criptografados</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vencimentos</CardTitle>
              <Calendar className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.expiringCount || 0}</div>
              <p className="text-xs text-warning">próximos ao vencimento</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Meus Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentsList />
          </CardContent>
        </Card>

        <AddDocumentModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
        />
      </div>
    </MainLayout>
  );
};

export default Documentos;
