import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ReportData } from '../types';
import { formatCurrency, formatPercent } from '../utils';

interface ComparativeSpendingRingsProps {
  reportData: ReportData;
  budgetData?: Record<string, number>;
}

interface RingData {
  id: string;
  name: string;
  current: number;
  target: number;
  percentage: number;
  color: {
    main: string;
    light: string;
  };
}

interface AnimatedRingProps {
  percentage: number;
  color: string;
  radius: number;
  strokeWidth: number;
  delay: number;
  isSelected: boolean;
  onSelect: () => void;
}

const AnimatedRing: React.FC<AnimatedRingProps> = ({
  percentage,
  color,
  radius,
  strokeWidth,
  delay,
  isSelected,
  onSelect,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(Math.min(percentage, 100));
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <g
      onClick={onSelect}
      className="cursor-pointer transition-transform hover:scale-105"
      style={{ transformOrigin: 'center' }}
    >
      {/* Background Ring */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted"
      />
      {/* Progress Ring */}
      <circle
        cx="100"
        cy="100"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        className="transition-all duration-1000 ease-out"
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
          filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none',
        }}
      />
    </g>
  );
};

// iOS color palette for rings
const RING_COLORS = [
  { main: '#FF3B30', light: '#FF3B3020' }, // Red
  { main: '#34C759', light: '#34C75920' }, // Green
  { main: '#007AFF', light: '#007AFF20' }, // Blue
  { main: '#FF9500', light: '#FF950020' }, // Orange
  { main: '#5856D6', light: '#5856D620' }, // Purple
];

export const ComparativeSpendingRings: React.FC<ComparativeSpendingRingsProps> = ({
  reportData,
  budgetData,
}) => {
  const [selectedRing, setSelectedRing] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'categories' | 'budget'>('categories');

  const { categories, totalSpent } = reportData;

  // Get top 5 categories for ring display
  const topCategories = categories.slice(0, 5);

  // Create ring data
  const ringData: RingData[] = topCategories.map((cat, index) => {
    const target = budgetData?.[cat.categoryId] || totalSpent / categories.length;
    const percentage = (cat.totalAmount / target) * 100;

    return {
      id: cat.categoryId,
      name: cat.categoryName,
      current: cat.totalAmount,
      target,
      percentage,
      color: RING_COLORS[index % RING_COLORS.length],
    };
  });

  const selectedRingData = selectedRing
    ? ringData.find((r) => r.id === selectedRing)
    : null;

  return (
    <div className="surface-card surface-card--muted backdrop-blur-xl rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[12px] font-semibold text-muted uppercase tracking-wider">
            Kategori Halkaları
          </span>
        </div>

        {/* View Mode Toggle - 44pt touch target */}
        <button
          onClick={() => setViewMode(viewMode === 'categories' ? 'budget' : 'categories')}
          className="flex items-center gap-1 px-3 min-h-[44px] text-[12px] font-medium text-brand hover:text-brand hover:bg-brand-soft rounded-lg transition-colors"
        >
          {viewMode === 'categories' ? 'Bütçe' : 'Kategoriler'}
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Rings SVG */}
        <div className="relative flex-shrink-0">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {ringData.map((ring, index) => (
              <AnimatedRing
                key={ring.id}
                percentage={ring.percentage}
                color={ring.color.main}
                radius={90 - index * 16}
                strokeWidth={12}
                delay={index * 150}
                isSelected={selectedRing === ring.id}
                onSelect={() => setSelectedRing(selectedRing === ring.id ? null : ring.id)}
              />
            ))}

            {/* Center Text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="fill-[var(--text-strong)] text-[24px] font-bold"
            >
              {formatCurrency(totalSpent)}
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              className="fill-[var(--text-muted)] text-[11px]"
            >
              Toplam
            </text>
          </svg>
        </div>

        {/* Details Panel */}
        <div className="flex-1 w-full">
          {selectedRingData ? (
            <div className="p-4 bg-surface-2 rounded-xl animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedRingData.color.main }}
                />
                <span className="text-[15px] font-semibold text-strong">
                  {selectedRingData.name}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[13px] text-muted">Harcanan</span>
                  <span className="text-[17px] font-bold text-strong">
                    {formatCurrency(selectedRingData.current)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[13px] text-muted">Hedef</span>
                  <span className="text-[15px] text-muted">
                    {formatCurrency(selectedRingData.target)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/5 dark:border-white/10">
                  <span className="text-[13px] text-muted">Oran</span>
                  <span
                    className="text-[17px] font-bold"
                    style={{ color: selectedRingData.color.main }}
                  >
                    {selectedRingData.percentage > 100 ? (
                      <span className="text-danger">+{formatPercent(selectedRingData.percentage - 100, 0)}</span>
                    ) : selectedRingData.percentage < 100 ? (
                      <span className="text-success">{formatPercent(selectedRingData.percentage, 0)}</span>
                    ) : (
                      '100%'
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {ringData.map((ring) => (
                <button
                  key={ring.id}
                  onClick={() => setSelectedRing(ring.id)}
                  className="w-full flex items-center justify-between p-3 min-h-[44px] rounded-xl hover-surface-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ring.color.main }}
                    />
                    <span className="text-[13px] font-medium text-strong truncate max-w-[120px]">
                      {ring.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-strong">
                      {ring.percentage.toFixed(0)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparativeSpendingRings;
