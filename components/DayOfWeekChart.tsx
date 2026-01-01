import React, { useMemo, useState } from 'react';
import { ReportData } from '../types';
import { formatCurrency } from '../utils';

const DAYS = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'];
const FULL = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export const DayOfWeekChart: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
  const [sel, setSel] = useState<number | null>(null);

  const data = useMemo(() => {
    const s = Array(7).fill(0);
    const c = Array(7).fill(0);

    reportData?.categories?.forEach(cat => {
      cat.transactions?.forEach(t => {
        if (!t.date) return;
        const p = t.date.split('-').map(Number);
        if (p.length === 3 && !isNaN(p[0]) && !isNaN(p[1]) && !isNaN(p[2])) {
          const d = new Date(p[0], p[1] - 1, p[2]);
          if (!isNaN(d.getTime())) {
            s[d.getDay()] += (-t.amount / 1000);
            c[d.getDay()]++;
          }
        }
      });
    });

    const max = Math.max(...s, 1);
    return DAYS.map((n, i) => ({
      n,
      full: FULL[i],
      amt: s[i],
      count: c[i],
      perc: (s[i] / max) * 100
    }));
  }, [reportData]);

  const avg = data.reduce((s, d) => s + d.amt, 0) / 7;

  // Function to get color based on percentage (Lighter to Darker)
  const getBarColor = (perc: number) => {
    if (perc < 25) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (perc < 50) return 'bg-teal-300 dark:bg-teal-700/50';
    if (perc < 75) return 'bg-teal-500';
    return 'bg-emerald-700 dark:bg-emerald-600';
  };

  return (
    <div className="chart-panel p-6">
      <div className="flex justify-end mb-6 px-1">
        <div className="text-right">
          <span className="text-lg font-black text-strong">{formatCurrency(avg)}</span>
          <div className="kicker-label">ORTALAMA</div>
        </div>
      </div>

      <div className="flex items-end gap-2.5 h-32 mb-6 px-1">
        {data.map((d, i) => (
          <button
            key={i}
            onClick={() => setSel(sel === i ? null : i)}
            className={`flex-1 flex flex-col items-center group relative transition-all duration-300`}
          >
            {/* Value Label on Top (Visible on hover or selection) */}
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${sel === i ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <span className="text-[9px] font-black text-emerald-600 whitespace-nowrap">{formatCurrency(d.amt).split(',')[0]}</span>
            </div>

            <div className="w-full flex items-end justify-center h-24">
              <div
                className={`w-full max-w-[24px] rounded-full transition-all duration-500 shadow-sm ${getBarColor(d.perc)} ${sel === i ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-zinc-900 scale-x-110' : ''}`}
                style={{ height: `${Math.max(d.perc, 8)}%` }}
              />
            </div>
            <span className={`text-[10px] font-black mt-3 transition-colors ${sel === i ? 'text-emerald-600' : 'text-gray-400'}`}>
              {d.n}
            </span>
          </button>
        ))}
      </div>

      {sel !== null && (
        <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl animate-spring-in border border-black/5 dark:border-white/5">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[14px] font-black text-strong uppercase tracking-tight">{data[sel].full}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{data[sel].count} İŞLEM BULUNUYOR</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black text-strong tracking-tighter">{formatCurrency(data[sel].amt)}</div>
              <div className={`text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1 ${data[sel].amt > avg ? 'text-orange-500' : 'text-green-500'}`}>
                {data[sel].amt > avg ? '▲ ORT. ÜSTÜ' : '▼ ORT. ALTI'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayOfWeekChart;
