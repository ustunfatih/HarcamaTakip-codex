
import LZString from 'lz-string';
import { ReportData, CategorySpending, YNABTransaction } from './types';

// Currency symbols map for common currencies
export const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
  QAR: 'ر.ق',  // Qatari Riyal
  AED: 'د.إ',  // UAE Dirham
  SAR: 'ر.س',  // Saudi Riyal
  JPY: '¥',
  KWD: 'د.ك',  // Kuwaiti Dinar
  BHD: 'د.ب',  // Bahraini Dinar
  OMR: 'ر.ع',  // Omani Rial
};

// Global currency state (set from App.tsx when budget changes)
let currentCurrencySymbol = '₺';
let currentCurrencyCode = 'TRY';

export const setCurrency = (symbol: string, code: string) => {
  currentCurrencySymbol = symbol || CURRENCY_SYMBOLS[code] || code;
  currentCurrencyCode = code;
};

export const getCurrencySymbol = () => currentCurrencySymbol;

export const formatCurrency = (amount: number, customSymbol?: string): string => {
  const symbol = customSymbol || currentCurrencySymbol;
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbol}${formatted}`;
};

export const formatPercent = (value: number, decimals: number = 0): string => {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

export const formatDateRange = (start: string, end: string): string => {
  // Parsing YYYY-MM-DD manually to avoid timezone issues
  const parseDate = (dStr: string) => {
    const [year, month, day] = dStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const s = parseDate(start);
  const e = parseDate(end);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const sStr = s.toLocaleDateString('tr-TR', options);
  const eStr = e.toLocaleDateString('tr-TR', options);

  return `${sStr} - ${eStr}`;
};

export const getRandomColorClass = (index: number) => {
  const colors = [
    'bg-green-500',
    'bg-pink-500',
    'bg-purple-400',
    'bg-orange-400',
    'bg-teal-400'
  ];
  return colors[index % colors.length];
};

export const downloadHtmlFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// --- Sharing Logic ---

// Minified types for URL compression
type MinifiedTransaction = [string, number]; // [payee, amount]
type MinifiedCategory = [string, number, MinifiedTransaction[]]; // [name, total, top_payees]
type MinifiedData = [number, string, string, MinifiedCategory[], number[]]; // [total, start, end, categories, dayOfWeekStats]

export const compressData = (data: ReportData): string => {
  const minified: MinifiedData = [
    data.totalSpent,
    data.startDate,
    data.endDate,
    data.categories.map(c => {
      // 1. Aggregate payees first to ensure we sort correctly
      const payeeMap: Record<string, number> = {};
      c.transactions.forEach(t => {
        const p = t.payee_name || 'Bilinmeyen';
        const amt = -t.amount / 1000;
        payeeMap[p] = (payeeMap[p] || 0) + amt;
      });

      // 2. Convert to array and Sort by amount desc
      const sortedPayees = Object.entries(payeeMap)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);

      // 3. LIMIT TO TOP 10 Payees to save URL space
      const topPayees = sortedPayees.slice(0, 10).map(p => [
        p.name,
        p.total
      ] as MinifiedTransaction);

      return [
        c.categoryName,
        c.totalAmount,
        topPayees
      ] as MinifiedCategory;
    }),
    (() => {
      // Aggregate day of week spending for the shared chart
      const dayStats = Array(7).fill(0);
      data.categories.forEach(c => {
        c.transactions.forEach(t => {
          const dateParts = t.date.split('-').map(Number);
          if (dateParts.length === 3) {
            const d = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            dayStats[d.getDay()] += (-t.amount / 1000);
          }
        });
      });
      return dayStats;
    })()
  ];

  const json = JSON.stringify(minified);
  return LZString.compressToEncodedURIComponent(json);
};

export const decompressData = (compressed: string): ReportData | null => {
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    const minified: MinifiedData = JSON.parse(json);

    const [totalSpent, startDate, endDate, minCategories, dayOfWeekStats] = minified;

    const categories: CategorySpending[] = minCategories.map((mc) => {
      const [name, total, minTrans] = mc;

      // Reconstruct transactions object for CategoryCard compatibility
      const transactions = minTrans.map((mt) => ({
        payee_name: mt[0],
        amount: mt[1] * 1000 * -1,

        // Dummy fields
        id: 'share', date: '', memo: null, cleared: '', approved: true,
        flag_color: null, account_id: '', payee_id: null, category_id: null,
        transfer_account_id: null, import_id: null, deleted: false,
        account_name: '', category_name: name
      } as YNABTransaction));

      return {
        categoryId: name,
        categoryName: name,
        totalAmount: total,
        transactions: transactions,
        color: ''
      };
    });

    return {
      totalSpent,
      startDate,
      endDate,
      categories,
      dayOfWeekStats
    };
  } catch (e) {
    console.error("Decompression failed", e);
    return null;
  }
};

export const generateSampleReportData = (
  days: number = 30,
  categoryCount: number = 6,
  transactionCount: number = 240
): ReportData => {
  const today = new Date();
  const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
  const startDateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;

  const categories: CategorySpending[] = Array.from({ length: categoryCount }).map((_, index) => ({
    categoryId: `cat-${index + 1}`,
    categoryName: `Kategori ${index + 1}`,
    totalAmount: 0,
    transactions: [],
    color: ''
  }));

  const randomCategory = () => categories[Math.floor(Math.random() * categories.length)];

  for (let i = 0; i < transactionCount; i += 1) {
    const category = randomCategory();
    const dayOffset = Math.floor(Math.random() * days);
    const txDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOffset);
    const txDateStr = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}-${String(txDate.getDate()).padStart(2, '0')}`;
    const amount = -(Math.floor(Math.random() * 400) + 30) * 1000;

    const transaction: YNABTransaction = {
      id: `sample-${i}`,
      date: txDateStr,
      amount,
      memo: null,
      cleared: 'cleared',
      approved: true,
      flag_color: null,
      flag_name: null,
      account_id: 'sample',
      payee_id: null,
      category_id: category.categoryId,
      transfer_account_id: null,
      import_id: null,
      deleted: false,
      account_name: 'Sample',
      payee_name: `Payee ${i % 12}`,
      category_name: category.categoryName
    };
    category.transactions.push(transaction);
    category.totalAmount += Math.abs(amount / 1000);
  }

  const totalSpent = categories.reduce((sum, c) => sum + c.totalAmount, 0);
  return {
    totalSpent,
    startDate: startDateStr,
    endDate,
    categories,
    cashFlowStats: {
      income: totalSpent * 1.4,
      expense: totalSpent,
      net: totalSpent * 0.4,
      savingsRate: 28
    }
  };
};
