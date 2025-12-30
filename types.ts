
export interface YNABBudgetSummary {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  currency_format?: {
    iso_code: string;
    currency_symbol: string;
    decimal_digits: number;
    symbol_first: boolean;
  };
}

export interface YNABAccount {
  id: string;
  name: string;
  type: string;
  on_budget: boolean;
  closed: boolean;
  balance: number;
  cleared_balance: number;
  uncleared_balance: number;
}

export interface YNABTransaction {
  id: string;
  date: string;
  amount: number;
  memo: string | null;
  cleared: string;
  approved: boolean;
  flag_color: string | null;
  flag_name: string | null; // Added for specific flag label filtering
  account_id: string;
  payee_id: string | null;
  category_id: string | null;
  transfer_account_id: string | null;
  import_id: string | null;
  deleted: boolean;
  account_name: string;
  payee_name: string;
  category_name: string;
  subtransactions?: YNABSubtransaction[];
}

export interface YNABSubtransaction {
  id: string;
  transaction_id: string;
  amount: number;
  memo: string | null;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  transfer_account_id: string | null;
  deleted: boolean;
}

// Internal types for the report
export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  transactions: YNABTransaction[];
  color: string; // Hex color for UI
}

export interface ComparisonDataPoint {
  index: number; // Day (1-31) or Month (0-11)
  label: string; // "1. Gün" or "Ocak"
  current: number;
  previous: number;
}

export interface ComparisonConfig {
  type: 'daily' | 'monthly';
  title: string;
  subtitle: string;
  currentLabel: string;
  previousLabel: string;
}

export interface ReportData {
  totalSpent: number;
  startDate: string;
  endDate: string;
  categories: CategorySpending[];
  comparisonData?: ComparisonDataPoint[];
  comparisonConfig?: ComparisonConfig; // Replaces simple comparisonType
  comparisonType?: 'daily' | 'monthly'; // Kept for backward compatibility but deprecated
  dayOfWeekStats?: number[]; // Added for shared report support
  totalIncome?: number;
  totalExpense?: number;
  historicalMonthlyAverage?: number;
  cashFlowStats?: {
    income: number;
    expense: number;
    net: number;
    savingsRate: number;
  };
  categoryTrends?: Record<string, {
    previousAmount: number;
    changePercentage: number;
  }>;
  recurringItems?: Array<{
    payee: string;
    averageAmount: number;
    count: number;
    lastDate: string;
  }>;
  potentialDuplicates?: Array<{
    payee: string;
    amount: number;
    date: string;
  }>;
}

// Scheduled Transactions for Future Payments (Gelecek Tab)
export interface YNABScheduledTransaction {
  id: string;
  date_first: string;
  date_next: string;
  frequency: string; // 'never', 'daily', 'weekly', 'everyOtherWeek', 'twiceAMonth', 'every4Weeks', 'monthly', 'everyOtherMonth', 'every3Months', 'every4Months', 'twiceAYear', 'yearly', 'everyOtherYear'
  amount: number;
  memo: string | null;
  flag_color: string | null;
  flag_name: string | null;
  account_id: string;
  account_name: string;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  transfer_account_id: string | null;
  deleted: boolean;
  subtransactions: YNABScheduledSubtransaction[];
}

export interface YNABScheduledSubtransaction {
  id: string;
  scheduled_transaction_id: string;
  amount: number;
  memo: string | null;
  payee_id: string | null;
  payee_name: string | null;
  category_id: string | null;
  category_name: string | null;
  transfer_account_id: string | null;
  deleted: boolean;
}

export interface FuturePaymentMonth {
  month: string; // YYYY-MM format
  label: string; // Display label like "Ocak 2024"
  total: number;
  categories: FutureCategoryBreakdown[];
}

export interface FutureCategoryBreakdown {
  categoryId: string;
  categoryName: string;
  amount: number;
  color: string;
  transactions: ExpandedScheduledTransaction[];
}

export interface ExpandedScheduledTransaction {
  id: string;
  date: string;
  amount: number;
  payee_name: string | null;
  category_name: string | null;
  category_id: string | null;
  memo: string | null;
  flag_color: string | null;
  flag_name: string | null;
  frequency: string;
  isRecurring: boolean;
}