import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { ReportData } from '../types';
import { formatCurrency } from '../utils';

export const SpendingVelocityMeter: React.FC<{ reportData: ReportData; monthlyBudget?: number }> = ({ reportData, monthlyBudget = 50000 }) => {
  const { totalSpent, startDate, endDate } = reportData;
  const d = useMemo(() => {
    const s = new Date(startDate); const e = new Date(endDate); const t = new Date();
    const tD = Math.ceil((e.getTime() - s.getTime()) / 864e5) + 1;
    const dP = Math.max(1, Math.ceil((t.getTime() - s.getTime()) / 864e5));
    const iR = monthlyBudget / tD; const aR = totalSpent / dP; const r = aR / iR;
    let st: 'under' | 'on' | 'over' | 'danger' = 'under';
    if (r > 1.5) st = 'danger'; else if (r > 1.15) st = 'over'; else if (r > 0.85) st = 'on';
    return { aR, iR, r, pT: aR * tD, st, dP, tD };
  }, [reportData, monthlyBudget]);

  const cfg: any = { under: { c: 'text-emerald-500', b: 'bg-emerald-500/10', i: TrendingDown, l: 'Düşük' }, on: { c: 'text-teal-600', b: 'bg-teal-500/10', i: Minus, l: 'Normal' }, over: { c: 'text-orange-500', b: 'bg-orange-500/10', i: TrendingUp, l: 'Hızlı' }, danger: { c: 'text-red-500', b: 'bg-red-500/10', i: Zap, l: 'Tehlike' } }[d.st];

  return (
    <div className="chart-panel p-5">
      <div className="flex justify-between mb-4"><span className="text-[10px] uppercase font-bold text-gray-500">Harcama Hızı</span><div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${cfg.b} ${cfg.c} text-[10px] font-bold`}><cfg.i size={12} />{cfg.l}</div></div>
      <div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full relative mb-6"><div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-500 shadow-lg transition-all`} style={{ left: `${Math.min(Math.max((d.r - 0.5) * 100, 0), 100)}%` }} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-gray-500">Günlük</div><div className="font-bold">{formatCurrency(d.aR)}</div>
          <div className="text-[10px] text-gray-400">İdeal: {formatCurrency(d.iR)}</div>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-gray-500">Tahmini</div><div className={`font-bold ${d.pT > monthlyBudget ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(d.pT)}</div>
          <div className="text-[10px] text-gray-400">{d.pT > monthlyBudget ? '+' : ''}{formatCurrency(d.pT - monthlyBudget)} fark</div>
        </div>
      </div>
    </div>
  );
};
export default SpendingVelocityMeter;
