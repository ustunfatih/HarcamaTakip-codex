
import { YNABBudgetSummary, YNABAccount, YNABTransaction, YNABScheduledTransaction, ExpandedScheduledTransaction } from '../types';

const BASE_URL = '/ynab';

export class YNABService {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      let errorMessage = `Hata kodu: ${response.status}`;
      try {
        const errorBody = await response.json();
        if (errorBody.error && errorBody.error.detail) {
          errorMessage = `YNAB Hatası: ${errorBody.error.detail}`;
        } else if (errorBody.error && errorBody.error.name) {
          errorMessage = `YNAB Hatası: ${errorBody.error.name}`;
        }
      } catch (e) {
        // If response is not JSON or parsing fails, fall back to status text
        errorMessage = `Bağlantı Hatası: ${response.status} ${response.statusText}`;
      }

      if (response.status === 401) {
        errorMessage = "Yetkisiz Giriş (401). Token hatalı veya süresi dolmuş.";
      }

      throw new Error(errorMessage);
    }
    return response.json();
  }

  async getBudgets(): Promise<YNABBudgetSummary[]> {
    const response = await fetch(`${this.baseUrl}/budgets`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    const data = await this.handleResponse(response);
    return data.data.budgets;
  }

  async getAccounts(budgetId: string): Promise<YNABAccount[]> {
    const response = await fetch(`${this.baseUrl}/budgets/${budgetId}/accounts`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });
    const data = await this.handleResponse(response);
    return data.data.accounts.filter((acc: YNABAccount) => !acc.closed && acc.on_budget);
  }

  async getTransactions(budgetId: string, accountId: string, startDate: string, endDate: string, flagFilter: string | null = null): Promise<YNABTransaction[]> {
    // Determine fetch URL based on account selection
    let url = `${this.baseUrl}/budgets/${budgetId}/transactions`;

    // If a specific account is selected (not "all"), filter by it
    if (accountId !== 'all') {
      url = `${this.baseUrl}/budgets/${budgetId}/accounts/${accountId}/transactions`;
    }

    const params = new URLSearchParams({
      since_date: startDate,
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });

    const data = await this.handleResponse(response);
    let transactions: YNABTransaction[] = data.data.transactions;

    // Client-side filtering
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Removed 'isSpending = t.amount < 0' to allow inflows (refunds/income)
      // Strictly exclude transfers between accounts
      const isNotTransfer = !t.transfer_account_id;

      // Flag Filter Logic
      let matchesFlag = true;

      if (flagFilter === 'fatih') {
        // Special logic for "Fatih": Match flag NAMES "Bonus", "MasterCard", "AMEX"
        // Note: YNAB API returns flag_name if set. We check case-insensitive.
        const fName = t.flag_name ? t.flag_name.toLowerCase() : '';
        matchesFlag = ['bonus', 'mastercard', 'amex'].includes(fName);
      } else if (flagFilter) {
        // Standard logic: Match by flag COLOR value (orange, purple, etc.)
        matchesFlag = t.flag_color === flagFilter;
      }

      return tDate >= start && tDate <= end && isNotTransfer && matchesFlag;
    });
  }

  async getScheduledTransactions(budgetId: string, accountId: string = 'all', flagFilter: string | null = null): Promise<YNABScheduledTransaction[]> {
    const response = await fetch(`${this.baseUrl}/budgets/${budgetId}/scheduled_transactions`, {
      headers: this.getHeaders(),
      credentials: 'include',
    });

    const data = await this.handleResponse(response);
    let transactions: YNABScheduledTransaction[] = data.data.scheduled_transactions;

    // Filter by Account
    if (accountId !== 'all') {
      transactions = transactions.filter(t => t.account_id === accountId);
    }

    // Filter out deleted and transfers
    return transactions.filter(t => {
      if (t.deleted) return false;
      if (t.transfer_account_id) return false;

      // Flag Filter Logic (same as regular transactions)
      let matchesFlag = true;

      if (flagFilter === 'fatih') {
        const fName = t.flag_name ? t.flag_name.toLowerCase() : '';
        matchesFlag = ['bonus', 'mastercard', 'amex'].includes(fName);
      } else if (flagFilter) {
        matchesFlag = t.flag_color === flagFilter;
      }

      return matchesFlag;
    });
  }

  /**
   * Expands scheduled transactions into individual occurrences over a given number of months
   * This projects recurring payments into the future
   */
  expandScheduledTransactions(
    scheduledTransactions: YNABScheduledTransaction[],
    monthsAhead: number = 12
  ): ExpandedScheduledTransaction[] {
    const expanded: ExpandedScheduledTransaction[] = [];
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + monthsAhead, 0);

    for (const st of scheduledTransactions) {
      // Handle subtransactions (split transactions)
      if (st.subtransactions && st.subtransactions.length > 0) {
        for (const sub of st.subtransactions) {
          if (sub.deleted || sub.transfer_account_id) continue;

          const occurrences = this.getOccurrences(st.date_next, st.frequency, endDate);
          for (const date of occurrences) {
            expanded.push({
              id: `${sub.id}-${date}`,
              date,
              amount: sub.amount,
              payee_name: sub.payee_name || st.payee_name,
              category_name: sub.category_name,
              category_id: sub.category_id,
              memo: sub.memo || st.memo,
              flag_color: st.flag_color,
              flag_name: st.flag_name,
              frequency: st.frequency,
              isRecurring: st.frequency !== 'never',
            });
          }
        }
      } else {
        // Regular scheduled transaction
        const occurrences = this.getOccurrences(st.date_next, st.frequency, endDate);
        for (const date of occurrences) {
          expanded.push({
            id: `${st.id}-${date}`,
            date,
            amount: st.amount,
            payee_name: st.payee_name,
            category_name: st.category_name,
            category_id: st.category_id,
            memo: st.memo,
            flag_color: st.flag_color,
            flag_name: st.flag_name,
            frequency: st.frequency,
            isRecurring: st.frequency !== 'never',
          });
        }
      }
    }

    return expanded;
  }

  private getOccurrences(dateNext: string, frequency: string, endDate: Date): string[] {
    const occurrences: string[] = [];
    let currentDate = new Date(dateNext);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // For non-recurring, just add the single date if it's in the future
    if (frequency === 'never') {
      if (currentDate >= today && currentDate <= endDate) {
        occurrences.push(this.formatDate(currentDate));
      }
      return occurrences;
    }

    // For recurring, calculate all occurrences up to endDate
    while (currentDate <= endDate && occurrences.length < 100) { // Safety limit
      if (currentDate >= today) {
        occurrences.push(this.formatDate(currentDate));
      }
      currentDate = this.getNextOccurrence(currentDate, frequency);
    }

    return occurrences;
  }

  private getNextOccurrence(date: Date, frequency: string): Date {
    const next = new Date(date);

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'everyOtherWeek':
        next.setDate(next.getDate() + 14);
        break;
      case 'twiceAMonth':
        // Approximate: add 15 days
        next.setDate(next.getDate() + 15);
        break;
      case 'every4Weeks':
        next.setDate(next.getDate() + 28);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'everyOtherMonth':
        next.setMonth(next.getMonth() + 2);
        break;
      case 'every3Months':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'every4Months':
        next.setMonth(next.getMonth() + 4);
        break;
      case 'twiceAYear':
        next.setMonth(next.getMonth() + 6);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
      case 'everyOtherYear':
        next.setFullYear(next.getFullYear() + 2);
        break;
      default:
        // Unknown frequency, add a month as default
        next.setMonth(next.getMonth() + 1);
    }

    return next;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
