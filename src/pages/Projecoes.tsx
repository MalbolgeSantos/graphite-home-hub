import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  TrendingUp, 
  Target, 
  Calculator, 
  PiggyBank,
  Zap,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  LineChart
} from "lucide-react";
import { ResponsiveContainer, LineChart as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Line, AreaChart, Area } from "recharts";

const Projecoes = () => {
  const { user } = useAuth();
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [timeframe, setTimeframe] = useState("12");

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

  // Calcular médias mensais
  const monthlyIncome = transactions?.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
  
  const monthlyExpenses = transactions?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0;

  const monthlySavings = monthlyIncome - monthlyExpenses;

  // Gerar dados de projeção
  const generateProjectionData = () => {
    const months = parseInt(timeframe);
    const data = [];
    let currentSavings = 0;
    
    for (let i = 0; i <= months; i++) {
      currentSavings += monthlyContribution;
      data.push({
        month: `Mês ${i}`,
        savings: currentSavings,
        goal: savingsGoal,
        conservative: currentSavings * 0.8,
        optimistic: currentSavings * 1.2
      });
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  
  // Calcular quando a meta será atingida
  const monthsToGoal = Math.ceil(savingsGoal / monthlyContribution);
  const goalAchievable = monthsToGoal <= parseInt(timeframe);

  // Simular crescimento com juros compostos
  const generateInvestmentProjection = () => {
    const months = parseInt(timeframe);
    const monthlyRate = 0.01; // 1% ao mês (12% ao ano)
    const data = [];
    let currentValue = 0;
    
    for (let i = 0; i <= months; i++) {
      currentValue = currentValue * (1 + monthlyRate) + monthlyContribution;
      data.push({
        month: `Mês ${i}`,
        simplesSavings: i * monthlyContribution,
        withInterest: currentValue
      });
    }
    
    return data;
  };

  const investmentData = generateInvestmentProjection();

  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Projeções Financeiras</h1>
            <p className="text-muted-foreground">Planeje seu futuro financeiro com projeções inteligentes</p>
          </div>
        </motion.div>

        {/* Situação Atual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita Mensal</CardTitle>
              <TrendingUp className="w-4 h-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-success">Média baseada no histórico</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gastos Mensais</CardTitle>
              <DollarSign className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-destructive">Média dos últimos meses</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sobra Mensal</CardTitle>
              <PiggyBank className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-foreground">
                R$ {monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-primary">Disponível para poupança</p>
            </CardContent>
          </Card>
        </div>

        {/* Simulador de Metas */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Simulador de Metas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Meta de Poupança (R$)</Label>
                <Input 
                  id="goal"
                  type="number" 
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  className="text-lg font-semibold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contribution">Contribuição Mensal (R$)</Label>
                <Input 
                  id="contribution"
                  type="number" 
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="text-lg font-semibold"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeframe">Período (meses)</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">1 ano</SelectItem>
                    <SelectItem value="24">2 anos</SelectItem>
                    <SelectItem value="36">3 anos</SelectItem>
                    <SelectItem value="60">5 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {goalAchievable ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                    <h4 className="font-semibold">
                      {goalAchievable ? "Meta Alcançável!" : "Meta Desafiadora"}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {goalAchievable 
                      ? `Você atingirá sua meta em ${monthsToGoal} meses`
                      : `Você precisará de ${monthsToGoal} meses para atingir esta meta`
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Progresso da Meta</Label>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (monthlyContribution * parseInt(timeframe)) / savingsGoal * 100)}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>R$ 0</span>
                    <span>R$ {savingsGoal.toLocaleString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Resumo da Projeção</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total poupado:</span>
                    <span className="font-semibold">
                      R$ {(monthlyContribution * parseInt(timeframe)).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meta desejada:</span>
                    <span className="font-semibold">
                      R$ {savingsGoal.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diferença:</span>
                    <span className={`font-semibold ${
                      monthlyContribution * parseInt(timeframe) >= savingsGoal 
                        ? 'text-success' 
                        : 'text-destructive'
                    }`}>
                      R$ {Math.abs(savingsGoal - (monthlyContribution * parseInt(timeframe))).toLocaleString('pt-BR')}
                      {monthlyContribution * parseInt(timeframe) >= savingsGoal ? ' excedente' : ' faltante'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gráficos de Projeção */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                Projeção de Poupança
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="conservative" 
                      stackId="1" 
                      stroke="hsl(var(--muted-foreground))" 
                      fill="hsl(var(--muted-foreground))"
                      fillOpacity={0.2}
                      name="Cenário Conservador"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stackId="2" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                      name="Projeção Base"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="hsl(var(--destructive))" 
                      strokeDasharray="5 5"
                      name="Meta"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Simulação de Investimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLine data={investmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="simplesSavings" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      name="Poupança Simples"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withInterest" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Com Investimento (1% a.m.)"
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-success/10 rounded-lg">
                <p className="text-sm text-success">
                  💡 Investindo com 1% ao mês, você teria R$ {
                    investmentData[investmentData.length - 1]?.withInterest.toLocaleString('pt-BR') || 0
                  } ao invés de R$ {
                    investmentData[investmentData.length - 1]?.simplesSavings.toLocaleString('pt-BR') || 0
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estratégias e Dicas */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Estratégias Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">💰 Emergência</h4>
                <p className="text-sm text-muted-foreground">
                  Mantenha 6 meses de gastos como reserva de emergência
                </p>
                <Badge variant="outline" className="mt-2">
                  R$ {(monthlyExpenses * 6).toLocaleString('pt-BR')}
                </Badge>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-success mb-2">📈 Investimentos</h4>
                <p className="text-sm text-muted-foreground">
                  Diversifique seus investimentos para maximizar retornos
                </p>
                <Badge variant="outline" className="mt-2">Renda Fixa + Variável</Badge>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-warning mb-2">🎯 Metas SMART</h4>
                <p className="text-sm text-muted-foreground">
                  Defina metas específicas, mensuráveis e com prazo
                </p>
                <Badge variant="outline" className="mt-2">Planejamento</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Projecoes;