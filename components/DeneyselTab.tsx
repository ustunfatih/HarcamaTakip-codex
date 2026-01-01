import React, { useMemo, useState, useRef } from 'react';
import { ReportData, CategorySpending } from '../types';
import { formatCurrency } from '../utils';
import { CollapsibleSection } from './CollapsibleSection';
import { SpendingAlerts } from './SpendingAlerts';
import { SpendingVelocityMeter } from './SpendingVelocityMeter';
import {
  Bell, TrendingUp, Activity, ShoppingBag,
  Sparkles, Trophy, Flame, Utensils, Coins, Scale,
  ChevronLeft, ChevronRight, Zap, AlertCircle, TrendingDown, Award
} from 'lucide-react';

interface DeneyselTabProps { reportData: ReportData; personName?: string; }

/* =========================
   AI INSIGHT HERO CARD
========================= */
const AIInsightHero: React.FC<{ reportData: ReportData; personName?: string }> = ({ reportData, personName }) => {
  const insight = useMemo(() => {
    const { categories, totalSpent, startDate, endDate } = reportData;
    if (!categories?.length || totalSpent === 0) return null;

    const sorted = [...categories].sort((a, b) => b.totalAmount - a.totalAmount);
    const topCat = sorted[0];
    const topPerc = ((topCat.totalAmount / totalSpent) * 100).toFixed(0);

    // Calculate time range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dailyAvg = totalSpent / days;

    // Find weekend vs weekday spending
    let weekendSpend = 0, weekdaySpend = 0;
    categories.forEach(cat => {
      cat.transactions?.forEach(tx => {
        if (!tx.date) return;
        const parts = tx.date.split('-').map(Number);
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          const day = d.getDay();
          const amt = Math.abs(-tx.amount / 1000);
          if (day === 0 || day === 6) weekendSpend += amt;
          else weekdaySpend += amt;
        }
      });
    });

    const weekendRatio = weekendSpend / totalSpent;

    // Generate insights based on data
    const insights = [];

    if (parseFloat(topPerc) > 40) {
      insights.push({
        icon: <AlertCircle className="text-orange-500" size={20} />,
        title: `${topCat.categoryName} Ağırlıklı Harcama`,
        message: `Bu dönemde harcamalarının %${topPerc}'i ${topCat.categoryName} kategorisinde. Bütçeni gözden geçirmek isteyebilirsin.`,
        color: 'orange'
      });
    }

    if (weekendRatio > 0.45) {
      insights.push({
        icon: <Flame className="text-red-500" size={20} />,
        title: 'Hafta Sonu Yoğunluğu',
        message: `Harcamalarının %${(weekendRatio * 100).toFixed(0)}'ı hafta sonları gerçekleşmiş. Hafta içi daha dengeli harcayabilirsin.`,
        color: 'red'
      });
    }

    if (dailyAvg < 200) {
      insights.push({
        icon: <Award className="text-green-500" size={20} />,
        title: 'Tutumlu Dönem',
        message: `Günlük ortalama ${formatCurrency(dailyAvg)} ile oldukça kontrollü harcama yaptın. Tebrikler!`,
        color: 'green'
      });
    }

    if (insights.length === 0) {
      insights.push({
        icon: <Sparkles className="text-emerald-500" size={20} />,
        title: 'Dengeli Bütçe',
        message: `Bu dönemde ${formatCurrency(totalSpent)} harcadın. Kategoriler arası dağılım dengeli görünüyor.`,
        color: 'blue'
      });
    }

    return insights[0];
  }, [reportData]);

  if (!insight) return null;

  const bgColors: Record<string, string> = {
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-900/30',
    red: 'from-red-500/10 to-red-600/5 border-red-200 dark:border-red-900/30',
    green: 'from-green-500/10 to-green-600/5 border-green-200 dark:border-green-900/30',
    blue: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200 dark:border-emerald-900/30'
  };

  return (
    <div className={`fintech-card p-6 bg-gradient-to-br ${bgColors[insight.color]} border relative overflow-hidden`}>
      <div className="absolute top-0 right-0 p-6 opacity-10 transform scale-[4]">{insight.icon}</div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
            {insight.icon}
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Zap size={10} className="inline mr-1" />AI ANALİZ
          </div>
        </div>
        <h3 className="text-xl font-black text-strong mb-2">{insight.title}</h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{insight.message}</p>
      </div>
    </div>
  );
};

