import React, { useMemo, useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { ReportData } from '../types';
import { formatCurrency } from '../utils';

const COLORS = {
  light: ['heatmap-0', 'heatmap-1', 'heatmap-2', 'heatmap-3', 'heatmap-4', 'heatmap-5'],
  dark: ['heatmap-0', 'heatmap-1', 'heatmap-2', 'heatmap-3', 'heatmap-4', 'heatmap-5']
};

export const SpendingHeatmapCalendar: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
  const [sel, setSel] = useState<any>(null);
  const data = useMemo(() => {
    const { categories, startDate, endDate } = reportData;
    const map: Record<string, any> = {};
    categories.forEach(c => c.transactions.forEach(t => {
      const k = t.date.split('T')[0]; if (!map[k]) map[k] = { amount: 0, count: 0 };
      map[k].amount += -t.amount / 1000; map[k].count++;
    }));
    const days: any[] = []; let curr = new Date(startDate); const end = new Date(endDate);
    while (curr <= end) {
      const k = curr.toISOString().split('T')[0]; const s = map[k] || { amount: 0, count: 0 };
      days.push({ date: new Date(curr), dateStr: k, amount: s.amount, count: s.count });
      curr.setDate(curr.getDate() + 1);
    }
    const amounts = days.map(d => d.amount).filter(a => a > 0); const max = Math.max(...amounts, 1);
    days.forEach(d => d.intensity = d.amount === 0 ? 0 : Math.min(Math.ceil((d.amount / max) * 5), 5));
    const weeks: any[][] = []; let cW: any[] = Array((days[0]?.date.getDay() + 6) % 7).fill({ intensity: -1 });
    days.forEach(d => { cW.push(d); if (cW.length === 7) { weeks.push(cW); cW = []; } });
    if (cW.length) { while (cW.length < 7) cW.push({ intensity: -1 }); weeks.push(cW); }
    return { weeks, max, avg: amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0 };
  }, [reportData]);

  const colors = (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'))
    ? COLORS.dark
    : COLORS.light;

  return (
    <div className="chart-panel p-5">
      <div className="flex items-center gap-2 mb-4 text-gray-500 uppercase text-[10px] font-bold"><Calendar size={14} /><span>Harcama Haritası</span></div>
      <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
        {data.weeks.map((w, i) => (
          <div key={i} className="flex flex-col gap-1">
            {w.map((d, j) => (
              <button key={j} onClick={() => d.amount >= 0 && setSel(d)} disabled={d.intensity === -1} className={`w-3 h-3 rounded-sm ${d.intensity === -1 ? 'bg-transparent' : colors[d.intensity]} hover:ring-1 hover:ring-emerald-500`} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 pt-4 border-t border-black/5">
        <div><div className="text-[10px] font-bold text-gray-500 uppercase">En Yüksek</div><div className="font-bold">{formatCurrency(data.max)}</div></div>
        <div className="text-right"><div className="text-[10px] font-bold text-gray-500 uppercase">Ortalama</div><div className="font-bold">{formatCurrency(data.avg)}</div></div>
      </div>
      {sel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSel(null)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-xs" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4"><div><div className="font-bold">{sel.date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</div><div className="text-xs text-gray-500">{sel.date.toLocaleDateString('tr-TR', { weekday: 'long' })}</div></div><button onClick={() => setSel(null)}><X size={20} /></button></div>
            <div className="text-center mb-4"><div className="text-3xl font-bold">{formatCurrency(sel.amount)}</div><div className="text-xs text-gray-500 mt-1">{sel.count} işlem</div></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SpendingHeatmapCalendar;
