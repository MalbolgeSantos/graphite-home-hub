import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Alimentação", value: 2800, color: "hsl(var(--accent))" },
  { name: "Transporte", value: 1200, color: "hsl(var(--primary))" },
  { name: "Moradia", value: 1800, color: "hsl(var(--success))" },
  { name: "Saúde", value: 600, color: "hsl(var(--warning))" },
  { name: "Lazer", value: 900, color: "hsl(262 48% 60%)" },
  { name: "Educação", value: 500, color: "hsl(38 92% 60%)" },
  { name: "Outros", value: 400, color: "hsl(var(--muted-foreground))" },
];

export function ExpensesByCategoryChart() {
  const renderCustomLabel = ({ name, value, percent }: any) => {
    return percent > 0.08 ? `${name} ${(percent * 100).toFixed(0)}%` : '';
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="hsl(var(--primary))"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))", 
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
            formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Gasto"]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}