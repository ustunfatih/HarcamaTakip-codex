import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ComparisonDataPoint, ComparisonConfig } from '../types';
import { formatCurrency } from '../utils';

interface MonthComparisonChartProps {
  data: ComparisonDataPoint[];
  config?: ComparisonConfig;
  type?: 'daily' | 'monthly';
}

export const MonthComparisonChart: React.FC<MonthComparisonChartProps> = ({ data, config, type }) => {
  const chartType = config?.type || type || 'daily';
  const currentLabel = config?.currentLabel || (chartType === 'daily' ? 'Bu Ay' : 'Bu Yıl');
  const previousLabel = config?.previousLabel || (chartType === 'daily' ? 'Geçen Ay' : 'Geçen Yıl');

  let currentTotal = 0;
  let prevTotal = 0;
  if (data && data.length > 0) {
    if (chartType === 'daily' && currentLabel === 'Bu Ay') {
      const todayDay = new Date().getDate();
      const todayData = data.find(d => d.index === todayDay);
      if (todayData) {
        currentTotal = todayData.current;
        prevTotal = todayData.previous;
      } else {
        const last = data[data.length - 1];
        currentTotal = last?.current || 0;
        prevTotal = last?.previous || 0;
      }
    } else {
      const lastPoint = data[data.length - 1];
      currentTotal = lastPoint ? lastPoint.current : 0;
      prevTotal = lastPoint ? lastPoint.previous : 0;
    }
  }
  const diff = currentTotal - prevTotal;
  const isLess = diff < 0;
  const diffAmount = Math.abs(diff);

  const chartData = useMemo(() => {
    if (chartType === 'daily' && currentLabel === 'Bu Ay') {
      const today = new Date().getDate();
      return data.map(d => ({
        ...d,
        current: d.index > today ? null : d.current
      }));
    }
    return data;
  }, [data, chartType, currentLabel]);

  const brand = 'var(--brand-1)';
  const muted = 'var(--text-muted)';
  const surface = 'var(--surface-1)';

  const renderTodayMarker = (props: any) => {
    const { cx, cy, payload } = props;
    const today = new Date().getDate();
    if (chartType === 'daily' && currentLabel === 'Bu Ay' && payload.index === today) {
      return (
        <g key="today-marker">
          <circle cx={cx} cy={cy} r={8} fill={brand} fillOpacity="0.3">
            <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={4} fill={surface} stroke={brand} strokeWidth={2} />
        </g>
      );
    }
    return <></>;
  };

  return (
    <div className="chart-panel p-6 relative overflow-hidden mb-4">
      {/* Dynamic Background Blob */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-colors duration-500 ${isLess ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>

      <div className="flex justify-end mb-6 relative z-10">
        <div className={`text-[12px] font-bold px-2 py-1 rounded-[8px] backdrop-blur-md border ${isLess ? 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200/50 dark:border-green-800' : 'bg-red-100/50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800'}`}>
          {isLess
            ? `▼ ${formatCurrency(diffAmount)} daha az`
            : `▲ ${formatCurrency(diffAmount)} daha fazla`
          }
        </div>
      </div>

      <div className="h-48 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={brand} stopOpacity={0.4} />
                <stop offset="95%" stopColor={brand} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.1} />
            <XAxis
              dataKey="label" axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fill: muted }}
              interval={chartType === 'daily' ? 4 : 0}
            />
            <YAxis
              axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fill: muted }}
              tickFormatter={(val) => `₺${val / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-strong)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
                padding: '8px 12px'
              }}
              itemStyle={{ color: 'var(--text-strong)', fontSize: '12px', padding: 0 }}
              formatter={(value: number) => value !== null ? formatCurrency(value) : ''}
              labelStyle={{ fontWeight: 600, color: muted, fontSize: '11px', marginBottom: '4px' }}
              cursor={{ stroke: muted, strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }}
            />

            <Area
              type="monotone" dataKey="previous" name={previousLabel}
              stroke={muted} strokeWidth={2} strokeDasharray="4 4"
              fill="none" activeDot={false} animationDuration={1500}
            />
            <Area
              type="monotone" dataKey="current" name={currentLabel}
              stroke={brand} strokeWidth={3} fillOpacity={1}
              fill="url(#colorCurrent)" activeDot={{ r: 6, strokeWidth: 0, fill: surface }}
              dot={renderTodayMarker} animationDuration={1500} connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
