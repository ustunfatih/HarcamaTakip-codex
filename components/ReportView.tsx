import React, { useMemo, useState } from 'react';
import { ArrowLeft, Moon, Sun, TrendingUp, LayoutGrid, Clock, Beaker, Calendar, ArrowRight, PieChart, User, CalendarDays, X, Check, Activity, Sparkles } from 'lucide-react';
import HapticButton from './HapticButton';
import { CategoryCard } from './CategoryCard';
import { PieChartSection } from './PieChartSection';
import { MerchantParetoChart } from './MerchantParetoChart';
import { MonthComparisonChart } from './MonthComparisonChart';
import { CollapsibleSection } from './CollapsibleSection';
import { AnimatedCounter } from './AnimatedCounter';
import { QuickStatsCards } from './QuickStatsCards';
import { DayOfWeekChart } from './DayOfWeekChart';
import { SpendingHeatmapCalendar } from './SpendingHeatmapCalendar';
import { GelecekTab } from './GelecekTab';
import { DeneyselTab } from './DeneyselTab';
import { SegmentedControl } from './SegmentedControl';
import { ReportData } from '../types';
import { formatCurrency, formatDateRange } from '../utils';
import { SkeletonReport } from './Skeleton';

interface ReportViewProps {
    reportData: ReportData | null; isLoading: boolean; error: string | null; isSharedView: boolean; copySuccess: boolean;
    handleShare: () => void; handleDownload: () => void; handleRefresh: () => void; isRefreshing: boolean;
    pullDistance: number; handleTouchStart: (e: React.TouchEvent) => void; handleTouchMove: (e: React.TouchEvent) => void; handleTouchEnd: () => void;
    isScrolled: boolean; setStep: (step: number) => void; selectedFlag: string; handleFlagChange: (flag: string) => void;
    activeTab: 'ana' | 'analiz' | 'ai' | 'gelecek'; setActiveTab: (tab: 'ana' | 'analiz' | 'ai' | 'gelecek') => void;
    selectedDatePreset: string; handleDatePreset: (preset: any) => void; showCustomDateInput: boolean;
    startDate: string; endDate: string; setStartDate: (date: string) => void; setEndDate: (date: string) => void;
    onGenerateReport: () => void; toggleTheme: () => void; theme: 'light' | 'dark';
    selectedBudget: string; selectedAccount: string;
    FLAGS: Array<{ value: string; label: string; color: string; icon: string }>;
}

