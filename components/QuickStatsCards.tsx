import React from 'react';
import { Calendar, Wallet, Target, Activity } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { ReportData } from '../types';

interface QuickStatsCardsProps { reportData: ReportData; }

export const QuickStatsCards: React.FC<QuickStatsCardsProps> = ({ reportData }) => {
  const { totalSpent, categories, startDate, endDate } = reportData;

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const totalDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysPassed = Math.ceil((new Date().getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
  const effectiveDays = Math.min(daysPassed, totalDays);

  const dailyAverage = effectiveDays > 0 ? totalSpent / effectiveDays : 0;
  const transactionCount = categories?.reduce((sum, cat) => sum + (cat?.transactions?.length || 0), 0) || 0;
  const avgPerTransaction = transactionCount > 0 ? totalSpent / transactionCount : 0;
  /* Sort categories by totalAmount descending to find the true top category */
  const topCategory = categories?.length > 0
    ? [...categories].sort((a, b) => b.totalAmount - a.totalAmount)[0]
    : null;

  const topCategoryPercentage = (topCategory && totalSpent > 0) ? (topCategory.totalAmount / totalSpent) * 100 : 0;

  const stats = [
    { id: 'daily_avg', label: 'GÜNLÜK ORT.', value: dailyAverage, format: 'currency' as const, icon: Calendar, ic: '#0f766e', bg: '#e6f7f5' },
    { id: 'transactions', label: 'İŞLEM SAYISI', value: transactionCount, format: 'integer' as const, icon: Activity, ic: '#0ea5e9', bg: '#e0f2fe' },
    { id: 'avg_transaction', label: 'İŞLEM BAŞINA', value: avgPerTransaction, format: 'currency' as const, icon: Wallet, ic: '#f97316', bg: '#ffedd5' },
    { id: 'top_cat', label: (topCategory?.categoryName || 'ZİRVE').toUpperCase(), value: topCategoryPercentage, format: 'percentage' as const, icon: Target, ic: '#111827', bg: '#f1f5f9', prefix: '%' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((stat, index) => (
        <div key={stat.id} className="surface-card p-3 group hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
          <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110" style={{ backgroundColor: stat.bg }}>
            <stat.icon size={16} color={stat.ic} />
          </div>
          <div className="kicker-label mb-0.5 truncate leading-none">{stat.label}</div>
          <div className="h-7 flex items-end">
            <AnimatedCounter
              value={stat.value}
              format={stat.format}
              prefix={stat.prefix || ''}
              delay={index * 100}
              className="text-[18px] font-black tracking-tighter text-[#191919] dark:text-white leading-none"
            />
          </div>

        </div>
      ))}
    </div>
  );
};
export default QuickStatsCards;
