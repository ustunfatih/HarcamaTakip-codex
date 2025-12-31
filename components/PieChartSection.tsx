import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CategorySpending } from '../types';
import { formatCurrency } from '../utils';

// Premium Fintech Palette (Vibrant and Professional)
const COLORS = [
  '#0f766e', // Teal
  '#0ea5e9', // Sky
  '#f97316', // Orange
  '#14b8a6', // Mint
  '#f59e0b', // Amber
  '#1f2937', // Charcoal
  '#38bdf8', // Light blue
  '#94a3b8'  // Slate
];

interface PieChartSectionProps {
  categories: CategorySpending[];
  onCategoryClick?: (categoryName: string, categoryId: string) => void;
}

export const PieChartSection: React.FC<PieChartSectionProps> = ({ categories, onCategoryClick }) => {
  const [showOther, setShowOther] = useState(false);
  const total = categories?.reduce((s, c) => s + c.totalAmount, 0) || 0;
  const sorted = [...(categories || [])].sort((a, b) => b.totalAmount - a.totalAmount);

  // Show top categories and group rest into "Diğer"
  const chartData = total > 0 ? sorted.slice(0, 5).map(c => ({
    name: c.categoryName,
    value: c.totalAmount,
    percentage: ((c.totalAmount / total) * 100).toFixed(1),
    categoryId: c.categoryId
  })) : [];

  const otherCategories = total > 0 ? sorted.slice(5) : [];
  const otherTotal = otherCategories.reduce((s, c) => s + c.totalAmount, 0);
  if (otherTotal > 0 && total > 0) {
    chartData.push({
      name: 'DİĞER',
      value: otherTotal,
      percentage: ((otherTotal / total) * 100).toFixed(1),
      categoryId: 'other'
    });
  }

  const handleCategoryClick = (categoryName: string, categoryId: string) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName, categoryId);
    }
  };

  const otherBreakdown = useMemo(() => {
    return otherCategories.slice(0, 8).map((c) => ({
      name: c.categoryName,
      value: c.totalAmount,
      pct: total > 0 ? (c.totalAmount / total) * 100 : 0
    }));
  }, [otherCategories, total]);

  return (
    <div className="chart-panel p-6">
      <div className="flex flex-col items-center">
        {/* Donut Chart Container */}
        <div className="relative w-full h-64 -mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
                startAngle={90}
                endAngle={450}
                onClick={(data) => handleCategoryClick(data.name, data.categoryId)}
                style={{ cursor: onCategoryClick ? 'pointer' : 'default' }}
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={COLORS[i % COLORS.length]}
                    className="hover:opacity-80 transition-opacity outline-none"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text (Revolut Style) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black tracking-tighter text-[#191919] dark:text-white">
              {formatCurrency(total).split(',')[0]}
            </span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">TOPLAM HARCAMA</span>
          </div>
        </div>

        {/* Legend List (Clickable) */}
        <div className="w-full space-y-2 mt-2">
          {chartData.map((e, i) => (
            <div
              key={i}
              onClick={() => handleCategoryClick(e.name, e.categoryId)}
              className={`flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group ${onCategoryClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
            >
              <div className="flex items-center min-w-0 flex-1">
                <div
                  className="w-3 h-3 rounded-full mr-4 shrink-0 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></div>
                <span className="text-[14px] font-black text-[#191919] dark:text-white uppercase truncate tracking-tight">{e.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[14px] font-black text-gray-400 tabular-nums">%{e.percentage}</span>
                <span className="text-[14px] font-black text-[#191919] dark:text-white tabular-nums hidden sm:inline-block">
                  {formatCurrency(e.value)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {otherTotal > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowOther((v) => !v)}
              className="chip"
            >
              {showOther ? 'Diğeri gizle' : 'Diğeri aç'}
            </button>
            {showOther && (
              <div className="mt-3 space-y-2">
                {otherBreakdown.map((o) => (
                  <div key={o.name} className="flex justify-between text-sm">
                    <span className="text-[#191919] dark:text-white truncate">{o.name}</span>
                    <span className="text-gray-400">%{o.pct.toFixed(1)} • {formatCurrency(o.value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChartSection;
