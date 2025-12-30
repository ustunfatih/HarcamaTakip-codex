import React, { useState, useEffect, useMemo } from 'react';
import { YNABService } from '../services/ynabService';
import { FuturePaymentMonth, FutureCategoryBreakdown, ExpandedScheduledTransaction } from '../types';
import { FuturePaymentsChart, MonthDetail } from './FuturePaymentsChart';
import { formatCurrency } from '../utils';
import { Loader2, Calendar, RefreshCw, Clock } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import HapticButton from './HapticButton';
import { SegmentedControl } from './SegmentedControl';

interface GelecekTabProps { budgetId: string; selectedFlag: string; accountId: string; }

const COLORS = ['#0075FF', '#00C853', '#FF3B30', '#FF9500', '#AF52DE', '#5856D6', '#FF2D55', '#34C759', '#5AC8FA'];
const MONTHS = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];

export const GelecekTab: React.FC<GelecekTabProps> = ({ budgetId, selectedFlag, accountId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<ExpandedScheduledTransaction[]>([]);
  const [selected, setSelected] = useState<FuturePaymentMonth | null>(null);
  const [monthsAhead, setMonthsAhead] = useState(6);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const service = new YNABService();
      const scheduled = await service.getScheduledTransactions(budgetId, accountId, selectedFlag || null);
      setExpanded(service.expandScheduledTransactions(scheduled, monthsAhead));
    } catch (err: any) { setError(err.message || 'Hata oluştu.'); } finally { setLoading(false); }
  };

  useEffect(() => { if (budgetId) fetchData(); }, [budgetId, selectedFlag, accountId, monthsAhead]);

  const monthlyData = useMemo(() => {
    const map: Record<string, any> = {};
    expanded.forEach(t => {
      if (t.amount >= 0) return;
      const d = new Date(t.date); const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[k]) map[k] = { txs: [], total: 0 };
      map[k].txs.push(t); map[k].total += Math.abs(t.amount) / 1000;
    });
    return Object.keys(map).sort().map(k => {
      const [y, mN] = k.split('-').map(Number);
      const d = map[k]; const cMap: Record<string, FutureCategoryBreakdown> = {};
      d.txs.forEach((t: any) => {
        const cId = t.category_id || 'un';
        if (!cMap[cId]) cMap[cId] = { categoryId: cId, categoryName: t.category_name || 'Kategorisiz', amount: 0, color: COLORS[Object.keys(cMap).length % COLORS.length], transactions: [] };
        cMap[cId].amount += Math.abs(t.amount) / 1000; cMap[cId].transactions.push(t);
      });
      return { month: k, label: `${MONTHS[mN - 1]} ${y}`, total: d.total, categories: Object.values(cMap).sort((a, b) => b.amount - a.amount) };
    });
  }, [expanded]);

  const stats = useMemo(() => {
    const total = monthlyData.reduce((s, m) => s + m.total, 0); const recurring = expanded.filter(t => t.isRecurring && t.amount < 0).length;
    return {
      total,
      avg: monthlyData.length ? total / monthlyData.length : 0,
      recurring,
      oneTime: expanded.filter(t => !t.isRecurring && t.amount < 0).length,
      max: monthlyData.reduce((max, m) => m.total > max.total ? m : max, { total: 0, label: '-' })
    };
  }, [monthlyData, expanded]);

  const next30DaysTransactions = useMemo(() => {
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);

    return expanded
      .filter(t => {
        const d = new Date(t.date);
        return t.amount < 0 && d >= now && d <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [expanded]);

  const next30Total = useMemo(() =>
    next30DaysTransactions.reduce((s, t) => s + Math.abs(t.amount) / 1000, 0),
    [next30DaysTransactions]);

  if (loading) return <div className="py-20 flex flex-col items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-4" /><span className="text-xs font-black text-gray-400 uppercase tracking-widest">YÜKLENİYOR...</span></div>;
  if (error) return <div className="p-8 text-center text-red-500 font-bold fintech-card">{error}<HapticButton onClick={fetchData} className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full mx-auto">TEKRAR DENE</HapticButton></div>;

  return (
    <div className="space-y-10 animate-spring-in pb-24">
      {/* Hero Header */}
      <section className="px-1 pt-6 text-center">
        <span className="text-gray-400 text-[11px] font-black mb-1 uppercase tracking-[0.2em] opacity-60">
          ÖNÜMÜZDEKİ {monthsAhead} AY
        </span>
        <div className="text-5xl font-black tracking-tighter text-[#191919] dark:text-white mb-2">
          <AnimatedCounter value={stats.total} format="currency" smallDecimals={true} />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            {expanded.filter(t => t.amount < 0).length} ÖDEME BEKLENİYOR
          </span>
        </div>
      </section>

      {/* Month Selection */}
      <section className="px-1">
        <SegmentedControl
          options={[
            { id: '3', label: '3 AY' },
            { id: '6', label: '6 AY' },
            { id: '12', label: '12 AY' }
          ]}
          selectedId={monthsAhead.toString()}
          onChange={(id) => setMonthsAhead(Number(id))}
        />
      </section>

      {/* Main Stats Grid */}
      <section className="grid grid-cols-2 gap-4">
        <div className="fintech-card p-6 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-1 leading-none tracking-widest">AYLIK ORTALAMA</div>
          <div className="text-xl font-black tracking-tight"><AnimatedCounter value={stats.avg} format="currency" smallDecimals={true} /></div>
        </div>
        <div className="fintech-card p-6 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="text-[10px] font-black uppercase text-gray-400 mb-1 leading-none tracking-widest">EN YÜKSEK AY</div>
          <div className="text-xl font-black tracking-tight">{stats.max.label}</div>
          <div className="text-emerald-600 font-black text-[10px] mt-1 uppercase tracking-widest">{formatCurrency(stats.max.total)}</div>
        </div>
      </section>

      {/* Cash Flow Projection */}
      <section>
        <div className="flex items-center gap-2 mb-4 px-1 text-gray-400">
          <Clock size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.15em]">NAKİT AKIŞI PROJEKSİYONU</span>
        </div>
        <div className="fintech-card p-2 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
          <FuturePaymentsChart monthlyData={monthlyData} onMonthSelect={setSelected} selectedMonth={selected} />
        </div>
      </section>

      {/* Upcoming Detail Section */}
      {selected && (
        <section className="animate-spring-in">
          <MonthDetail month={selected} categoryColorMap={COLORS.reduce((a, c, i) => ({ ...a, [i]: c }), {})} onClose={() => setSelected(null)} />
        </section>
      )}

      {/* Transaction List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">YAKLAŞAN İŞLEMLER</span>
          </div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
            {expanded.length} TOPLAM
          </span>
        </div>

        <div className="space-y-2">
          {next30DaysTransactions.slice(0, 10).map((t, i) => (
            <div key={`${t.id}-${i}`} className="fintech-card flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm group active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                  {t.isRecurring ? <RefreshCw size={18} /> : <Calendar size={18} />}
                </div>
                <div>
                  <div className="text-[14px] font-black text-[#191919] dark:text-white uppercase truncate max-w-[120px]">
                    {t.payee_name || 'BİLINMEYEN'}
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                    {new Date(t.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }).toUpperCase()} • {t.category_name || 'KATEGORİSİZ'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-black text-[#191919] dark:text-white">
                  -{formatCurrency(Math.abs(t.amount) / 1000)}
                </div>
                {t.isRecurring && (
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none mt-0.5">TEKRARLAYAN</div>
                )}
              </div>
            </div>
          ))}

          {next30DaysTransactions.length > 10 && (
            <div className="text-center py-4">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">VE {next30DaysTransactions.length - 10} DİĞER ÖDEME</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GelecekTab;
