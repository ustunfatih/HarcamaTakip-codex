
import { ReportData, CategorySpending } from '../types';
import { formatCurrency, formatDateRange, getRandomColorClass } from '../utils';

export const generateStandaloneHtml = (data: ReportData): string => {
  const { totalSpent, startDate, endDate, categories } = data;

  // 1. Prepare Pie Chart Logic (CSS Conic Gradient)
  // Sort for chart (Top 5 + Others)
  const sortedForChart = [...categories].sort((a, b) => b.totalAmount - a.totalAmount);
  const top5 = sortedForChart.slice(0, 5);
  const others = sortedForChart.slice(5);
  const otherTotal = others.reduce((sum, c) => sum + c.totalAmount, 0);
  
  const chartItems = top5.map(c => ({ name: c.categoryName, value: c.totalAmount }));
  if (otherTotal > 0) {
    chartItems.push({ name: 'Diğer', value: otherTotal });
  }

  const COLORS = ['#FCD34D', '#10B981', '#EC4899', '#3B82F6', '#8B5CF6', '#F97316']; // Match React colors

  let currentAngle = 0;
  const totalValue = chartItems.reduce((sum, item) => sum + item.value, 0);
  const gradientParts = chartItems.map((item, index) => {
    const percentage = (item.value / totalValue) * 100;
    const start = currentAngle;
    currentAngle += percentage;
    const color = COLORS[index % COLORS.length];
    return `${color} ${start}% ${currentAngle}%`;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  // 2. Generate HTML for Categories (Pre-aggregate Payees)
  const categoriesHtml = categories.map((cat, index) => {
    const colorClass = getRandomColorClass(index);
    const colorHex = {
        'bg-green-500': '#22c55e',
        'bg-pink-500': '#ec4899',
        'bg-purple-400': '#c084fc',
        'bg-orange-400': '#fb923c',
        'bg-teal-400': '#2dd4bf'
    }[colorClass] || '#22c55e';

    // Aggregate Payees logic (replicated from CategoryCard.tsx)
    const stats: Record<string, number> = {};
    cat.transactions.forEach(t => {
      const payee = t.payee_name || 'Bilinmeyen Satıcı';
      const amount = -t.amount / 1000;
      stats[payee] = (stats[payee] || 0) + amount;
    });
    const payeeStats = Object.entries(stats)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    const payeesRows = payeeStats.map(p => `
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.1);">
        <span style="max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.name}</span>
        <span style="font-weight: bold;">${formatCurrency(p.total)}</span>
      </div>
    `).join('');

    return `
      <div class="category-card" style="background-color: ${colorHex};" onclick="toggleCard('cat-${index}')">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <div style="font-size: 0.875rem; opacity: 0.8; margin-bottom: 0.25rem;">Kategori Harcamaları</div>
                <h3 style="font-size: 1.875rem; font-weight: 700; margin-bottom: 0.5rem; line-height: 1.1;">${cat.categoryName}</h3>
                <div style="font-size: 2.25rem; font-weight: 800;">${formatCurrency(cat.totalAmount)}</div>
            </div>
            <div>
                <!-- Chevron Icon -->
                <svg id="icon-cat-${index}" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.4; transition: transform 0.3s;">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </div>
        </div>
        <div id="cat-${index}" class="details" style="max-height: 0; opacity: 0; overflow: hidden; transition: all 0.5s ease-in-out; margin-top: 0;">
            <div style="background-color: rgba(255,255,255,0.2); border-radius: 0.5rem; padding: 1rem; margin-top: 1rem; backdrop-filter: blur(4px);">
                ${payeesRows}
            </div>
        </div>
      </div>
    `;
  }).join('');

  // 3. Generate Chart Legend HTML
  const legendHtml = chartItems.map((item, index) => `
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.125rem; margin-bottom: 0.25rem; padding-bottom: 0.25rem; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <div style="display: flex; align-items: center; overflow: hidden;">
            <span style="width: 0.75rem; height: 0.75rem; border-radius: 9999px; margin-right: 0.5rem; background-color: ${COLORS[index % COLORS.length]}; flex-shrink: 0;"></span>
            <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500;">${item.name}</span>
        </div>
        <span style="font-weight: 700; padding-left: 0.5rem; white-space: nowrap;">${formatCurrency(item.value)}</span>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Harcama Raporu</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&display=swap');
        body { font-family: 'Helvetica Neue', 'SF Pro Text', 'SF Pro Display', Arial, sans-serif; background-color: #f3f4f6; color: #0f172a; margin: 0; padding: 20px; display: flex; justify-content: center; }
        h3, .value-lg, .value-md { font-family: 'Outfit', 'Helvetica Neue', Arial, sans-serif; }
        .container { max-width: 480px; width: 100%; background-color: #f3f4f6; }
        
        .header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .info-box { background-color: #38bdf8; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); color: #0f172a; }
        .label { font-size: 0.875rem; opacity: 0.8; margin-bottom: 0.25rem; }
        .value-lg { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; }
        .value-md { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.025em; }

        .chart-box { background-color: #38bdf8; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; color: #0f172a; }
        .chart-container { display: flex; flex-direction: column; align-items: center; }
        .pie-chart {
            width: 12rem; height: 12rem; border-radius: 50%;
            background: ${conicGradient};
            margin-bottom: 1rem;
            flex-shrink: 0;
        }
        .legend { width: 100%; }

        .category-card { border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; color: #0f172a; cursor: pointer; transition: all 0.3s; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        
        @media (min-width: 640px) {
            .chart-container { flex-direction: row; align-items: flex-start; }
            .pie-chart { margin-bottom: 0; margin-right: 2rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header-grid">
            <div class="info-box">
                <div class="label">Toplam Harcama</div>
                <div class="value-lg">${formatCurrency(totalSpent)}</div>
            </div>
            <div class="info-box">
                <div class="label">Harcama Tarih Aralığı</div>
                <div class="value-md">${formatDateRange(startDate, endDate)}</div>
            </div>
        </div>

        <div class="chart-box">
            <div class="label" style="margin-bottom: 0.5rem;">Kategori Dağılımı</div>
            <div class="chart-container">
                <div class="pie-chart"></div>
                <div class="legend">
                    ${legendHtml}
                </div>
            </div>
        </div>

        <div class="category-list">
            ${categoriesHtml}
        </div>
        
        <div style="text-align: center; margin-top: 3rem; font-size: 0.75rem; color: #9ca3af;">
            YNAB Verileriyle Oluşturulmuştur
        </div>
    </div>

    <script>
        function toggleCard(id) {
            const el = document.getElementById(id);
            const icon = document.getElementById('icon-' + id);
            
            if (el.style.maxHeight === '0px' || el.style.maxHeight === '0') {
                el.style.maxHeight = '1000px';
                el.style.opacity = '1';
                icon.style.transform = 'rotate(90deg)';
            } else {
                el.style.maxHeight = '0';
                el.style.opacity = '0';
                icon.style.transform = 'rotate(0deg)';
            }
        }
    </script>
</body>
</html>
  `;
};
