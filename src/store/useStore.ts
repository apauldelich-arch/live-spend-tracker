import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SessionType = 'budget' | 'tracking';
export type SessionStatus = 'active' | 'paused' | 'completed';
export type Currency = '£' | '€' | '$' | 'ARS';

export interface Session {
  id: string;
  name: string;
  type: SessionType;
  totalBudget?: number;
  currency: Currency;
  status: SessionStatus;
  createdAt: number;
}

export interface Expense {
  id: string;
  sessionId: string;
  amount: number;
  category: string;
  vendor: string;
  note: string;
  timestamp: number;
}

interface AppState {
  sessions: Session[];
  expenses: Expense[];
  
  // Session Actions
  addSession: (session: Omit<Session, 'id' | 'createdAt' | 'status'>) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  deleteSession: (id: string) => void;
  completeSession: (id: string) => void;
  
  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  restoreExpense: () => void;
  lastDeletedExpense: Expense | null;
  
  // Helpers
  getSessionStats: (sessionId: string) => {
    spent: number;
    remaining: number;
    percentage: number;
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessions: [],
      expenses: [],
      lastDeletedExpense: null,

      addSession: (session) => {
        const newSession: Session = {
          ...session,
          id: crypto.randomUUID(),
          status: 'active',
          createdAt: Date.now(),
        };
        set((state) => ({ sessions: [newSession, ...state.sessions] }));
      },

      updateSession: (id, updates) => {
        set((state) => ({
          sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSession: (id) => {
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== id),
          expenses: state.expenses.filter((e) => e.sessionId !== id),
        }));
      },

      completeSession: (id) => {
        set((state) => ({
          sessions: state.sessions.map((s) => 
            s.id === id ? { ...s, status: 'completed' } : s
          ),
        }));
      },

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          vendor: expense.vendor.trim(),
          category: expense.category.trim().toUpperCase(),
          note: expense.note.trim()
        };
        set((state) => ({ expenses: [newExpense, ...state.expenses] }));
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { 
            ...e, 
            ...updates,
            vendor: updates.vendor ? updates.vendor.trim() : e.vendor,
            category: updates.category ? updates.category.trim().toUpperCase() : e.category,
            note: updates.note !== undefined ? (updates.note || '').trim() : e.note
          } : e)),
        }));
      },

      deleteExpense: (id) => {
        const item = get().expenses.find((e) => e.id === id);
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
          lastDeletedExpense: item || null,
        }));
      },

      restoreExpense: () => {
        const last = get().lastDeletedExpense;
        if (last) {
          set((state) => ({
            expenses: [last, ...state.expenses],
            lastDeletedExpense: null,
          }));
        }
      },

      getSessionStats: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        const sessionExpenses = get().expenses.filter((e) => e.sessionId === sessionId);
        const spent = sessionExpenses.reduce((acc, curr) => acc + curr.amount, 0);
        
        if (!session || session.type === 'tracking' || !session.totalBudget) {
          return { spent, remaining: 0, percentage: 0 };
        }

        const remaining = session.totalBudget - spent;
        const percentage = (spent / session.totalBudget) * 100;
        
        return { spent, remaining, percentage };
      },
    }),
    {
      name: 'life-spend-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
