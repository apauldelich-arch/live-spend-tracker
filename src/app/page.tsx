'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useStore, Currency, Session, Expense } from '@/store/useStore';
import styles from './page.module.css';
import { WelcomeView } from '../components/WelcomeView';

type ViewMode = 'welcome' | 'active' | 'archive';

export default function Home() {
  const { 
    sessions, 
    expenses, 
    addSession, 
    addExpense, 
    completeSession, 
    updateSession, 
    updateExpense, 
    deleteExpense, 
    restoreExpense, 
    lastDeletedExpense, 
    getSessionStats 
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [viewingSessionId, setViewingSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // New Search State
  const [vendorSearch, setVendorSearch] = useState('');

  // Modals
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // New/Edit Session State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'budget' | 'tracking'>('budget');
  const [newBudget, setNewBudget] = useState('');
  const [newCurrency, setNewCurrency] = useState<Currency>('£');

  // New/Edit Expense State
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  // UI State for deleting
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // Hydration & Initial View
  useEffect(() => {
    setMounted(true);
    if (sessions.length === 0) {
      setViewMode('welcome');
    }
  }, [sessions.length]);

  const resetSessionForm = (session?: Session) => {
    setNewName(session?.name || '');
    setNewType(session?.type || 'budget');
    setNewBudget(session?.totalBudget?.toString() || '');
    setNewCurrency(session?.currency || '£');
  };

  const resetExpenseForm = (expense?: Expense) => {
    setExpenseAmount(expense?.amount?.toString() || '');
    setExpenseVendor(expense?.vendor || '');
    setExpenseCategory(expense?.category || '');
    setExpenseNote(expense?.note || '');
    setExpenseDate(expense?.date || new Date().toISOString().split('T')[0]);
  };

  const handleCreateOrUpdateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const data = {
      name: newName,
      type: newType,
      totalBudget: newType === 'budget' && newBudget ? parseFloat(newBudget) : undefined,
      currency: newCurrency,
    };
    if (isEditingSession && viewingSessionId) {
      updateSession(viewingSessionId, data);
      setIsEditingSession(false);
    } else {
      addSession(data);
      setIsAddingSession(false);
      setViewMode('active');
    }
    resetSessionForm();
  };

  const handleCreateOrUpdateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmount) return;
    const data = {
      amount: parseFloat(expenseAmount),
      vendor: expenseVendor,
      category: expenseCategory,
      note: expenseNote,
      date: expenseDate,
    };
    if (editingExpenseId) {
      updateExpense(editingExpenseId, data);
      setEditingExpenseId(null);
    } else if (selectedSessionId) {
      addExpense({ ...data, sessionId: selectedSessionId });
      setIsAddingExpense(true); 
      resetExpenseForm();
      return; 
    }
    resetExpenseForm();
    setIsAddingExpense(false);
  };

  const activeSessions = sessions.filter(s => s.status === 'active');
  const archivedSessions = sessions.filter(s => s.status === 'completed');

  const currentViewingSession = sessions.find(s => s.id === viewingSessionId);
  const currentExpenses = expenses
    .filter(e => e.sessionId === viewingSessionId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.timestamp - a.timestamp);
  
  const searchedExpenses = currentExpenses.filter(e => 
    e.vendor.toLowerCase().includes(vendorSearch.toLowerCase()) ||
    e.category.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const categoryTotals = currentExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const uniqueVendorsForSuggestions = Array.from(new Set(expenses.map(e => e.vendor))).sort();
  const uniqueCategoriesForSuggestions = Array.from(new Set(expenses.map(e => e.category))).sort();

  if (!mounted) return null;

  return (
    <main className={styles.appShell}>
      {/* Sidebar for Desktop - Updated to 4 tabs */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.iconCircle}>£</div>
          <h2>Live Spend</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <button 
            className={viewMode === 'welcome' ? `${styles.navItem} ${styles.navActive}` : styles.navItem}
            onClick={() => { setViewMode('welcome'); setViewingSessionId(null); }}
          >
            Welcome
          </button>
          <button 
            className={(viewMode === 'active' && viewingSessionId === null) ? `${styles.navItem} ${styles.navActive}` : styles.navItem}
            onClick={() => { setViewMode('active'); setViewingSessionId(null); }}
          >
            Active
          </button>
          <button 
            className={(viewMode === 'archive' && viewingSessionId === null) ? `${styles.navItem} ${styles.navActive}` : styles.navItem}
            onClick={() => { setViewMode('archive'); setViewingSessionId(null); }}
          >
            Archive
          </button>
        </nav>
      </aside>

      <section className={styles.content}>
        
        {viewMode === 'welcome' && (
          <WelcomeView onStart={() => { setIsAddingSession(true); setViewingSessionId(null); }} />
        )}

        {(viewMode === 'active' || viewMode === 'archive') && viewingSessionId && currentViewingSession ? (
          /* SESSION DETAIL VIEW */
          <div className={styles.detailView}>
            <header className={styles.detailHeader}>
              <button className={styles.backBtn} onClick={() => setViewingSessionId(null)}>← Back</button>
              <div className={styles.detailTitleArea}>
                <h1>{currentViewingSession.name}</h1>
                <button className={styles.editBtn} onClick={() => { resetSessionForm(currentViewingSession); setIsEditingSession(true); }}>Edit</button>
              </div>
            </header>

            <div className={`glass glass-card ${styles.heroStats}`}>
               {(() => {
                 const stats = getSessionStats(currentViewingSession.id);
                 const color = stats.percentage < 70 ? 'var(--status-safe)' : 
                               stats.percentage < 90 ? 'var(--status-warning)' : 
                               'var(--status-critical)';
                 return (
                   <>
                    <div className={styles.mainStatLarge}>
                      <span className={styles.currencyLarge}>{currentViewingSession.currency}</span>
                      <span className={styles.amountLarge}>{stats.spent.toLocaleString()}</span>
                    </div>
                    {currentViewingSession.type === 'budget' && (
                      <>
                        <div className="progress-container" style={{ margin: '1.5rem 0 1rem' }}>
                          <div 
                            className={`progress-fill ${stats.percentage >= 90 ? 'pulse-critical' : ''}`}
                            style={{ 
                              width: `${Math.min(stats.percentage, 100)}%`, 
                              backgroundColor: color 
                            }} 
                          />
                        </div>
                        <div className={styles.budgetMetrics}>
                           <div><p>Left</p><h4 style={{ color }}>{currentViewingSession.currency}{stats.remaining.toLocaleString()}</h4></div>
                           <div><p>Budget</p><h4>{currentViewingSession.currency}{currentViewingSession.totalBudget?.toLocaleString()}</h4></div>
                           <div><p>Usage</p><h4 style={{ color }}>{Math.round(stats.percentage)}%</h4></div>
                        </div>
                      </>
                    )}
                   </>
                 );
               })()}
            </div>

            {/* Simple Analytics */}
            {currentExpenses.length > 0 && (
              <div className={styles.analyticsSection}>
                <p className={styles.navLabel} style={{ margin: '0 0 0.75rem' }}>Spend by Category</p>
                <div className={styles.categoryPills}>
                  {Object.entries(categoryTotals).map(([cat, total]) => (
                    <div key={cat} className={styles.analyticsPill}>
                      <span className={styles.pillLabel}>{cat}</span>
                      <span className={styles.pillValue}>{currentViewingSession.currency}{total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.expenseListTitle}>
               <h3>Expenses</h3>
               <button onClick={() => { setSelectedSessionId(currentViewingSession.id); setIsAddingExpense(true); }} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Add Entry</button>
            </div>

            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search vendor or category..." 
                value={vendorSearch} 
                onChange={(e) => setVendorSearch(e.target.value)} 
                className={styles.searchInput}
              />
            </div>

            <div className={styles.fullExpenseList}>
               {searchedExpenses.length === 0 ? (
                 <p className={styles.emptyMsg}>{vendorSearch ? 'No matches found.' : 'No entries recorded.'}</p>
               ) : (
                 searchedExpenses.map(e => (
                   <div key={e.id} className={`glass ${styles.fullExpenseItem}`}>
                      <div className={styles.expenseInfo}>
                        <strong>{e.vendor}</strong>
                        <div className={styles.expenseSub}>
                          <span className={styles.dateTag}>{new Date(e.date + 'T00:00:00').toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                          <span className={styles.categoryTag}>{e.category}</span>
                          <span className={styles.noteText}>{e.note}</span>
                        </div>
                      </div>
                      <div className={styles.expenseValue}>
                         <span className={styles.rowAmount}>{currentViewingSession.currency}{e.amount.toLocaleString()}</span>
                         <div className={styles.rowActions}>
                            <button className={styles.editRowBtn} onClick={() => { resetExpenseForm(e); setEditingExpenseId(e.id); setIsAddingExpense(true); }}>Edit</button>
                            <button className={styles.deleteRowBtn} onClick={() => setDeletingExpenseId(e.id)} style={{ color: 'var(--status-critical)' }}>✕</button>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
            
            {/* Confirmation Modal */}
            {deletingExpenseId && (
              <div className={styles.modalOverlay}>
                <div className="glass glass-card" style={{ width: '90%', maxWidth: '344px', textAlign: 'center' }}>
                  <h3>Delete Item?</h3>
                  <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Remove this entry permanently?</p>
                  <div className={styles.modalActions}>
                    <button onClick={() => setDeletingExpenseId(null)} className={styles.cancelBtn}>Cancel</button>
                    <button onClick={() => { deleteExpense(deletingExpenseId); setDeletingExpenseId(null); }} className="btn-primary" style={{ backgroundColor: 'var(--status-critical)' }}>Confirm</button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.footerActions}>
                {currentViewingSession.status === 'active' ? (
                   <button className="btn-primary" style={{ backgroundColor: 'var(--surface-2)', width: '100%' }} onClick={() => { completeSession(currentViewingSession.id); setViewingSessionId(null); setViewMode('archive'); }}>Finish & Archive</button>
                ) : (
                  <button className="btn-primary" style={{ backgroundColor: 'var(--surface-2)', width: '100%' }} onClick={() => { updateSession(currentViewingSession.id, { status: 'active' }); setViewMode('active'); }}>Reactivate Project</button>
                )}
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW (Grid of Sessions) */
          (viewMode === 'active' || viewMode === 'archive') && !viewingSessionId && (
            <div className={styles.dashboardContainer}>
              <header className={styles.header}>
                <h1 className={styles.title}>{viewMode === 'active' ? 'Active Trackers' : 'Archive'}</h1>
                <p className={styles.subtitle}>{viewMode === 'active' ? 'Manage your ongoing budget sessions and spending pulse.' : 'Historical records of your past trackers.'}</p>
              </header>

              <div className={styles.grid}>
                {(viewMode === 'active' ? activeSessions : archivedSessions).length === 0 ? (
                  <div className="glass glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No {viewMode} sessions found.</p>
                    {viewMode === 'active' && <button onClick={() => setIsAddingSession(true)} className="btn-primary" style={{ marginTop: '1.5rem' }}>+ Start First Tracker</button>}
                  </div>
                ) : (
                  (viewMode === 'active' ? activeSessions : archivedSessions).map(session => {
                    const stats = getSessionStats(session.id);
                    const color = stats.percentage < 70 ? 'var(--status-safe)' : 
                                  stats.percentage < 90 ? 'var(--status-warning)' : 
                                  'var(--status-critical)';
                    return (
                      <div key={session.id} className={`glass glass-card ${styles.card}`} onClick={() => setViewingSessionId(session.id)} style={{ cursor: 'pointer' }}>
                        <div className={styles.cardHeader}><h3>{session.name}</h3><div className={styles.cardIndicator} style={{ backgroundColor: color }} /></div>
                        <div className={styles.cardStats}>
                          <div className={styles.mainStat}>
                            <span className={styles.currency}>{session.currency}</span>
                            <span className={styles.amount}>{stats.spent.toLocaleString()}</span>
                          </div>
                          {session.type === 'budget' && <div className={styles.budgetLabel}>{Math.round(stats.percentage)}% of {session.currency}{session.totalBudget?.toLocaleString()}</div>}
                        </div>
                        {session.type === 'budget' && (<div className="progress-container" style={{ marginTop: '0.75rem' }}><div className="progress-fill" style={{ width: `${Math.min(stats.percentage, 100)}%`, backgroundColor: color }} /></div>)}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )
        )}
      </section>

      {/* Mobile Bottom Navigation - 4 Tabs */}
      <nav className={styles.mobileBottomNav}>
        <button 
          className={viewMode === 'welcome' ? `${styles.mobileNavItem} ${styles.mobileNavActive}` : styles.mobileNavItem}
          onClick={() => { setViewMode('welcome'); setViewingSessionId(null); }}
        >
          <span className={styles.mobileIcon}>✨</span>
          <span className={styles.mobileLabel}>Welcome</span>
        </button>
        <button 
          className={viewMode === 'active' ? `${styles.mobileNavItem} ${styles.mobileNavActive}` : styles.mobileNavItem}
          onClick={() => { setViewMode('active'); setViewingSessionId(null); }}
        >
          <span className={styles.mobileIcon}>💷</span>
          <span className={styles.mobileLabel}>Active</span>
        </button>
        <button 
          className={viewMode === 'archive' ? `${styles.mobileNavItem} ${styles.mobileNavActive}` : styles.mobileNavItem}
          onClick={() => { setViewMode('archive'); setViewingSessionId(null); }}
        >
          <span className={styles.mobileIcon}>📁</span>
          <span className={styles.mobileLabel}>Archive</span>
        </button>
        <button 
          className={isAddingSession || isAddingExpense ? `${styles.mobileNavItem} ${styles.mobileNavActive}` : styles.mobileNavItem}
          onClick={() => { viewingSessionId ? setIsAddingExpense(true) : setIsAddingSession(true); }}
        >
          <span className={styles.mobileIcon}>➕</span>
          <span className={styles.mobileLabel}>Add</span>
        </button>
      </nav>

      {/* Undo Toast */}
      {lastDeletedExpense && (
        <div className={styles.undoToast}>
          <span>Deleted.</span>
          <button onClick={restoreExpense}>Undo</button>
        </div>
      )}

      {/* MODALS */}
      {(isAddingSession || isEditingSession) && (
        <div className={styles.modalOverlay}>
          <div className="glass glass-card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2>{isEditingSession ? 'Edit' : 'Create'} Tracker</h2>
            <form onSubmit={handleCreateOrUpdateSession}>
              <div className={styles.inputGroup}><label>Tracker Name</label><input required type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Weekly Groceries" /></div>
              <div className={styles.inputGroup}><label>Mode</label><select value={newType} onChange={e => setNewType(e.target.value as 'budget' | 'tracking')}><option value="budget">Hard Budget</option><option value="tracking">Just Tracking</option></select></div>
              {newType === 'budget' && (<div className={styles.inputGroup}><label>Total Budget</label><input required type="number" step="0.01" value={newBudget} onChange={e => setNewBudget(e.target.value)} /></div>)}
              <div className={styles.inputGroup}><label>Currency</label><select value={newCurrency} onChange={e => setNewCurrency(e.target.value as Currency)}><option value="£">GBP (£)</option><option value="€">EUR (€)</option><option value="$">USD ($)</option><option value="ARS">ARS ($)</option></select></div>
              <div className={styles.modalActions}><button type="button" onClick={() => { setIsAddingSession(false); setIsEditingSession(false); }} className={styles.cancelBtn}>Cancel</button><button type="submit" className="btn-primary">{isEditingSession ? 'Save' : 'Start'}</button></div>
            </form>
          </div>
        </div>
      )}

      {(isAddingExpense || editingExpenseId) && (
        <div className={styles.modalOverlay}>
          <div className="glass glass-card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2>{editingExpenseId ? 'Edit' : 'Quick'} Entry</h2>
            <form onSubmit={handleCreateOrUpdateExpense}>
              <div className={styles.inputGroup}><label>Amount</label><input required autoFocus type="number" step="0.01" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Date</label><input required type="date" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Vendor</label><input list="vendor-suggestions" required type="text" placeholder="e.g. Supermarket" value={expenseVendor} onChange={e => setExpenseVendor(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Category</label><input list="category-suggestions" required type="text" placeholder="e.g. GROCERIES" value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Note</label><input type="text" placeholder="Optional details..." value={expenseNote} onChange={e => setExpenseNote(e.target.value)} /></div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => { setIsAddingExpense(false); setEditingExpenseId(null); resetExpenseForm(); }} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className="btn-primary">{editingExpenseId ? 'Save' : 'Log'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <datalist id="vendor-suggestions">{uniqueVendorsForSuggestions.map(v => <option key={v} value={v} />)}</datalist>
      <datalist id="category-suggestions">{uniqueCategoriesForSuggestions.map(c => <option key={c} value={c} />)}</datalist>
    </main>
  );
}
