import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { month: "Jan", receitas: 8500, despesas: 6200, saldo: 2300 },
  { month: "Fev", receitas: 7800, despesas: 5900, saldo: 1900 },
  { month: "Mar", receitas: 9200, despesas: 7100, saldo: 2100 },
  { month: "Abr", receitas: 8900, despesas: 6800, saldo: 2100 },
  { month: "Mai", receitas: 9500, despesas: 7200, saldo: 2300 },
  { month: "Jun", receitas: 8700, despesas: 6500, saldo: 2200 },
  { month: "Jul", receitas: 9100, despesas: 6900, saldo: 2200 },
  { month: "Ago", receitas: 8800, despesas: 6600, saldo: 2200 },
  { month: "Set", receitas: 9300, despesas: 7000, saldo: 2300 },
  { month: "Out", receitas: 8600, despesas: 6400, saldo: 2200 },
  { month: "Nov", receitas: 9000, despesas: 6800, saldo: 2200 },
  { month: "Dez", receitas: 9400, despesas: 7100, saldo: 2300 },
];

export function CashFlowChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number, name: string) => [
              `R$ ${value.toLocaleString()}`, 
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="receitas" 
            stroke="hsl(var(--success))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
            name="Receitas"
          />
          <Line 
            type="monotone" 
            dataKey="despesas" 
            stroke="hsl(var(--destructive))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
            name="Despesas"
          />
          <Line 
            type="monotone" 
            dataKey="saldo" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
            name="Saldo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}