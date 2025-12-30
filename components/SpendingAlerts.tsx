import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { ReportData } from '../types';
import { formatCurrency } from '../utils';

export const SpendingAlerts: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
  const alerts = useMemo(() => {
    const list: any[] = [];
    const { totalSpent, categories, comparisonData, startDate, endDate, potentialDuplicates } = reportData;
    const start = new Date(startDate); const end = new Date(endDate);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysPassed = Math.max(1, Math.ceil((new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const avg = totalSpent / Math.min(daysPassed, totalDays);

    if (comparisonData?.length) {
      const last = comparisonData[comparisonData.length - 1];
      const change = last.previous > 0 ? ((last.current - last.previous) / last.previous) * 100 : 0;
      if (change > 20) list.push({ type: 'danger', title: 'Artış', msg: `%${change.toFixed(0)} artış`, icon: TrendingUp, val: `+${formatCurrency(last.current - last.previous)}` });
      else if (change < -10) list.push({ type: 'success', title: 'Tasarruf', msg: `%${Math.abs(change).toFixed(0)} tasarruf`, icon: TrendingDown, val: formatCurrency(last.previous - last.current) });
    }
    if (categories.length && (categories[0].totalAmount / totalSpent) > 0.4) {
      list.push({ type: 'warning', title: 'Yoğunluk', msg: `"${categories[0].categoryName}" %${((categories[0].totalAmount / totalSpent) * 100).toFixed(0)}`, icon: Target, val: formatCurrency(categories[0].totalAmount) });
    }
    if (avg * 30 > 50000) list.push({ type: 'info', title: 'Hız', msg: `Tahmini ay sonu: ${formatCurrency(avg * 30)}`, icon: Zap });
    if (potentialDuplicates?.length) list.push({ type: 'danger', title: 'Mükerrer?', msg: `${potentialDuplicates.length} şüpheli işlem`, icon: AlertCircle, val: formatCurrency(potentialDuplicates.reduce((s, i) => s + i.amount, 0)) });
    if (!list.length) list.push({ type: 'success', title: 'Normal', msg: 'Harcamalar dengeli.', icon: CheckCircle });
    return list;
  }, [reportData]);

  const styleMap: any = { danger: 'bg-red-500/10 text-red-500', success: 'bg-emerald-500/10 text-emerald-500', warning: 'bg-orange-500/10 text-orange-500', info: 'bg-emerald-500/10 text-emerald-500' };

  return (
    <div className="space-y-3">
      {alerts.map((a, i) => (
        <div key={i} className={`${styleMap[a.type]} rounded-2xl p-4 flex gap-3`}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0"><a.icon size={20} /></div>
          <div className="flex-1">
            <div className="flex justify-between font-bold text-sm"><span>{a.title}</span>{a.val && <span>{a.val}</span>}</div>
            <p className="text-xs opacity-80">{a.msg}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SpendingAlerts;