export const ReportView: React.FC<ReportViewProps> = (props) => {
    const {
        reportData, isLoading, error, isSharedView, isScrolled, setStep,
        selectedFlag, handleFlagChange, activeTab, setActiveTab,
        selectedDatePreset, handleDatePreset, showCustomDateInput,
        startDate, endDate, setStartDate, setEndDate, onGenerateReport,
        toggleTheme, theme, FLAGS, selectedBudget, selectedAccount
    } = props;

    if (isLoading || !reportData) return <div className="min-h-screen flex flex-col items-center pb-32"><div className="sticky top-0 z-30 w-full h-20 glass-bar" /><SkeletonReport /></div>;

    const dateOptions = [
        { id: 'thisMonth', label: 'Bu Ay', compact: 'BA' },
        { id: 'prevMonth', label: 'Geçen Ay', compact: 'GA' },
        { id: 'thisYear', label: 'Bu Yıl', compact: 'BY' },
        { id: 'lastYear', label: 'Son 1 Yıl', compact: '1Y' },
        { id: 'custom', label: 'Özel', compact: 'ÖZ' }
    ];

    const [aiTarget, setAiTarget] = useState<number>(0);
    const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

    const derived = useMemo(() => {
        const total = reportData.totalSpent || 0;
        const income = reportData.cashFlowStats?.income || 0;
        const expense = reportData.cashFlowStats?.expense || 0;
        const net = reportData.cashFlowStats?.net || 0;
        const savingsRate = reportData.cashFlowStats?.savingsRate || 0;
        const categories = reportData.categories || [];
        const topCategory = categories.length ? [...categories].sort((a, b) => b.totalAmount - a.totalAmount)[0] : null;
        const topCategoryShare = topCategory && total > 0 ? (topCategory.totalAmount / total) * 100 : 0;

        const payeeMap: Record<string, number> = {};
        let weekendSpend = 0;
        let spendTxCount = 0;
        categories.forEach((c) => {
            c.transactions?.forEach((t) => {
                if (t.amount >= 0) return;
                spendTxCount += 1;
                const amt = Math.abs(t.amount / 1000);
                const name = t.payee_name || 'Bilinmeyen';
                payeeMap[name] = (payeeMap[name] || 0) + amt;
                if (t.date) {
                    const parts = t.date.split('-').map(Number);
                    if (parts.length === 3) {
                        const d = new Date(parts[0], parts[1] - 1, parts[2]);
                        if (d.getDay() === 0 || d.getDay() === 6) weekendSpend += amt;
                    }
                }
            });
        });

        const topMerchants = Object.entries(payeeMap)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);
        const topMerchantShare = total > 0
            ? topMerchants.slice(0, 3).reduce((s, m) => s + m.amount, 0) / total * 100
            : 0;
        const weekendShare = total > 0 ? (weekendSpend / total) * 100 : 0;

        const histAvg = reportData.historicalMonthlyAverage || 0;
        const pulse = histAvg > 0 ? (total / histAvg) * 100 : 0;

        const movers = reportData.categoryTrends
            ? Object.entries(reportData.categoryTrends)
                .map(([name, t]) => ({ name, change: t.changePercentage }))
                .sort((a, b) => b.change - a.change)
            : [];
        const moversUp = movers.slice(0, 3);
        const moversDown = movers.slice(-3).reverse();

        const comparison = reportData.comparisonData || [];
        const lastPoint = comparison.length ? comparison[comparison.length - 1] : null;
        const yearlyDelta = lastPoint ? lastPoint.current - lastPoint.previous : 0;
        const yearlyDeltaPct = lastPoint && lastPoint.previous > 0
            ? ((lastPoint.current - lastPoint.previous) / lastPoint.previous) * 100
            : 0;

        const dailyTotals: Record<string, number> = {};
        const dailyCategory: Record<string, Record<string, number>> = {};
        const dayTotals = Array(7).fill(0);
        categories.forEach((c) => {
            c.transactions?.forEach((t) => {
                if (!t.date) return;
                const parts = t.date.split('-').map(Number);
                if (parts.length !== 3) return;
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                const key = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
                const amt = Math.abs(t.amount / 1000);
                if (t.amount >= 0) return;
                dailyTotals[key] = (dailyTotals[key] || 0) + amt;
                if (!dailyCategory[key]) dailyCategory[key] = {};
                dailyCategory[key][c.categoryName] = (dailyCategory[key][c.categoryName] || 0) + amt;
                dayTotals[d.getDay()] += amt;
            });
        });

        const dayOrder = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
        const topDays = dayTotals
            .map((v, i) => ({ day: dayOrder[i], value: v }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 2);

        const dailyValues = Object.values(dailyTotals);
        const dailyMean = dailyValues.length ? dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length : 0;
        const dailyStd = dailyValues.length
            ? Math.sqrt(dailyValues.reduce((s, v) => s + Math.pow(v - dailyMean, 2), 0) / dailyValues.length)
            : 0;
        const anomalies = Object.entries(dailyTotals)
            .filter(([, v]) => v > dailyMean + 2 * dailyStd)
            .map(([date, amount]) => {
                const topCat = dailyCategory[date]
                    ? Object.entries(dailyCategory[date]).sort((a, b) => b[1] - a[1])[0]
                    : null;
                return { date, amount, topCategory: topCat ? topCat[0] : 'Bilinmeyen' };
            })
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const categoryVolatility = categories.map((c) => {
            const dayMap: Record<string, number> = {};
            c.transactions?.forEach((t) => {
                if (t.amount >= 0 || !t.date) return;
                const k = t.date.split('T')[0];
                dayMap[k] = (dayMap[k] || 0) + Math.abs(t.amount / 1000);
            });
            const vals = Object.values(dayMap);
            const mean = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
            const std = vals.length ? Math.sqrt(vals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / vals.length) : 0;
            const volatility = mean > 0 ? std / mean : 0;
            return { name: c.categoryName, volatility, mean };
        }).sort((a, b) => b.volatility - a.volatility).slice(0, 6);

        const recurring = reportData.recurringItems || [];
        const recurringInsights = recurring.slice(0, 5).map((r) => ({
            payee: r.payee,
            monthly: r.averageAmount,
            annual: r.averageAmount * 12
        }));

        return {
            total,
            income,
            expense,
            net,
            savingsRate,
            topCategory,
            topCategoryShare,
            topMerchants,
            topMerchantShare,
            weekendShare,
            pulse,
            moversUp,
            moversDown,
            spendTxCount,
            yearlyDelta,
            yearlyDeltaPct,
            dailyMean,
            dailyStd,
            anomalies,
            categoryVolatility,
            recurringInsights,
            topDays
        };
    }, [reportData]);

    return (
        <div className="min-h-screen pb-32 bg-transparent transition-colors duration-700">
            {/* Custom Date Modal */}
            {showCustomDateInput && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                        onClick={() => handleDatePreset('custom')}
                    />

                    {/* Modal Sheet */}
                    <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[32px] p-6 pb-10 animate-slide-up shadow-2xl">
                        {/* Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6" />

                        {/* Title */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-[#191919] dark:text-white">Özel Tarih Aralığı</h3>
                            <button
                                onClick={() => handleDatePreset('custom')}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 transition-all active:scale-90"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Date Inputs */}
                        <div className="space-y-4">
                            {/* Start Date */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Başlangıç Tarihi
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-[#191919] dark:text-white font-bold text-base border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                    Bitiş Tarihi
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-[#191919] dark:text-white font-bold text-base border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Apply Button */}
                        <button
                            onClick={() => {
                                handleDatePreset('custom'); // Close modal
                                onGenerateReport(); // Generate with new dates
                            }}
                            className="w-full mt-6 py-4 bg-[#0f766e] hover:bg-[#0b5f58] text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/30"
                        >
                            <Check size={18} />
                            Uygula
                        </button>
                    </div>
                </div>
            )}

            {/* Header Layer (Sticky with selectors) */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 px-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isScrolled
                        ? 'glass-bar backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-sm pt-safe pb-2'
                        : 'pt-safe'}`}
            >
                <div className="max-w-xl mx-auto">
                    {/* Navigation Row */}
                    <div className="flex justify-between items-center py-2 h-14">
                        {!isSharedView ? (
                            <HapticButton onClick={() => setStep(2)} className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full group transition-all duration-300 hover:scale-105 active:scale-95"><ArrowLeft size={18} /></HapticButton>
                        ) : <div className="w-10" />}

                        {/* Total Amount - Smooth transition */}
                        <div className={`flex-1 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isScrolled ? 'translate-y-0 opacity-100 scale-100' : 'opacity-0 translate-y-4 scale-90'}`}>
                            <span className="kicker-label leading-none mb-0.5">TOPLAM</span>
                            <div className="text-xl font-black tracking-tighter text-[#191919] dark:text-white">
                                <AnimatedCounter value={reportData.totalSpent} format="currency" smallDecimals={true} />
                            </div>
                        </div>

                        <HapticButton onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/10 rounded-full group transition-all duration-300 hover:scale-105 active:scale-95">
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </HapticButton>
                    </div>

                    {/* Compact Selectors Row (Visible when scrolled) - Smooth transition */}
                    <div className={`flex items-center justify-between overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isScrolled && !isSharedView ? 'max-h-16 opacity-100 mt-1 pb-1 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                        {/* Person Selector - Compact (emoji only) */}
                        <div className="flex items-center p-0.5 bg-black/5 dark:bg-white/5 rounded-full shrink-0 gap-1">
                            {FLAGS.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => handleFlagChange(f.value)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-full text-base transition-all duration-300 active:scale-90 ${selectedFlag === f.value ? 'bg-[#0f766e] shadow-md shadow-emerald-500/30 scale-105' : 'opacity-40 grayscale'}`}
                                >
                                    {f.icon}
                                </button>
                            ))}
                        </div>

                        {/* Date Selector - Compact (abbreviations only) */}
                        <div className="flex items-center p-0.5 bg-black/5 dark:bg-white/5 rounded-full shrink-0 gap-0.5">
                            {dateOptions.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleDatePreset(opt.id)}
                                    className={`px-2.5 py-1.5 h-8 flex items-center justify-center rounded-full text-[10px] font-black uppercase transition-all duration-300 active:scale-95 ${selectedDatePreset === opt.id ? 'bg-white dark:bg-zinc-800 text-[#0f766e] shadow-sm' : 'text-gray-400'}`}
                                >
                                    {opt.compact}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-4 pt-20 space-y-8">
                {/* Hero Section (Visible when not scrolled) - Smooth transition */}
                <div className={`pt-10 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${isScrolled ? 'opacity-0 scale-95 max-h-0 overflow-hidden p-0' : 'pb-4 opacity-100 scale-100 max-h-[400px]'}`}>
                    <div className="surface-elevated hero-panel p-6 relative z-10">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="chip">{selectedDatePreset === 'custom' ? `${startDate} / ${endDate}` : formatDateRange(reportData.startDate, reportData.endDate)}</div>
                                <div className="chip">{derived.spendTxCount} ISLEM</div>
                            </div>
                            <div className="text-5xl display-title text-[#191919] dark:text-white mb-3">
                                <AnimatedCounter value={reportData.totalSpent} format="currency" smallDecimals={true} />
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="chip">Toplam Harcama</div>
                                {derived.topCategory && <div className="chip">Zirve: {derived.topCategory.categoryName}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Full-size Selectors (Visible when not scrolled) */}
                    {!isSharedView && (
                        <div className="flex flex-col items-center gap-6 mt-4 relative z-20 pointer-events-auto">
                            {/* Person Selector - Full Size with Names */}
                            <div className="flex items-center p-1.5 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 shadow-sm gap-1 pointer-events-auto mb-2">
                                {FLAGS.map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => handleFlagChange(f.value)}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-300 active:scale-95 ${selectedFlag === f.value ? 'bg-[#0f766e] text-white shadow-lg shadow-emerald-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                >
                                        <span className="text-lg">{f.icon}</span>
                                        <span className="text-[11px] font-black uppercase tracking-wide">{f.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Date Selector - Full Size with Labels */}
                            <div className="flex items-center p-1 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 shadow-sm gap-1 flex-wrap justify-center pointer-events-auto mt-2">
                                {dateOptions.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleDatePreset(opt.id)}
                                    className={`px-4 py-2.5 flex items-center justify-center rounded-xl text-[11px] font-black uppercase transition-all duration-300 active:scale-95 ${selectedDatePreset === opt.id ? 'bg-[#0f766e] text-white shadow-lg shadow-emerald-500/30' : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'}`}
                                >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {!isSharedView && (activeTab === 'ana') && (
                    <div className="space-y-4">
                        <section className="pt-2 space-y-8 animate-fade-in">
                            <div className="section-header">
                                <span className="section-kicker">INSIGHT</span>
                                <h2 className="section-title">Akilli Ozet</h2>
                                <p className="section-subtitle">Harcama davranisini tek bakista yakala</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="insight-tile">
                                    <div className="insight-label">Zirve Kategori</div>
                                    <div className="insight-value">{derived.topCategory ? derived.topCategory.categoryName : 'Yok'}</div>
                                    <div className="section-subtitle">Pay %{derived.topCategoryShare.toFixed(0)}</div>
                                </div>
                                <div className="insight-tile">
                                    <div className="insight-label">Hafta Sonu</div>
                                    <div className="insight-value">%{derived.weekendShare.toFixed(0)}</div>
                                    <div className="section-subtitle">Toplam harcama icinde</div>
                                </div>
                                <div className="insight-tile">
                                    <div className="insight-label">Ilk 3 Satici</div>
                                    <div className="insight-value">%{derived.topMerchantShare.toFixed(0)}</div>
                                    <div className="section-subtitle">Yogunluk orani</div>
                                </div>
                            </div>

                            {reportData.comparisonData && reportData.comparisonData.length > 0 && (
                                <>
                                    <div className="section-header">
                                        <span className="section-kicker">YILLIK</span>
                                        <h2 className="section-title">{reportData.comparisonConfig?.title || 'Yillik Kumulatif'}</h2>
                                        <p className="section-subtitle">{reportData.comparisonConfig?.subtitle || 'Bu yil vs gecen yil'}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="chip">
                                            {derived.yearlyDelta >= 0 ? '+' : '-'}{formatCurrency(Math.abs(derived.yearlyDelta))} YTD fark
                                        </span>
                                        {derived.yearlyDeltaPct !== 0 && (
                                            <span className="chip">%{Math.abs(derived.yearlyDeltaPct).toFixed(1)} degisim</span>
                                        )}
                                    </div>
                                    <MonthComparisonChart
                                        data={reportData.comparisonData}
                                        config={reportData.comparisonConfig}
                                    />
                                </>
                            )}

                            <div className="section-header">
                                <span className="section-kicker">KATEGORI PAYI</span>
                                <h2 className="section-title">Harcama Dagilimi</h2>
                                <p className="section-subtitle">En yuksek harcama kalemleri</p>
                            </div>
                            <PieChartSection
                                categories={reportData.categories}
                                onCategoryClick={(categoryName, categoryId) => {
                                    const categoryElement = document.getElementById(`category-${categoryId}`);
                                    if (categoryElement) {
                                        categoryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        categoryElement.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2');
                                        setTimeout(() => {
                                            categoryElement.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-2');
                                            categoryElement.click();
                                        }, 500);
                                    }
                                }}
                            />

                            <section className="space-y-4" id="categories-section">
                                <div className="section-header">
                                    <span className="section-kicker">DETAY</span>
                                    <h2 className="section-title">Kategoriler</h2>
                                    <p className="section-subtitle">{reportData.categories.length} kategori listeleniyor</p>
                                </div>
                                <div className="space-y-2">
                                    {reportData.categories.map((c: any, i: number) => (
                                        <div key={c.categoryId} id={`category-${c.categoryId}`} className="transition-all duration-300">
                                            <CategoryCard category={c} colorIndex={i} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </section>
                    </div>
                )}

                {activeTab === 'analiz' && !isSharedView && (
                    <div className={`transition-all duration-500 ${isScrolled ? 'pt-16' : ''}`}>
                        <div className="space-y-8">
                            <div className="section-header">
                                <span className="section-kicker">DURUM</span>
                                <h2 className="section-title">Anlik Rapor</h2>
                                <p className="section-subtitle">Hizli istatistikler ve erken uyarilar</p>
                            </div>
                            <QuickStatsCards reportData={reportData} />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="surface-card p-4">
                                    <div className="kicker-label mb-2">Tekrarlayanlar</div>
                                    <div className="text-xl font-bold text-[#191919] dark:text-white">{reportData.recurringItems?.length || 0}</div>
                                    <p className="section-subtitle">Duzenli odeme ihtimali</p>
                                </div>
                                <div className="surface-card p-4">
                                    <div className="kicker-label mb-2">Cifte Islem</div>
                                    <div className="text-xl font-bold text-[#191919] dark:text-white">{reportData.potentialDuplicates?.length || 0}</div>
                                    <p className="section-subtitle">Benzer gun ve tutar</p>
                                </div>
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">RITIM</span>
                                <h2 className="section-title">Harcama Nabzi</h2>
                                <p className="section-subtitle">Beklenen pace ile karsilastirma</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="surface-card p-4">
                                    <div className="kicker-label mb-2">Pace Orani</div>
                                    <div className="text-xl font-bold text-[#191919] dark:text-white">
                                        %{derived.pulse ? derived.pulse.toFixed(0) : 0}
                                    </div>
                                    <p className="section-subtitle">Tarihsel ortalamaya gore</p>
                                </div>
                                <div className="surface-card p-4">
                                    <div className="kicker-label mb-2">Tasarruf Orani</div>
                                    <div className="text-xl font-bold text-[#191919] dark:text-white">
                                        %{derived.savingsRate.toFixed(1)}
                                    </div>
                                    <p className="section-subtitle">Gelir - gider dengesi</p>
                                </div>
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">SATICILAR</span>
                                <h2 className="section-title">En Cok Harcama</h2>
                                <p className="section-subtitle">En cok gidilen noktalar</p>
                            </div>

                            <div className="surface-card p-4 space-y-3">
                                {derived.topMerchants.map((m, i) => (
                                    <div key={m.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-xs font-bold">
                                                {i + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-[#191919] dark:text-white truncate">{m.name}</div>
                                                <div className="text-xs text-gray-400">Pay %{derived.total > 0 ? ((m.amount / derived.total) * 100).toFixed(1) : '0.0'}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-black">{formatCurrency(m.amount)}</div>
                                    </div>
                                ))}
                            </div>

                            <MerchantParetoChart data={derived.topMerchants} total={derived.total} />

                            <div className="section-header">
                                <span className="section-kicker">HAREKET</span>
                                <h2 className="section-title">Kategori Degisimi</h2>
                                <p className="section-subtitle">Gecen doneme gore en buyuk sapmalar</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="surface-card p-4">
                                    <div className="kicker-label mb-3">Yukselenler</div>
                                    <div className="space-y-2">
                                        {derived.moversUp.length === 0 && <div className="text-sm text-gray-400">Veri yok</div>}
                                        {derived.moversUp.map((m) => (
                                            <div key={m.name} className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#191919] dark:text-white truncate">{m.name}</span>
                                                <span className="text-sm font-bold text-emerald-600">+%{Math.round(m.change)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="surface-card p-4">
                                    <div className="kicker-label mb-3">Dususenler</div>
                                    <div className="space-y-2">
                                        {derived.moversDown.length === 0 && <div className="text-sm text-gray-400">Veri yok</div>}
                                        {derived.moversDown.map((m) => (
                                            <div key={m.name} className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-[#191919] dark:text-white truncate">{m.name}</span>
                                                <span className="text-sm font-bold text-orange-600">-%{Math.round(Math.abs(m.change))}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">RITIM</span>
                                <h2 className="section-title">Haftalik Dagilim</h2>
                                <p className="section-subtitle">Gunlere gore harcama yogunlugu</p>
                            </div>
                            <DayOfWeekChart reportData={reportData} />

                            <div className="surface-card p-4">
                                <div className="kicker-label mb-2">Haftalik Patern</div>
                                <div className="text-sm font-semibold text-[#191919] dark:text-white">
                                    En yuksek gunler: {derived.topDays.map(d => d.day).join(', ')}
                                </div>
                                <p className="section-subtitle">Hafta ici/sonu davranisi icin ipucu</p>
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">ZAMAN HARITASI</span>
                                <h2 className="section-title">Gunluk Isik Haritasi</h2>
                                <p className="section-subtitle">Gunluk harcamayi goreyim</p>
                            </div>
                            <SpendingHeatmapCalendar reportData={reportData} />

                            <div className="section-header">
                                <span className="section-kicker">DALGALANMA</span>
                                <h2 className="section-title">Kategori Volatilitesi</h2>
                                <p className="section-subtitle">En degisken harcama alanlari</p>
                            </div>
                            <div className="surface-card p-4 space-y-3">
                                {derived.categoryVolatility.map((c) => (
                                    <div key={c.name} className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-[#191919] dark:text-white truncate">{c.name}</div>
                                            <div className="text-xs text-gray-400">Ortalama {formatCurrency(c.mean)}</div>
                                        </div>
                                        <div className="text-sm font-bold text-orange-600">%{Math.round(c.volatility * 100)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">ANOMALI</span>
                                <h2 className="section-title">Asiri Harcama Gunleri</h2>
                                <p className="section-subtitle">Ust sinirin uzerindeki gunler</p>
                            </div>
                            <div className="surface-card p-4 space-y-3">
                                {derived.anomalies.length === 0 && <div className="text-sm text-gray-400">Anomali bulunamadi</div>}
                                {derived.anomalies.map((a) => (
                                    <div key={a.date} className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-[#191919] dark:text-white">{a.date}</div>
                                            <div className="text-xs text-gray-400">En yuksek: {a.topCategory}</div>
                                        </div>
                                        <div className="text-sm font-bold text-emerald-600">{formatCurrency(a.amount)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">ABONELIK</span>
                                <h2 className="section-title">Tekrarlayan Odemeler</h2>
                                <p className="section-subtitle">Aylik ve yillik tahmin</p>
                            </div>
                            <div className="surface-card p-4 space-y-3">
                                {derived.recurringInsights.length === 0 && <div className="text-sm text-gray-400">Tekrarlayan odeme bulunamadi</div>}
                                {derived.recurringInsights.map((r) => (
                                    <div key={r.payee} className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-[#191919] dark:text-white truncate">{r.payee}</div>
                                            <div className="text-xs text-gray-400">Aylik {formatCurrency(r.monthly)}</div>
                                        </div>
                                        <div className="text-sm font-bold">{formatCurrency(r.annual)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'gelecek' && !isSharedView && <div className={`transition-all duration-500 ${isScrolled ? 'pt-16' : ''}`}><GelecekTab budgetId={selectedBudget} selectedFlag={selectedFlag} accountId={selectedAccount} /></div>}
                {activeTab === 'ai' && !isSharedView && (
                    <div className={`transition-all duration-500 ${isScrolled ? 'pt-16' : ''}`}>
                        <div className="space-y-8">
                            <div className="section-header">
                                <span className="section-kicker">AI OZET</span>
                                <h2 className="section-title">Akilli Anlati</h2>
                                <p className="section-subtitle">Kisa, net ve eyleme donuk</p>
                            </div>
                            <div className="surface-card p-4 space-y-2">
                                <div className="text-sm text-[#191919] dark:text-white font-semibold">Bu donemde {formatCurrency(derived.total)} harcandi.</div>
                                <div className="text-sm text-gray-500">En baskin kategori {derived.topCategory?.categoryName || 'belirsiz'} ve toplam payi %{derived.topCategoryShare.toFixed(0)}.</div>
                                <div className="text-sm text-gray-500">Hafta sonu yogunlugu %{derived.weekendShare.toFixed(0)} ile belirgin.</div>
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">AI SORULAR</span>
                                <h2 className="section-title">Hizli Sorgular</h2>
                                <p className="section-subtitle">Sik sorulan sorulari kopyala</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Bu ay harcama neden artti?',
                                    'Hangi kategori azaltilmali?',
                                    'Hafta sonu harcamasi nasil dengelenir?',
                                    'En riskli abonelikler hangileri?'
                                ].map((q) => (
                                    <button
                                        key={q}
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(q);
                                            setCopiedPrompt(q);
                                            setTimeout(() => setCopiedPrompt(null), 1500);
                                        }}
                                        className="chip"
                                    >
                                        {copiedPrompt === q ? 'Kopyalandi' : q}
                                    </button>
                                ))}
                            </div>

                            <div className="section-header">
                                <span className="section-kicker">AI GOAL</span>
                                <h2 className="section-title">Hedef Kocu</h2>
                                <p className="section-subtitle">Tasarruf hedefine gore plan</p>
                            </div>
                            <div className="surface-card p-4 space-y-3">
                                <label className="kicker-label">Aylik Hedef (₺)</label>
                                <input
                                    type="number"
                                    value={aiTarget || ''}
                                    onChange={(e) => setAiTarget(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-[#191919] dark:text-white font-bold text-base border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-all"
                                    placeholder="Orn: 5000"
                                />
                                <div className="text-sm text-gray-500">Hedefe ulasmak icin ilk 3 kategoriden kucuk dususler onerilir.</div>
                                <div className="space-y-2">
                                    {aiTarget > 0 && reportData.categories.slice(0, 3).map((c) => (
                                        <div key={c.categoryId} className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-[#191919] dark:text-white truncate">{c.categoryName}</span>
                                            <span className="text-sm font-bold">{formatCurrency(aiTarget / 3)}</span>
                                        </div>
                                    ))}
                                    {aiTarget <= 0 && <div className="text-sm text-gray-400">Hedef girin</div>}
                                </div>
                            </div>

                            <DeneyselTab reportData={reportData} personName={FLAGS.find(f => f.value === selectedFlag)?.label || 'Tümü'} />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Tab Bar - Liquid Glass */}
            {!isSharedView && (
                <div className="fixed bottom-6 left-0 right-0 z-50 px-6">
                    <nav className="max-w-[360px] mx-auto glass-bar rounded-[28px] p-1.5 flex justify-between shadow-2xl shadow-black/10 dark:shadow-black/40 border border-white/50 dark:border-white/10">
                        {[
                            { id: 'ana', i: PieChart, l: 'Özet' },
                            { id: 'analiz', i: Activity, l: 'Analiz' },
                            { id: 'ai', i: Sparkles, l: 'AI' },
                            { id: 'gelecek', i: Clock, l: 'Gelecek' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => { setActiveTab(t.id as any); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className={`flex-1 flex flex-col items-center py-3 rounded-[24px] transition-all duration-300 ${activeTab === t.id ? 'bg-white/80 dark:bg-white/10 text-[#0f766e] scale-105 shadow-lg' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'}`}
                            >
                                <t.i size={20} className="transition-transform duration-300" />
                                <span className="text-[10px] font-black mt-1 uppercase tracking-widest leading-none">{t.l}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ReportView;
