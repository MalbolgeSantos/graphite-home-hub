import { motion } from "framer-motion";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChartCard";
import { CashFlowChart } from "./CashFlowChart";
import { ExpensesByCategoryChart } from "./ExpensesByCategoryChart";
import { UpcomingBillsCard } from "./UpcomingBillsCard";
import { LowStockAlert } from "./LowStockAlert";
import { RecentTransactions } from "./RecentTransactions";
import { QuickActions } from "./QuickActions";
import { useHousehold } from "@/hooks/useHousehold";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Target,
  AlertTriangle
} from "lucide-react";

export function Dashboard() {
  const { household } = useHousehold();

  // Fetch transactions for current household
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', household?.id],
    queryFn: async () => {
      if (!household?.id) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('household_id', household.id)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!household?.id,
  });

  // Fetch accounts for current household
  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts', household?.id],
    queryFn: async () => {
      if (!household?.id) return [];
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('household_id', household.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!household?.id,
  });

  // Calculate real stats from data
  const totalBalance = accounts?.reduce((sum, account) => sum + (Number(account.opening_balance) || 0), 0) || 0;
  const monthlyIncome = transactions?.filter(t => 
    t.type === 'income' && 
    new Date(t.transaction_date).getMonth() === new Date().getMonth()
  ).reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;
  
  const monthlyExpenses = transactions?.filter(t => 
    t.type === 'expense' && 
    new Date(t.transaction_date).getMonth() === new Date().getMonth()
  ).reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0) || 0;

  if (transactionsLoading || accountsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bem-vindos de volta! 👋
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo da sua situação financeira e doméstica de hoje.
        </p>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Total"
          value={`R$ ${totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={{ value: totalBalance > 0 ? "+5.2%" : "0%", type: totalBalance > 0 ? "positive" : "neutral" }}
          icon={Wallet}
          description="Todas as contas"
        />
        <StatCard
          title="Receita do Mês"
          value={`R$ ${monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={{ value: monthlyIncome > 0 ? "+2.1%" : "0%", type: monthlyIncome > 0 ? "positive" : "neutral" }}
          icon={TrendingUp}
          description="Este mês"
        />
        <StatCard
          title="Gastos do Mês"
          value={`R$ ${monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={{ value: monthlyExpenses > 0 ? "-3.8%" : "0%", type: monthlyExpenses > 0 ? "negative" : "neutral" }}
          icon={TrendingDown}
          description="Este mês"
        />
        <StatCard
          title="Contas Cadastradas"
          value={accounts?.length.toString() || "0"}
          change={{ value: `${accounts?.length || 0} ativas`, type: "neutral" }}
          icon={CreditCard}
          description="Total de contas"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Fluxo de Caixa (12 meses)">
          <CashFlowChart />
        </ChartCard>
        <ChartCard title="Gastos por Categoria">
          <ExpensesByCategoryChart />
        </ChartCard>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Transações do Mês"
          value={transactions?.filter(t => 
            new Date(t.transaction_date).getMonth() === new Date().getMonth()
          ).length.toString() || "0"}
          change={{ value: `${transactions?.length || 0} total`, type: "neutral" }}
          icon={Target}
          description="Transações registradas"
        />
        <StatCard
          title="Contas Ativas"
          value={accounts?.filter(a => !a.is_archived).length.toString() || "0"}
          change={{ value: `${accounts?.filter(a => a.is_archived).length || 0} arquivadas`, type: "neutral" }}
          icon={TrendingUp}
          description="Contas em uso"
        />
        <StatCard
          title="Saldo Líquido"
          value={`R$ ${(totalBalance - monthlyExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          change={{ value: "Este mês", type: totalBalance > monthlyExpenses ? "positive" : "negative" }}
          icon={AlertTriangle}
          description="Saldo após despesas"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingBillsCard />
        <LowStockAlert />
        <RecentTransactions />
      </div>
    </div>
  );
}