/* =========================
   BEHAVIORAL BADGES
========================= */
const BehavioralBadges: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
  const badges = useMemo(() => {
    const { categories, totalSpent, startDate, endDate } = reportData;
    if (!categories?.length) return [];

    const result: { label: string; color: string; icon: React.ReactNode }[] = [];

    // Calculate metrics
    let totalTx = 0, smallTxCount = 0, weekendSpend = 0, foodSpend = 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dailyAvg = totalSpent / days;

    categories.forEach(cat => {
      const isFood = ['yeme', 'içme', 'gıda', 'restoran', 'yemek', 'market', 'dining', 'food'].some(k => cat.categoryName.toLowerCase().includes(k));
      if (isFood) foodSpend += cat.totalAmount;

      cat.transactions?.forEach(tx => {
        totalTx++;
        const amt = Math.abs(-tx.amount / 1000);
        if (amt < 50) smallTxCount++;
        if (tx.date) {
          const parts = tx.date.split('-').map(Number);
          if (parts.length === 3) {
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            if (d.getDay() === 0 || d.getDay() === 6) weekendSpend += amt;
          }
        }
      });
    });

    // Generate badges
    if (dailyAvg < 150) result.push({ label: 'TUTUMLU', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <Award size={12} /> });
    if (dailyAvg > 500) result.push({ label: 'YÜKSEK HARCAMA', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <TrendingUp size={12} /> });
    if (weekendSpend / totalSpent > 0.4) result.push({ label: 'HAFTA SONU SAVAŞÇISI', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Flame size={12} /> });
    if (foodSpend / totalSpent > 0.3) result.push({ label: 'GURME', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <Utensils size={12} /> });
    if (smallTxCount / totalTx > 0.5) result.push({ label: 'UFAK TEFEK', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <Coins size={12} /> });
    if (totalTx > 50) result.push({ label: 'AKTİF HARCAYICI', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Activity size={12} /> });
    if (result.length === 0) result.push({ label: 'DENGELİ', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400', icon: <Scale size={12} /> });

    return result.slice(0, 4);
  }, [reportData]);

  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((b, i) => (
        <div key={i} className={`${b.color} px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest animate-spring-in`} style={{ animationDelay: `${i * 100}ms` }}>
          {b.icon}
          {b.label}
        </div>
      ))}
    </div>
  );
};

