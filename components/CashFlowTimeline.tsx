import React, { useMemo } from 'react';
import { Area, AreaChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ReportData } from '../types';
import { formatCurrency } from '../utils';

interface CashFlowTimelineProps {
  reportData: ReportData;
}

const formatMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase();
};

export const CashFlowTimeline: React.FC<CashFlowTimelineProps> = ({ reportData }) => {
  const data = useMemo(() => {
    const monthMap: Record<string, { month: string; income: number; expense: number; net: number }> = {};
    reportData.categories.forEach((category) => {
      category.transactions?.forEach((t) => {
        if (!t.date) return;
        const [year, month] = t.date.split('-');
        if (!year || !month) return;
        const key = `${year}-${month}`;
        if (!monthMap[key]) monthMap[key] = { month: key, income: 0, expense: 0, net: 0 };
        const amount = t.amount / 1000;
        if (amount > 0) {
          monthMap[key].income += amount;
        } else if (amount < 0) {
          monthMap[key].expense += Math.abs(amount);
        }
      });
    });

    return Object.values(monthMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((entry) => ({
        ...entry,
        net: entry.income - entry.expense,
        label: formatMonthLabel(entry.month)
      }));
  }, [reportData]);

  if (data.length === 0) return null;

  return (
    <div className="surface-card surface-card--muted p-4 space-y-3">
      <div className="section-header">
        <span className="section-kicker">AKIŞ</span>
        <h2 className="section-title">Nakit Akışı</h2>
        <p className="section-subtitle">Gelir - gider trendi</p>
      </div>
      <div className="flex flex-wrap gap-4 text-[11px] font-semibold text-muted uppercase tracking-[0.14em]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--hig-green)]" />
          Gelir
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--hig-orange)]" />
          Gider
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--hig-blue)]" />
          Net
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={40} />
            <Tooltip
              formatter={(value: number, name: string) => {
                const label = name === 'income' ? 'Gelir' : name === 'expense' ? 'Gider' : 'Net';
                return [formatCurrency(value), label];
              }}
              labelFormatter={(label) => `Ay: ${label}`}
            />
            <Area type="monotone" dataKey="income" stroke="var(--hig-green)" fill="rgba(34, 197, 94, 0.15)" strokeWidth={2} />
            <Area type="monotone" dataKey="expense" stroke="var(--hig-orange)" fill="rgba(245, 158, 11, 0.12)" strokeWidth={2} />
            <Line type="monotone" dataKey="net" stroke="var(--hig-blue)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
