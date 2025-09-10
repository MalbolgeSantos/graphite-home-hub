import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface AddAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAccountModal({ open, onOpenChange }: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"checking" | "savings" | "credit" | "investment">("checking");
  const [openingBalance, setOpeningBalance] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('accounts')
        .insert({
          user_id: user.id,
          name: name.trim(),
          type,
          opening_balance: Number(openingBalance) || 0,
          current_balance: Number(openingBalance) || 0,
        });

      if (error) throw error;

      toast({
        title: "Conta adicionada!",
        description: `Conta "${name}" criada com sucesso.`,
      });

      // Reset form
      setName("");
      setType("checking");
      setOpeningBalance("");
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              placeholder="Ex: Conta Corrente Banco do Brasil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Conta Corrente</SelectItem>
                <SelectItem value="savings">Poupança</SelectItem>
                <SelectItem value="credit">Cartão de Crédito</SelectItem>
                <SelectItem value="investment">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Inicial</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}