
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Tag, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddNoteModal } from "@/components/notes/AddNoteModal";
import { NotesList } from "@/components/notes/NotesList";

const Notas = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['notes-stats'],
    queryFn: async () => {
      const { data: notes, error } = await supabase
        .from('notes')
        .select('id, tags')
        .eq('is_archived', false);
      
      if (error) throw error;

      const totalNotes = notes.length;
      const allTags = notes.flatMap(note => note.tags || []);
      const uniqueTags = new Set(allTags);
      
      return {
        totalNotes,
        totalTags: uniqueTags.size,
        totalSearches: Math.floor(Math.random() * 200) + 100, // Mock data
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
              <h1 className="text-3xl font-bold text-foreground">Anotações</h1>
              <p className="text-muted-foreground">Organize suas ideias e lembretes</p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Nota
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Notas</CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalNotes || 0}</div>
              <p className="text-xs text-muted-foreground">notas criadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tags</CardTitle>
              <Tag className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalTags || 0}</div>
              <p className="text-xs text-muted-foreground">categorias diferentes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pesquisas</CardTitle>
              <Search className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats?.totalSearches || 0}</div>
              <p className="text-xs text-success">buscas realizadas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Minhas Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <NotesList />
          </CardContent>
        </Card>

        <AddNoteModal 
          open={showAddModal} 
          onOpenChange={setShowAddModal} 
        />
      </div>
    </MainLayout>
  );
};

export default Notas;
