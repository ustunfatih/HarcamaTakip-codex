import React, { useState } from 'react';
import { Target, TrendingUp, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';
import { formatCurrency } from '../utils';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  color: string;
}

interface GoalProgressTrackerProps {
  initialGoals?: Goal[];
}

// Default goals for demo
const DEFAULT_GOALS: Goal[] = [
  {
    id: '1',
    name: 'Acil Durum Fonu',
    targetAmount: 30000,
    savedAmount: 18500,
    deadline: '2024-06-01',
    color: '#FF3B30',
  },
  {
    id: '2',
    name: 'Tatil',
    targetAmount: 15000,
    savedAmount: 9200,
    deadline: '2024-08-01',
    color: '#007AFF',
  },
  {
    id: '3',
    name: 'Yeni Laptop',
    targetAmount: 45000,
    savedAmount: 32000,
    deadline: '2024-12-01',
    color: '#5856D6',
  },
];

export const GoalProgressTracker: React.FC<GoalProgressTrackerProps> = ({
  initialGoals = DEFAULT_GOALS,
}) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  };

  const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Geçti';
    if (days === 0) return 'Bugün';
    if (days === 1) return '1 gün';
    if (days < 30) return `${days} gün`;
    const months = Math.floor(days / 30);
    return `${months} ay`;
  };

  const getMonthlyRequired = (goal: Goal) => {
    if (!goal.deadline) return null;
    const now = new Date();
    const end = new Date(goal.deadline);
    const months = Math.max(1, (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()));
    const remaining = goal.targetAmount - goal.savedAmount;
    return remaining / months;
  };

  return (
    <div className="bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#6E6E73]" />
          <span className="text-[12px] font-semibold text-[#6E6E73] dark:text-[#8E8E93] uppercase tracking-wider">
            Tasarruf Hedefleri
          </span>
        </div>
        <span className="text-[12px] text-[#6E6E73] dark:text-[#8E8E93]">
          {goals.length} hedef
        </span>
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal);
          const isComplete = progress >= 100;
          const timeRemaining = getTimeRemaining(goal.deadline);
          const monthlyRequired = getMonthlyRequired(goal);

          return (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(selectedGoal?.id === goal.id ? null : goal)}
              className={`w-full text-left p-4 rounded-xl transition-all min-h-[72px] ${
                selectedGoal?.id === goal.id
                  ? 'bg-[#F5F5F7] dark:bg-[#2C2C2E] ring-2 ring-ios-blue/30'
                  : 'bg-[#F5F5F7]/50 dark:bg-[#2C2C2E]/50 hover:bg-[#F5F5F7] dark:hover:bg-[#2C2C2E]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                  <span className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white">
                    {goal.name}
                  </span>
                  {isComplete && (
                    <CheckCircle className="w-4 h-4 text-ios-green" />
                  )}
                </div>
                <span className="text-[13px] font-bold" style={{ color: goal.color }}>
                  {progress.toFixed(0)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white dark:bg-[#3A3A3C] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#6E6E73] dark:text-[#8E8E93]">
                  {formatCurrency(goal.savedAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
                {timeRemaining && (
                  <span className="text-[#8E8E93]">{timeRemaining} kaldı</span>
                )}
              </div>

              {/* Expanded Details */}
              {selectedGoal?.id === goal.id && (
                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/10 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] font-semibold text-[#8E8E93] uppercase">
                        Kalan Miktar
                      </div>
                      <div className="text-[15px] font-bold text-[#1D1D1F] dark:text-white">
                        {formatCurrency(goal.targetAmount - goal.savedAmount)}
                      </div>
                    </div>
                    {monthlyRequired && (
                      <div>
                        <div className="text-[10px] font-semibold text-[#8E8E93] uppercase">
                          Aylık Gereken
                        </div>
                        <div className="text-[15px] font-bold" style={{ color: goal.color }}>
                          {formatCurrency(monthlyRequired)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[11px] font-semibold text-[#6E6E73] dark:text-[#8E8E93] uppercase">
              Toplam Tasarruf
            </div>
            <div className="text-[20px] font-bold text-ios-green">
              {formatCurrency(goals.reduce((sum, g) => sum + g.savedAmount, 0))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold text-[#6E6E73] dark:text-[#8E8E93] uppercase">
              Toplam Hedef
            </div>
            <div className="text-[20px] font-bold text-[#1D1D1F] dark:text-white">
              {formatCurrency(goals.reduce((sum, g) => sum + g.targetAmount, 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalProgressTracker;
