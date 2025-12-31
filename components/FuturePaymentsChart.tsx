import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { FuturePaymentMonth, ExpandedScheduledTransaction } from '../types';
import { formatCurrency } from '../utils';
import { ChevronDown, ChevronUp, RefreshCw, Calendar } from 'lucide-react';

interface FuturePaymentsChartProps { monthlyData: FuturePaymentMonth[]; onMonthSelect?: (month: FuturePaymentMonth | null) => void; selectedMonth?: FuturePaymentMonth | null; }

const COLORS = ['#0f766e', '#0ea5e9', '#f97316', '#14b8a6', '#f59e0b', '#111827', '#38bdf8', '#94a3b8', '#22c55e', '#64748b'];

export const FuturePaymentsChart: React.FC<FuturePaymentsChartProps> = ({ monthlyData, onMonthSelect, selectedMonth }) => {
  const allCats = useMemo(() => Array.from(new Set(monthlyData.flatMap(m => m.categories.map(c => c.categoryName)))), [monthlyData]);
  const cColorMap = useMemo(() => allCats.reduce((a, c, i) => ({ ...a, [c]: COLORS[i % COLORS.length] }), {} as any), [allCats]);
  const chartData = useMemo(() => monthlyData.map(m => ({ month: m.month, label: m.label, total: m.total, _original: m, ...m.categories.reduce((a, c) => ({ ...a, [c.categoryName]: Math.abs(c.amount) }), {}) })), [monthlyData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const m = payload[0].payload._original as FuturePaymentMonth;
    return (
      <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-xl border border-black/5 min-w-[180px]">
        <div className="text-[13px] font-bold mb-2">{m.label}</div>
        <div className="space-y-1">
          {m.categories.slice(0, 5).map(c => (
            <div key={c.categoryId} className="flex justify-between text-[11px]"><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cColorMap[c.categoryName] }} />{c.categoryName}</div><span>{formatCurrency(c.amount)}</span></div>
          ))}
        </div>
        <div className="mt-2 pt-2 border-t border-black/5 flex justify-between font-bold text-[13px]"><span>Toplam</span><span>{formatCurrency(m.total)}</span></div>
      </div>
    );
  };

  const getBarColor = (val: number, max: number) => {
    const perc = (val / max) * 100;
    if (perc < 30) return '#d1fae5';
    if (perc < 60) return '#5eead4';
    return '#0f766e';
  };

  const maxTotal = useMemo(() => Math.max(...monthlyData.map(m => m.total), 1), [monthlyData]);

  if (!monthlyData.length) return <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-[24px] border border-black/5"><Calendar className="mx-auto text-gray-300 mb-2" size={32} /><p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">ÖDENECEK İŞLEM BULUNAMADI</p></div>;

  /* Custom tick renderer for two-line axis labels */
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const parts = payload.value.split(' ');
    const month = parts[0] || '';
    const year = parts[1] || '';
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={12} textAnchor="middle" fontSize={8} fontWeight={900} fill="#9CA3AF">
          {month}
        </text>
        <text x={0} y={0} dy={22} textAnchor="middle" fontSize={7} fontWeight={700} fill="#D1D5DB">
          {year}
        </text>
      </g>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} onClick={e => onMonthSelect?.(e?.activePayload?.[0]?.payload?._original)} margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
            <XAxis dataKey="label" tick={<CustomXAxisTick />} height={50} axisLine={false} tickLine={false} interval={0} />

            <YAxis hide />

            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="total"
              radius={[20, 20, 20, 20]}
              barSize={24}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.total, maxTotal)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const MonthDetail: React.FC<{ month: FuturePaymentMonth; categoryColorMap: any; onClose: () => void }> = ({ month, onClose }) => {
  return (
    <div className="fintech-card overflow-hidden animate-spring-in bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-2xl">
      <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
        <div>
          <div className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-0.5">AY DETAYLARI</div>
          <div className="text-xl font-black uppercase tracking-tight">{month.label}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-0.5">TOPLAM</div>
          <div className="text-xl font-black tracking-tight">{formatCurrency(month.total)}</div>
        </div>
      </div>

      <div className="p-4 max-h-[400px] overflow-y-auto space-y-2 no-scrollbar">
        {month.categories.map((c, i) => (
          <div key={c.categoryId} className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 flex justify-between items-center transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                <span className="text-[10px] font-black">{c.categoryName.charAt(0)}</span>
              </div>
              <div className="text-[13px] font-black text-[#191919] dark:text-white uppercase truncate max-w-[150px] tracking-tight">{c.categoryName}</div>
            </div>
            <div className="text-[14px] font-black">{formatCurrency(c.amount)}</div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="w-full py-4 bg-[#191919] dark:bg-white text-white dark:text-[#191919] rounded-2xl font-black text-xs uppercase tracking-widest active:scale-[0.98] transition-all">PENCEREYİ KAPAT</button>
      </div>
    </div>
  );
};
export default FuturePaymentsChart;
