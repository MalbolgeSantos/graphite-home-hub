import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Calendar as CalendarIcon,
  Download,
  Filter,
  DollarSign,
  Target,
  Zap
} from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, Bar, PieChart as RechartsPie, Cell } from "recharts";

const Relatorios = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<any>();
  const [reportType, setReportType] = useState("financeiro");
  const [period, setPeriod] = useState("mensal");

  const { data: transactions } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: marketItems } = useQuery({
    queryKey: ['market_items', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Dados do gráfico de gastos por categoria
  const expensesByCategory = transactions?.filter(t => t.type === 'expense')
    .reduce((acc: any, transaction) => {
      const category = transaction.category || 'Outros';
      acc[category] = (acc[category] || 0) + Math.abs(Number(transaction.amount));
      return acc;
    }, {});

  const categoryData = Object.entries(expensesByCategory || {}).map(([name, value]) => ({
    name,
    value: Number(value),
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  // Dados do gráfico mensal
  const monthlyData = transactions?.reduce((acc: any, transaction) => {
    const month = format(new Date(transaction.transaction_date), 'MMM', { locale: ptBR });
    const amount = Number(transaction.amount);
    
    if (!acc[month]) {
      acc[month] = { month, receitas: 0, despesas: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].receitas += amount;
    } else {
      acc[month].despesas += Math.abs(amount);
    }
    
    return acc;
  }, {});

  const chartData = Object.values(monthlyData || {});

  const totalIncome = transactions?.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  
  const totalExpenses = transactions?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0;

  const marketValue = marketItems?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0;

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatórios</h1>
              <p className="text-muted-foreground">Análise detalhada dos seus dados financeiros</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filtros */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle>Filtros do Relatório</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="mercado">Lista de Compras</SelectItem>
                    <SelectItem value="viagens">Viagens</SelectItem>
                    <SelectItem value="completo">Relatório Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Última Semana</SelectItem>
                    <SelectItem value="mensal">Último Mês</SelectItem>
                    <SelectItem value="trimestral">Último Trimestre</SelectItem>
                    <SelectItem value="anual">Último Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Personalizada</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yy")} -{" "}
                            {format(dateRange.to, "dd/MM/yy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yy")
                        )
                      ) : (
                        <span>Selecionar período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange as any}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Receitas</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-success">+15.2% vs período anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Despesas</CardTitle>
              <TrendingDown className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-destructive">+8.7% vs período anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Líquido</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {(totalIncome - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-success">Saldo positivo</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gastos Estimados</CardTitle>
              <Target className="w-4 h-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {marketValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-warning">Lista de compras</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                Receitas vs Despesas (Mensal)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBar data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Bar dataKey="receitas" fill="hsl(var(--success))" name="Receitas" />
                    <Bar dataKey="despesas" fill="hsl(var(--destructive))" name="Despesas" />
                  </RechartsBar>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Gastos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie data={categoryData}>
                      <Tooltip 
                        formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                      />
                      <RechartsPie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPie>
                    </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights e Recomendações */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Insights e Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-success">✅ Ponto Positivo</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Suas receitas estão 15% acima do mês anterior
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-warning">⚠️ Atenção</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Gastos com alimentação aumentaram 20% este mês
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-primary">💡 Dica</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Considere criar um orçamento para controlar melhor os gastos
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Meta de economia: R$ 500/mês</Badge>
              <Badge variant="outline">Categoria com mais gastos: Alimentação</Badge>
              <Badge variant="outline">Melhor dia para compras: Terça-feira</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Relatorios;