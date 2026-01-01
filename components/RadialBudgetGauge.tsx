import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';

interface RadialBudgetGaugeProps {
  spent: number;
  budget: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export const RadialBudgetGauge: React.FC<RadialBudgetGaugeProps> = ({
  spent,
  budget,
  label = 'Bütçe Kullanımı',
  size = 200,
  strokeWidth = 16,
}) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 150) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage <= 50) return { main: '#34C759', bg: '#34C759' }; // Green
    if (percentage <= 75) return { main: '#FF9500', bg: '#FF9500' }; // Orange
    if (percentage <= 100) return { main: '#FF3B30', bg: '#FF3B30' }; // Red
    return { main: '#FF2D55', bg: '#FF2D55' }; // Pink for over budget
  };

  const colors = getColor();
  const remaining = Math.max(0, budget - spent);
  const isOverBudget = spent > budget;

  return (
    <div className="bg-white/80 dark:bg-surface-1/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-semibold text-muted uppercase tracking-wider">
          {label}
        </span>
        <span
          className="text-[12px] font-bold px-2 py-1 rounded-full"
          style={{
            backgroundColor: `${colors.main}20`,
            color: colors.main,
          }}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Gauge */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted"
            />
            {/* Progress Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors.main}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${colors.main}40)`,
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-strong">
              {formatCurrency(spent)}
            </span>
            <span className="text-[13px] text-muted">
              / {formatCurrency(budget)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-black/5 dark:border-white/10">
        <div className="text-center">
          <div className="text-[11px] font-semibold text-muted uppercase mb-1">
            {isOverBudget ? 'Aşım' : 'Kalan'}
          </div>
          <div
            className="text-[17px] font-bold"
            style={{ color: isOverBudget ? '#FF3B30' : '#34C759' }}
          >
            {isOverBudget ? `+${formatCurrency(spent - budget)}` : formatCurrency(remaining)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[11px] font-semibold text-muted uppercase mb-1">
            Günlük Limit
          </div>
          <div className="text-[17px] font-bold text-strong">
            {formatCurrency(budget / 30)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadialBudgetGauge;
