import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Upload,
  Trash2,
  LogOut
} from "lucide-react";

const Configuracoes = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados estão sendo preparados para download.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Confirmação necessária",
      description: "Esta ação não pode ser desfeita. Entre em contato com o suporte.",
      variant: "destructive",
    });
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
          </div>
        </motion.div>

        {/* Perfil do Usuário */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user?.email || ""} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name" 
                  placeholder="Digite seu nome completo"
                  className="md:w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Input 
                id="bio" 
                placeholder="Conte um pouco sobre você"
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full md:w-auto">
              Salvar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Notificações Push</div>
                <div className="text-sm text-muted-foreground">
                  Receba notificações sobre transações e lembretes
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Relatórios por Email</div>
                <div className="text-sm text-muted-foreground">
                  Receba resumos mensais por email
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Modo Escuro</div>
                <div className="text-sm text-muted-foreground">
                  Alternar entre tema claro e escuro
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Tema de Cores</Label>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="default" className="cursor-pointer">Azul</Badge>
                <Badge variant="secondary" className="cursor-pointer">Verde</Badge>
                <Badge variant="outline" className="cursor-pointer">Roxo</Badge>
                <Badge variant="outline" className="cursor-pointer">Laranja</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados e Backup */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Dados e Backup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Backup Automático</div>
                <div className="text-sm text-muted-foreground">
                  Backup automático dos seus dados
                </div>
              </div>
              <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleExportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Importar Dados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full md:w-auto">
              Alterar Senha
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              Configurar 2FA
            </Button>
            <Separator />
            <div className="space-y-4">
              <div className="text-sm font-medium text-destructive">Zona de Perigo</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Conta
                </Button>
                <Button 
                  variant="outline" 
                  onClick={signOut}
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;