/* =========================
   MONTHLY SPENDING HEATMAP
========================= */
const MonthlyHeatmap: React.FC<{ reportData: ReportData }> = ({ reportData }) => {
  const [monthOffset, setMonthOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { heatmapData, maxSpend, monthLabel } = useMemo(() => {
    const categories = reportData.categories || [];

    // Get the target month based on offset
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();

    const monthNames = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
    const label = `${monthNames[month]} ${year}`;

    // Get days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

    // Build daily spending map
    const dailyMap: Record<number, number> = {};
    categories.forEach(cat => {
      cat.transactions?.forEach(tx => {
        if (!tx.date) return;
        const parts = tx.date.split('-').map(Number);
        if (parts.length === 3 && parts[0] === year && parts[1] - 1 === month) {
          const day = parts[2];
          dailyMap[day] = (dailyMap[day] || 0) + Math.abs(-tx.amount / 1000);
        }
      });
    });

    const max = Math.max(...Object.values(dailyMap), 1);
    const data: { day: number; amount: number; intensity: number }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const amt = dailyMap[d] || 0;
      data.push({ day: d, amount: amt, intensity: amt / max });
    }

    return { heatmapData: data, maxSpend: max, monthLabel: label, daysInMonth, firstDayOfWeek };
  }, [reportData, monthOffset]);

  const getColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100 dark:bg-zinc-800';
    if (intensity < 0.25) return 'bg-emerald-200 dark:bg-emerald-900/40';
    if (intensity < 0.5) return 'bg-emerald-400 dark:bg-emerald-700/60';
    if (intensity < 0.75) return 'bg-emerald-500 dark:bg-emerald-600';
    return 'bg-emerald-600 dark:bg-emerald-500';
  };

  const daysOfWeek = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

  return (
    <div className="fintech-card p-5 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonthOffset(o => o + 1)}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform"
        >
          <ChevronLeft size={16} className="text-gray-500" />
        </button>
        <div className="text-center">
          <div className="text-[14px] font-black text-strong uppercase tracking-tight">{monthLabel}</div>
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">HARCAMA YOĞUNLUĞU</div>
        </div>
        <button
          onClick={() => setMonthOffset(o => Math.max(0, o - 1))}
          disabled={monthOffset === 0}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-30"
        >
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {daysOfWeek.map(d => (
          <div key={d} className="text-[9px] font-black text-gray-400 text-center uppercase">{d}</div>
        ))}
      </div>

      {/* Heatmap grid */}
      <div ref={containerRef} className="grid grid-cols-7 gap-1">
        {/* Empty cells for alignment */}
        {Array.from({ length: new Date(heatmapData[0]?.day ? new Date().getFullYear() : 2024, monthOffset === 0 ? new Date().getMonth() : new Date().getMonth() - monthOffset, 1).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {heatmapData.map(d => (
          <div
            key={d.day}
            className={`aspect-square rounded-md ${getColor(d.intensity)} flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all group relative`}
            title={`${d.day}: ${formatCurrency(d.amount)}`}
          >
            <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 opacity-60 group-hover:opacity-100">{d.day}</span>
            {d.amount > 0 && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 tooltip-surface px-2 py-1 rounded-lg text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {formatCurrency(d.amount)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 mt-4">
        <span className="text-[9px] font-bold text-gray-400 mr-2">AZ</span>
        <div className="w-3 h-3 rounded bg-gray-100 dark:bg-zinc-800" />
        <div className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-900/40" />
        <div className="w-3 h-3 rounded bg-emerald-400 dark:bg-emerald-700/60" />
        <div className="w-3 h-3 rounded bg-emerald-500 dark:bg-emerald-600" />
        <div className="w-3 h-3 rounded bg-emerald-600 dark:bg-emerald-500" />
        <span className="text-[9px] font-bold text-gray-400 ml-2">ÇOK</span>
      </div>
    </div>
  );
};

/* =========================
   CASH FLOW SECTION
========================= */
const CashFlowSection: React.FC<{ stats: any }> = ({ stats }) => {
  const max = Math.max(stats.income, stats.expense);
  return (
    <div className="fintech-card p-5 space-y-5">
      <div className="flex justify-between items-end">
        <div><div className="text-[10px] font-black uppercase text-gray-400 mb-1">NET DURUM</div><div className={`text-2xl font-black tracking-tighter ${stats.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>{stats.net >= 0 ? '+' : ''}{formatCurrency(stats.net)}</div></div>
        <div className="text-right"><div className="text-[10px] font-black uppercase text-gray-400 mb-1">TASARRUF ORANI</div><div className="text-lg font-black text-emerald-600">%{stats.savingsRate.toFixed(1)}</div></div>
      </div>
      <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
        <div><div className="flex justify-between text-xs font-bold mb-1"><span>GELİR</span><span className="text-green-600">{formatCurrency(stats.income)}</span></div><div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.income / max) * 100}%` }} /></div></div>
        <div><div className="flex justify-between text-xs font-bold mb-1"><span>GİDER</span><span className="text-red-500">{formatCurrency(stats.expense)}</span></div><div className="h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${(stats.expense / max) * 100}%` }} /></div></div>
      </div>
    </div>
  );
};

/* =========================
   TOP MERCHANTS
========================= */
const TopMerchantsSection: React.FC<{ categories: CategorySpending[] }> = ({ categories }) => {
  const merchantData = useMemo(() => {
    const map: Record<string, any> = {};
    categories.forEach(cat => cat.transactions.forEach(tx => {
      const p = tx.payee_name || 'Bilinmeyen';
      if (!map[p]) map[p] = { total: 0, count: 0 };
      map[p].total += Math.abs(-tx.amount / 1000); map[p].count++;
    }));
    return Object.entries(map).map(([n, d]) => ({ name: n, ...d as any })).sort((a, b) => b.total - a.total).slice(0, 6);
  }, [categories]);

  return (
    <div className="space-y-1">
      {merchantData.map((m, i) => (
        <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[11px] font-black">{i + 1}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start"><span className="text-[13px] font-bold truncate text-strong uppercase tracking-tight">{m.name}</span><span className="text-[13px] font-black">{formatCurrency(m.total)}</span></div>
            <div className="text-[10px] text-gray-400 font-bold">{m.count} İŞLEM</div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */
export const DeneyselTab: React.FC<DeneyselTabProps> = ({ reportData, personName }) => {
  if (!reportData) return null;

  return (
    <div className="space-y-5 pb-20 animate-spring-in">
      {/* Header */}
      <div className="px-1 pt-4">
        <h1 className="text-2xl font-black tracking-tight mb-1">Finansal Lab</h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{personName && personName !== 'Tümü' ? `${personName} ANALİZİ` : 'AKILLI ANALİZLER'}</p>
      </div>

      {/* AI Insight Hero */}
      <AIInsightHero reportData={reportData} personName={personName} />

      {/* Behavioral Badges */}
      <BehavioralBadges reportData={reportData} />

      {/* Monthly Heatmap */}
      <MonthlyHeatmap reportData={reportData} />

      {/* Cash Flow */}
      <CashFlowSection stats={reportData.cashFlowStats} />

      {/* Collapsible Sections */}
      <CollapsibleSection title="Harcama Mekanları" subtitle="En çok harcanan yerler" icon={<ShoppingBag size={14} />} defaultExpanded={true} storageKey="merch">
        <TopMerchantsSection categories={reportData.categories} />
      </CollapsibleSection>

      <CollapsibleSection title="Harcama Hızı" icon={<TrendingUp size={14} />} defaultExpanded={false} storageKey="velo">
        <SpendingVelocityMeter reportData={reportData} monthlyBudget={reportData.historicalMonthlyAverage || 50000} />
      </CollapsibleSection>

      <CollapsibleSection title="Uyarılar" icon={<Bell size={14} />} defaultExpanded={false} storageKey="alerts">
        <SpendingAlerts reportData={reportData} />
      </CollapsibleSection>
    </div>
  );
};

export default DeneyselTab;
