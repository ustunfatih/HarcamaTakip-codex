import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '../utils';

interface MerchantParetoChartProps {
  data: Array<{ name: string; amount: number }>;
  total: number;
}

export const MerchantParetoChart: React.FC<MerchantParetoChartProps> = ({ data, total }) => {
  const chartData = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.amount - a.amount).slice(0, 8);
    let cumulative = 0;
    return sorted.map((d) => {
      cumulative += d.amount;
      return {
        name: d.name.length > 10 ? `${d.name.slice(0, 10)}…` : d.name,
        amount: d.amount,
        cumulative: total > 0 ? (cumulative / total) * 100 : 0
      };
    });
  }, [data, total]);

  if (!chartData.length) return null;

  return (
    <div className="chart-panel p-4">
      <div className="section-header">
        <span className="section-kicker">PARETO</span>
        <h2 className="section-title">Satici Yogunlugu</h2>
        <p className="section-subtitle">Harcamalarin buyuk bolumu az sayida saticida</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `₺${Math.round(v / 1000)}k`} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: 12, border: 'none', color: '#fff' }}
              formatter={(value: number, name: string) => name === 'cumulative' ? [`%${value.toFixed(1)}`, 'Kümülatif'] : [formatCurrency(value), 'Harcama']}
            />
            <Bar yAxisId="left" dataKey="amount" fill="#0f766e" radius={[8, 8, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
