import React from 'react';
import { Loader2, AlertCircle, Wallet, ListChecks, ArrowLeft, Users } from 'lucide-react';
import HapticButton from './HapticButton';
import { ListSelector } from './ListSelector';
import { YNABBudgetSummary, YNABAccount } from '../types';
import { formatCurrency } from '../utils';

interface FlagOption {
    value: string;
    label: string;
    color: string;
    icon: string;
}

interface ReportConfigProps {
    selectedBudget: string; onBudgetChange: (budgetId: string) => void; budgets: YNABBudgetSummary[];
    selectedAccount: string; onAccountChange: (accountId: string) => void; accounts: YNABAccount[];
    selectedFlag: string; onFlagChange: (flagValue: string) => void; flags: FlagOption[];
    onGenerate: () => void; isLoading: boolean; error: string | null;
}

export const ReportConfig: React.FC<ReportConfigProps> = ({
    selectedBudget, onBudgetChange, budgets,
    selectedAccount, onAccountChange, accounts,
    selectedFlag, onFlagChange, flags,
    onGenerate, isLoading, error
}) => {
    const budgetOptions = budgets.map(b => ({ id: b.id, label: b.name }));
    const accountOptions = [
        { id: 'all', label: 'TÜM HESAPLAR' },
        ...accounts.map(a => ({ id: a.id, label: a.name, sublabel: formatCurrency(a.balance / 1000) }))
    ];
    const flagOptions = flags.map(f => ({
        id: f.value,
        label: f.label,
        sublabel: f.icon
    }));

    const currentBudget = budgets.find(b => b.id === selectedBudget)?.name || 'Seçiniz';
    const currentAccount = selectedAccount === 'all' ? 'Tüm Hesaplar' : accounts.find(a => a.id === selectedAccount)?.name || 'Seçiniz';
    const currentFlag = flags.find(f => f.value === selectedFlag);
    const currentFlagDisplay = currentFlag ? `${currentFlag.icon} ${currentFlag.label}` : 'Tümü';

    return (
        <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto animate-spring-in bg-transparent">
            <div className="flex-1 pt-12 space-y-12">
                <header>
                    <HapticButton className="w-10 h-10 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center mb-10"><ArrowLeft size={18} /></HapticButton>
                    <h1 className="text-4xl display-title tracking-tighter mb-2 text-strong uppercase">AYARLAR</h1>
                    <p className="text-gray-400 font-bold text-sm tracking-tight leading-relaxed">Analiz için bütçe, hesap ve kullanıcı seçimi yapın.</p>
                </header>

                <div className="space-y-6">
                    <ListSelector
                        label="BÜTÇE"
                        value={selectedBudget}
                        displayValue={currentBudget}
                        options={budgetOptions}
                        onChange={onBudgetChange}
                        icon={<Wallet size={14} />}
                    />

                    <ListSelector
                        label="HESAP"
                        value={selectedAccount}
                        displayValue={currentAccount}
                        options={accountOptions}
                        onChange={onAccountChange}
                        icon={<ListChecks size={14} />}
                    />

                    <ListSelector
                        label="KULLANICI"
                        value={selectedFlag}
                        displayValue={currentFlagDisplay}
                        options={flagOptions}
                        onChange={onFlagChange}
                        icon={<Users size={14} />}
                    />
                </div>

                {error && (
                    <div className="flex items-center gap-3 text-red-500 text-xs font-black bg-red-50 dark:bg-red-500/10 p-5 rounded-2xl border border-red-100 dark:border-red-500/20">
                        <AlertCircle size={18} /> <span>{error.toUpperCase()}</span>
                    </div>
                )}
            </div>

            <div className="pb-safe pt-8">
                <HapticButton
                    onClick={onGenerate}
                    disabled={isLoading}
                    className="w-full h-16 text-white rounded-full font-black text-lg transition-all flex justify-center items-center shadow-2xl shadow-emerald-500/30 active:scale-95 group btn-primary"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : 'ANALİZİ BAŞLAT'}
                </HapticButton>
                <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-black tracking-[0.2em] opacity-40">YNAB CLOUD SYNC ACTIVE</p>
            </div>
        </div>
    );
};
export default ReportConfig;
