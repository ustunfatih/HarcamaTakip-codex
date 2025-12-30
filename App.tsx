import React, { useState, useEffect, useCallback } from 'react';
import { YNABService } from './services/ynabService';
import {
  YNABBudgetSummary,
  YNABAccount,
  ReportData,
  CategorySpending,
  YNABTransaction,
  ComparisonDataPoint,
  ComparisonConfig
} from './types';
import { decompressData, compressData, downloadHtmlFile, setCurrency, CURRENCY_SYMBOLS } from './utils';
import { generateStandaloneHtml } from './services/htmlGenerator';
import { TokenInput } from './components/TokenInput';
import { ReportConfig } from './components/ReportConfig';
import { ReportView } from './components/ReportView';

const FLAGS = [
  { value: '', label: 'Tümü', color: 'filter-gradient-all', icon: '👥' },
  { value: 'orange', label: 'Barış', color: 'filter-gradient-baris', icon: '👨🏼' },
  { value: 'purple', label: 'Şengül', color: 'filter-gradient-sengul', icon: '👸' },
  { value: 'fatih', label: 'Fatih', color: 'filter-gradient-fatih', icon: '👨🏻' },
];
const MONTH_NAMES = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const App: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark';
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [budgets, setBudgets] = useState<YNABBudgetSummary[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [accounts, setAccounts] = useState<YNABAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedFlag, setSelectedFlag] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState<'ana' | 'analiz' | 'ai' | 'gelecek'>('ana');
  const [showCustomDateInput, setShowCustomDateInput] = useState(false);
  const [selectedDatePreset, setSelectedDatePreset] = useState<string>('thisMonth');

  const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const [startDate, setStartDate] = useState<string>(toLocalDateString(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [endDate, setEndDate] = useState<string>(toLocalDateString(new Date(today.getFullYear(), today.getMonth() + 1, 0)));

  const generateReport = useCallback(async (
    overrideStart?: string, overrideEnd?: string, overrideFlag?: string,
    overrideBudget?: string, overrideAccount?: string, overridePreset?: string
  ) => {
    setIsLoading(true); setError(null);
    const useStart = overrideStart || startDate;
    const useEnd = overrideEnd || endDate;
    const useFlag = overrideFlag !== undefined ? overrideFlag : selectedFlag;
    const useBudget = overrideBudget || selectedBudget;
    const useAccount = overrideAccount || selectedAccount;
    const usePreset = overridePreset || selectedDatePreset;

    if (!useBudget) { setError('Bütçe seçimi yapılamadı.'); setIsLoading(false); return; }

    try {
      const service = new YNABService();
      const transactions = await service.getTransactions(useBudget, useAccount, useStart, useEnd, useFlag || null);
      let comparisonData: ComparisonDataPoint[] = [];
      let comparisonConfig: ComparisonConfig | undefined;
      let prevTransactionsTrend: YNABTransaction[] = [];

      if (usePreset === 'thisMonth' || usePreset === 'prevMonth') {
        const isPrev = usePreset === 'prevMonth';
        const currStart = new Date(useStart);
        const prevStart = new Date(currStart.getFullYear(), currStart.getMonth() - 1, 1);
        const prevEnd = new Date(currStart.getFullYear(), currStart.getMonth(), 0);
        comparisonConfig = {
          type: 'daily', title: 'Aylık Kümülatif', subtitle: isPrev ? 'Geçen Ay vs Önceki' : 'Bu Ay vs Geçen Ay',
          currentLabel: isPrev ? 'Geçen Ay' : 'Bu Ay', previousLabel: isPrev ? 'Önceki Ay' : 'Geçen Ay'
        };
        const prevTx = await service.getTransactions(useBudget, useAccount, toLocalDateString(prevStart), toLocalDateString(prevEnd), useFlag || null);
        prevTransactionsTrend = prevTx;
        const daily: Record<number, number> = {}; const prevD: Record<number, number> = {};
        transactions.forEach(t => { if (t.category_name !== 'Split') daily[new Date(t.date).getDate()] = (daily[new Date(t.date).getDate()] || 0) + (-t.amount / 1000); });
        prevTx.forEach(t => { if (t.category_name !== 'Split') prevD[new Date(t.date).getDate()] = (prevD[new Date(t.date).getDate()] || 0) + (-t.amount / 1000); });
        let rC = 0; let rP = 0;
        for (let i = 1; i <= 31; i++) { rC += (daily[i] || 0); rP += (prevD[i] || 0); comparisonData.push({ index: i, label: `${i}`, current: rC, previous: rP }); }
      } else if (usePreset === 'thisYear') {
        const curr = new Date(useStart);
        const pS = new Date(curr.getFullYear() - 1, 0, 1); const pE = new Date(curr.getFullYear() - 1, 11, 31);
        comparisonConfig = { type: 'monthly', title: 'Yıllık Kümülatif', subtitle: 'Bu Yıl vs Geçen Yıl', currentLabel: 'Bu Yıl', previousLabel: 'Geçen Yıl' };
        const prevTx = await service.getTransactions(useBudget, useAccount, toLocalDateString(pS), toLocalDateString(pE), useFlag || null);
        prevTransactionsTrend = prevTx;
        const monthly: Record<number, number> = {}; const prevM: Record<number, number> = {};
        transactions.forEach(t => { if (t.category_name !== 'Split') monthly[new Date(t.date).getMonth()] = (monthly[new Date(t.date).getMonth()] || 0) + (-t.amount / 1000); });
        prevTx.forEach(t => { if (t.category_name !== 'Split') prevM[new Date(t.date).getMonth()] = (prevM[new Date(t.date).getMonth()] || 0) + (-t.amount / 1000); });
        let rC = 0; let rP = 0;
        for (let i = 0; i < 12; i++) { rC += (monthly[i] || 0); rP += (prevM[i] || 0); comparisonData.push({ index: i, label: MONTH_NAMES[i], current: rC, previous: rP }); }
      }

      let totalIncome = 0; let totalExpense = 0; let historicalMonthlyAverage = 0;
      let recurringItems: any[] = []; let potentialDuplicates: any[] = [];
      try {
        const aS = new Date(useStart); aS.setMonth(aS.getMonth() - 3);
        const aE = new Date(useStart); aE.setDate(aE.getDate() - 1);
        const histTx = await service.getTransactions(useBudget, useAccount, toLocalDateString(aS), toLocalDateString(aE), useFlag || null);
        let histExp = 0;
        histTx.forEach(t => { if (t.amount < 0 && !t.transfer_account_id) histExp += (-t.amount / 1000); });
        historicalMonthlyAverage = histExp / 3;
        const all = [...histTx, ...transactions].filter(t => t.amount < 0 && !t.transfer_account_id && t.category_name !== 'Split');
        const pG: Record<string, number[]> = {}; const pD: Record<string, string[]> = {};
        all.forEach(t => { if (!t.payee_name) return; if (!pG[t.payee_name]) pG[t.payee_name] = []; if (!pD[t.payee_name]) pD[t.payee_name] = []; pG[t.payee_name].push(Math.abs(t.amount / 1000)); pD[t.payee_name].push(t.date); });
        Object.entries(pG).forEach(([p, ams]) => {
          if (ams.length >= 3) {
            const avg = ams.reduce((a, b) => a + b, 0) / ams.length;
            const variance = ams.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / ams.length;
            if (Math.sqrt(variance) < (avg * 0.15) && avg > 100) recurringItems.push({ payee: p, averageAmount: avg, count: ams.length, lastDate: pD[p].sort().reverse()[0] });
          }
        });
      } catch (e) { console.warn(e); }

      const seen: Record<string, number> = {};
      transactions.forEach(t => { if (t.amount >= 0 || t.category_name === 'Split') return; const k = `${t.payee_name}|${t.amount}|${t.date}`; if (seen[k]) potentialDuplicates.push({ payee: t.payee_name || 'Bilinmeyen', amount: Math.abs(t.amount / 1000), date: t.date }); seen[k] = (seen[k] || 0) + 1; });

      const categoryMap: Record<string, CategorySpending> = {};
      const process = (t: YNABTransaction, amt: number, cId: string, cName: string) => {
        if (amt > 0) totalExpense += amt; else totalIncome += Math.abs(amt);
        if (!categoryMap[cId]) categoryMap[cId] = { categoryId: cId, categoryName: cName, totalAmount: 0, transactions: [], color: '' };
        categoryMap[cId].totalAmount += amt; categoryMap[cId].transactions.push(t);
      };
      transactions.forEach(t => {
        if (t.category_name === 'Split' && t.subtransactions) {
          t.subtransactions.forEach(st => { if (!st.deleted) process({ ...t, id: st.id, amount: st.amount, payee_name: st.payee_name || t.payee_name, category_id: st.category_id, category_name: st.category_name || 'Kategorisiz' }, -st.amount / 1000, st.category_id || 'uncategorized', st.category_name || 'Kategorisiz'); });
        } else { process(t, -t.amount / 1000, t.category_id || 'uncategorized', t.category_name || 'Kategorisiz'); }
      });

      const prevMap: Record<string, number> = {};
      prevTransactionsTrend.forEach(t => { if (t.category_name !== 'Split') { const r = -t.amount / 1000; if (r > 0) prevMap[t.category_name || 'Kategorisiz'] = (prevMap[t.category_name || 'Kategorisiz'] || 0) + r; } });
      const trends: Record<string, any> = {};
      Object.values(categoryMap).forEach(c => { const p = prevMap[c.categoryName] || 0; trends[c.categoryName] = { previousAmount: p, changePercentage: p > 0 ? ((c.totalAmount - p) / p) * 100 : (c.totalAmount > 0 ? 100 : 0) }; });

      setReportData({
        totalSpent: Object.values(categoryMap).reduce((s, c) => s + c.totalAmount, 0),
        startDate: useStart, endDate: useEnd, categories: Object.values(categoryMap).sort((a, b) => b.totalAmount - a.totalAmount),
        comparisonData: comparisonData.length > 0 ? comparisonData : undefined, comparisonConfig, comparisonType: comparisonConfig?.type || 'daily',
        totalIncome, totalExpense, historicalMonthlyAverage, categoryTrends: trends, recurringItems, potentialDuplicates,
        cashFlowStats: { income: totalIncome, expense: totalExpense, net: totalIncome - totalExpense, savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0 }
      });
      setStep(3); setShowCustomDateInput(false);
    } catch (err: any) { setError(err.message || 'Hata oluştu.'); } finally { setIsLoading(false); }
  }, [startDate, endDate, selectedFlag, selectedBudget, selectedAccount, selectedDatePreset]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const service = new YNABService();
      const bds = await service.getBudgets();
      setBudgets(bds);
      if (bds.length > 0) {
        const tr = bds.find(b => b.name.includes('TR')) || bds[0];
        setSelectedBudget(tr.id);
        // Set currency based on the selected budget
        if (tr.currency_format) {
          const code = tr.currency_format.iso_code;
          const symbol = tr.currency_format.currency_symbol || CURRENCY_SYMBOLS[code] || code;
          setCurrency(symbol, code);
        }
        const accs = await service.getAccounts(tr.id);
        setAccounts(accs);
        const target = accs.find(a => a.name.toLowerCase().includes('bonus'))?.id || accs[0]?.id || 'all';
        setSelectedAccount(target);
        generateReport(startDate, endDate, selectedFlag, tr.id, target);
      } else { setError('Bütçe bulunamadı.'); setStep(1); }
    } catch (err: any) { setError(err.message || 'Bağlantı hatası.'); setStep(1); } finally { setIsLoading(false); }
  };

  const saveTokenAndLoad = async (tkn: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/auth/ynab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: tkn.trim() }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Token kaydedilemedi.');
      }
      await loadInitialData();
    } catch (err: any) {
      setError(err.message || 'Token kaydedilemedi.');
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get('data') || window.location.hash.split('data=')[1];
    if (shared) {
      const data = decompressData(shared);
      if (data) { setReportData(data); setIsSharedView(true); setStep(3); }
      else setError('Link hatalı.');
    } else {
      setIsLoading(true);
      fetch('/auth/status', { credentials: 'include' })
        .then(async (res) => {
          if (!res.ok) throw new Error('Oturum kontrolü başarısız.');
          return res.json();
        })
        .then(async (data) => {
          if (data?.hasToken) {
            await loadInitialData();
          } else {
            setStep(1);
          }
        })
        .catch(() => setStep(1))
        .finally(() => setIsLoading(false));
    }

    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleDatePreset = (preset: any) => {
    if (preset === 'custom') { setShowCustomDateInput(!showCustomDateInput); return; }
    const now = new Date(); let s = ''; let e = toLocalDateString(now);
    if (preset === 'thisMonth') { s = toLocalDateString(new Date(now.getFullYear(), now.getMonth(), 1)); e = toLocalDateString(new Date(now.getFullYear(), now.getMonth() + 1, 0)); }
    else if (preset === 'prevMonth') { s = toLocalDateString(new Date(now.getFullYear(), now.getMonth() - 1, 1)); e = toLocalDateString(new Date(now.getFullYear(), now.getMonth(), 0)); }
    else if (preset === 'thisYear') { s = toLocalDateString(new Date(now.getFullYear(), 0, 1)); }
    else if (preset === 'lastYear') { s = toLocalDateString(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())); }
    setStartDate(s); setEndDate(e); setSelectedDatePreset(preset);
    generateReport(s, e, undefined, undefined, undefined, preset);
  };

  return (
    <div className="min-h-screen app-shell">
      {step === 1 && <TokenInput token={token} setToken={setToken} onContinue={saveTokenAndLoad} isLoading={isLoading} error={error} />}
      {step === 2 && <ReportConfig selectedBudget={selectedBudget} onBudgetChange={id => {
        setSelectedBudget(id);
        const budget = budgets.find((b: YNABBudgetSummary) => b.id === id);
        if (budget?.currency_format) {
          const code = budget.currency_format.iso_code;
          const symbol = budget.currency_format.currency_symbol || CURRENCY_SYMBOLS[code] || code;
          setCurrency(symbol, code);
        } else {
          setCurrency('₺', 'TRY');
        }
        new YNABService().getAccounts(id).then(setAccounts);
      }} budgets={budgets} selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} accounts={accounts} selectedFlag={selectedFlag} onFlagChange={setSelectedFlag} flags={FLAGS} onGenerate={() => generateReport()} isLoading={isLoading} error={error} />}
      {step === 3 && <ReportView
        reportData={reportData} isLoading={isLoading} error={error} isSharedView={isSharedView} copySuccess={copySuccess}
        handleShare={async () => { if (!reportData) return; try { await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?data=${compressData(reportData)}`); setCopySuccess(true); setTimeout(() => setCopySuccess(false), 2000); } catch (e) { } }}
        handleDownload={() => reportData && downloadHtmlFile(`harcama-${reportData.endDate}.html`, generateStandaloneHtml(reportData))}
        handleRefresh={async () => { if (isRefreshing || isLoading || isSharedView) return; setIsRefreshing(true); await generateReport(); setIsRefreshing(false); }}
        isRefreshing={isRefreshing} pullDistance={pullDistance} handleTouchStart={e => { if (!isSharedView && window.scrollY <= 5) { setPullStartY(e.touches[0].clientY); setIsPulling(true); } }}
        handleTouchMove={e => { if (isPulling && !isRefreshing && window.scrollY <= 5) { const dy = e.touches[0].clientY - pullStartY; if (dy > 0) setPullDistance(Math.min(Math.pow(dy, 0.8), 100)); } }}
        handleTouchEnd={async () => { if (!isPulling) return; setIsPulling(false); if (pullDistance > 60) { setIsRefreshing(true); await generateReport(); setIsRefreshing(false); } setPullDistance(0); }}
        isScrolled={isScrolled} setStep={setStep} selectedFlag={selectedFlag} handleFlagChange={f => { setSelectedFlag(f); generateReport(startDate, endDate, f); }}
        activeTab={activeTab} setActiveTab={setActiveTab} selectedDatePreset={selectedDatePreset} handleDatePreset={handleDatePreset}
        showCustomDateInput={showCustomDateInput} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate}
        onGenerateReport={() => generateReport()} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} theme={theme}
        selectedBudget={selectedBudget} selectedAccount={selectedAccount} FLAGS={FLAGS}
      />}
    </div>
  );
};
export default App;
