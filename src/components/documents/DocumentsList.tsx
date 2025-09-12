import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, FileText, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  expiry_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_archived: boolean | null;
}

export function DocumentsList() {
  const [deleteDocument, setDeleteDocument] = useState<Document | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('documents-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleDelete = async () => {
    if (!deleteDocument) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', deleteDocument.id);

      if (error) throw error;

      toast({
        title: "Documento excluído!",
        description: `Documento "${deleteDocument.title}" foi excluído com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['documents'] });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir documento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDocument(null);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      cpf: "CPF",
      rg: "RG", 
      cnh: "CNH",
      passport: "Passaporte",
      contract: "Contrato",
      invoice: "Fatura",
      receipt: "Recibo",
      insurance: "Seguro",
      medical: "Documento Médico",
      other: "Outro",
    };
    return types[type] || type;
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
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

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum documento encontrado.</p>
            <p className="text-sm">Clique em "Novo Documento" para começar.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {document.title}
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
                    onClick={() => setDeleteDocument(document)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Badge variant="secondary">
                  {getDocumentTypeLabel(document.document_type)}
                </Badge>

                {document.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {document.description}
                  </p>
                )}

                {document.expiry_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="text-muted-foreground">Vence em:</span>
                    <span className={`font-medium ${
                      isExpired(document.expiry_date) 
                        ? 'text-destructive' 
                        : isExpiringSoon(document.expiry_date) 
                        ? 'text-warning' 
                        : 'text-foreground'
                    }`}>
                      {new Date(document.expiry_date).toLocaleDateString('pt-BR')}
                    </span>
                    {(isExpired(document.expiry_date) || isExpiringSoon(document.expiry_date)) && (
                      <AlertTriangle className={`w-4 h-4 ${
                        isExpired(document.expiry_date) ? 'text-destructive' : 'text-warning'
                      }`} />
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Criado em: {new Date(document.created_at).toLocaleDateString('pt-BR', {
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
        open={!!deleteDocument}
        onOpenChange={() => setDeleteDocument(null)}
        title="Excluir documento"
        description={`Tem certeza que deseja excluir o documento "${deleteDocument?.title}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
}