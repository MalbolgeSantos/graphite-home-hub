import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, ArrowRight } from "lucide-react";
import { useHousehold } from "@/hooks/useHousehold";

const HouseholdSetup = () => {
  const [householdName, setHouseholdName] = useState("");
  const [loading, setLoading] = useState(false);
  const { createHousehold } = useHousehold();

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdName.trim()) return;

    setLoading(true);
    try {
      await createHousehold(householdName.trim());
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Configure sua Família</h1>
          <p className="text-muted-foreground">
            Crie ou participe de uma família para começar a gerenciar suas finanças
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-foreground">
              Criar Nova Família
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateHousehold} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="householdName" className="text-sm font-medium text-foreground">
                  Nome da Família
                </Label>
                <Input
                  id="householdName"
                  type="text"
                  placeholder="Ex: Família Silva"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  required
                  className="bg-background/50 border-border/50 focus:border-primary"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group"
                disabled={loading || !householdName.trim()}
              >
                {loading ? (
                  "Criando..."
                ) : (
                  <>
                    Criar Família
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default HouseholdSetup;