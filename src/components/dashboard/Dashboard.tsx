import { motion } from "framer-motion";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChartCard";
import { CashFlowChart } from "./CashFlowChart";
import { ExpensesByCategoryChart } from "./ExpensesByCategoryChart";
import { UpcomingBillsCard } from "./UpcomingBillsCard";
import { LowStockAlert } from "./LowStockAlert";
import { RecentTransactions } from "./RecentTransactions";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Target,
  AlertTriangle
} from "lucide-react";

export function Dashboard() {
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
          value="R$ 12.450"
          change={{ value: "+5.2%", type: "positive" }}
          icon={Wallet}
          description="Todas as contas"
        />
        <StatCard
          title="Receita do Mês"
          value="R$ 8.900"
          change={{ value: "+2.1%", type: "positive" }}
          icon={TrendingUp}
          description="Janeiro 2024"
        />
        <StatCard
          title="Gastos do Mês"
          value="R$ 6.750"
          change={{ value: "-3.8%", type: "positive" }}
          icon={TrendingDown}
          description="Janeiro 2024"
        />
        <StatCard
          title="Próximas Contas"
          value="R$ 3.480"
          change={{ value: "7 contas", type: "neutral" }}
          icon={CreditCard}
          description="Próximos 30 dias"
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
          title="Meta de Economia"
          value="85%"
          change={{ value: "R$ 1.700 de R$ 2.000", type: "positive" }}
          icon={Target}
          description="Meta mensal atingida"
        />
        <StatCard
          title="Investimentos"
          value="R$ 28.500"
          change={{ value: "+12.5%", type: "positive" }}
          icon={TrendingUp}
          description="Rendimento anual"
        />
        <StatCard
          title="Alertas Ativos"
          value="5"
          change={{ value: "2 críticos", type: "negative" }}
          icon={AlertTriangle}
          description="Itens que precisam atenção"
        />
      </div>

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingBillsCard />
        <LowStockAlert />
        <RecentTransactions />
      </div>
    </div>
  );
}