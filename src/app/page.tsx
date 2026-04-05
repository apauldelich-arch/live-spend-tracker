'use client';

import React, { useState, useEffect } from 'react';
import { useStore, Currency, Session, Expense } from '@/store/useStore';
import styles from './page.module.css';

export default function Home() {
  const { sessions, expenses, addSession, addExpense, completeSession, updateSession, updateExpense, deleteExpense, restoreExpense, lastDeletedExpense, getSessionStats } = useStore();
  const [mounted, setMounted] = useState(false);
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [view, setView] = useState<'active' | 'archive'>('active');
  const [viewingSessionId, setViewingSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // New Search State
  const [vendorSearch, setVendorSearch] = useState('');

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

  // Hydration fix
  useEffect(() => {
    // Ensuring this only runs once on the client
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
      setView('active');
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
    };
    if (editingExpenseId) {
      updateExpense(editingExpenseId, data);
      setEditingExpenseId(null);
    } else if (selectedSessionId) {
      addExpense({ ...data, sessionId: selectedSessionId });
      setIsAddingExpense(true); // Allow continuous adding if they want
      // But clearing state for next one
      resetExpenseForm();
      return; 
    }
    resetExpenseForm();
    setIsAddingExpense(false);
  };

  const activeSessions = sessions.filter(s => s.status === 'active');
  const filteredSessions = sessions.filter(s => 
    view === 'active' ? s.status === 'active' : s.status === 'completed'
  );

  const currentViewingSession = sessions.find(s => s.id === viewingSessionId);
  const currentExpenses = expenses.filter(e => e.sessionId === viewingSessionId);
  const searchedExpenses = currentExpenses.filter(e => 
    e.vendor.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  // Simple Analytics Calculation
  const categoryTotals = currentExpenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  // Auto-hide Undo Toast
  useEffect(() => {
    if (lastDeletedExpense) {
      const timer = setTimeout(() => {
        // We can't directly clear from store here easily without an action, 
        // but we can just use a local show state.
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastDeletedExpense]);

  if (!mounted) return null;

  return (
    <main className={styles.appShell}>
      {/* Sidebar for navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.iconCircle}>£</div>
          <h2>Live Spend</h2>
        </div>
        <nav className={styles.sidebarNav}>
          <button 
            className={viewingSessionId === null && view === 'active' ? `${styles.navItem} ${styles.navActive} ${styles.bold}` : `${styles.navItem} ${styles.bold}`}
            onClick={() => { setViewingSessionId(null); setView('active'); }}
          >
            Dashboard
          </button>
        </nav>
      </aside>

      <section className={styles.content}>
        {viewingSessionId && currentViewingSession ? (
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
               <button onClick={() => { setSelectedSessionId(currentViewingSession.id); setIsAddingExpense(true); }} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>+ Add Expense</button>
            </div>

            {/* Search Bar */}
            <div className={styles.searchBar}>
              <input 
                type="text" 
                placeholder="Search by vendor..." 
                value={vendorSearch} 
                onChange={(e) => setVendorSearch(e.target.value)} 
                className={styles.searchInput}
              />
            </div>

            <div className={styles.fullExpenseList}>
               {searchedExpenses.length === 0 ? (
                 <p className={styles.emptyMsg}>{vendorSearch ? 'No matches found.' : 'No expenses recorded.'}</p>
               ) : (
                 searchedExpenses.map(e => (
                   <div key={e.id} className={`glass ${styles.fullExpenseItem}`}>
                      <div className={styles.expenseInfo}>
                        <strong>{e.vendor}</strong>
                        <div className={styles.expenseSub}>
                          <span className={styles.categoryTag}>{e.category}</span>
                          <span className={styles.noteText}>{e.note}</span>
                        </div>
                      </div>
                      <div className={styles.expenseValue}>
                         <span className={styles.rowAmount}>{currentViewingSession.currency}{e.amount.toLocaleString()}</span>
                         <div className={styles.rowActions}>
                            <button className={styles.editRowBtn} onClick={() => { resetExpenseForm(e); setEditingExpenseId(e.id); }}>Edit</button>
                            <button className={styles.deleteRowBtn} onClick={() => setDeletingExpenseId(e.id)} style={{ color: 'var(--status-critical)' }}>Delete</button>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
            
            {/* Confirmation Modal (Custom) */}
            {deletingExpenseId && (
              <div className={styles.modalOverlay}>
                <div className="glass glass-card" style={{ width: '90%', maxWidth: '340px', textAlign: 'center' }}>
                  <h3>Delete Item?</h3>
                  <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Are you sure you want to remove this expense? This action can be undone briefly.</p>
                  <div className={styles.modalActions}>
                    <button onClick={() => setDeletingExpenseId(null)} className={styles.cancelBtn}>Cancel</button>
                    <button onClick={() => { deleteExpense(deletingExpenseId); setDeletingExpenseId(null); }} className="btn-primary" style={{ backgroundColor: 'var(--status-critical)' }}>Delete</button>
                  </div>
                </div>
              </div>
            )}

            {/* Undo Toast */}
            {lastDeletedExpense && (
              <div className={styles.undoToast}>
                <span>Expense deleted.</span>
                <button onClick={restoreExpense}>Undo</button>
              </div>
            )}

            <div className={styles.footerActions}>
                {currentViewingSession.status === 'active' ? (
                   <button className="btn-primary" style={{ backgroundColor: 'var(--surface-2)', width: '100%' }} onClick={() => { completeSession(currentViewingSession.id); setViewingSessionId(null); }}>Finish & Archive</button>
                ) : (
                  <button className="btn-primary" style={{ backgroundColor: 'var(--surface-2)', width: '100%' }} onClick={() => updateSession(currentViewingSession.id, { status: 'active' })}>Reactivate</button>
                )}
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW */
          <div className={styles.dashboardContainer}>
            <header className={styles.header}>
              <h1 className={styles.title}>Live Spend Tracker</h1>
              <p className={styles.subtitle}>Welcome back, here&apos;s your overview</p>
            </header>

            <div className={styles.tabs}>
              <button 
                className={view === 'active' ? `${styles.tab} ${styles.activeTab} ${styles.activeTabGreen}` : styles.tab} 
                onClick={() => setView('active')}
              >
                Active
              </button>
              <button 
                className={view === 'archive' ? `${styles.tab} ${styles.activeTab} ${styles.activeTabRed}` : styles.tab} 
                onClick={() => setView('archive')}
              >
                Archive
              </button>
            </div>

            <div className={styles.grid}>
              {filteredSessions.length === 0 ? (
                <div className="glass glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}><p style={{ color: 'var(--text-muted)' }}>No {view} sessions.</p></div>
              ) : (
                filteredSessions.map(session => {
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
        )}
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileBottomNav}>
        <button 
          className={viewingSessionId === null && view === 'active' ? `${styles.mobileNavItem} ${styles.mobileNavActive}` : styles.mobileNavItem}
          onClick={() => { setViewingSessionId(null); setView('active'); }}
        >
          <span className={styles.mobileIcon}>🏠</span>
          <span className={styles.mobileLabel}>Home</span>
        </button>
        <button 
          className={viewingSessionId === null && view === 'archive' ? `${styles.mobileNavItem} ${styles.mobileNavActive}` : styles.mobileNavItem}
          onClick={() => { setViewingSessionId(null); setView('archive'); }}
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

      {/* Modals: Session Create/Edit */}
      {(isAddingSession || isEditingSession) && (
        <div className={styles.modalOverlay}>
          <div className="glass glass-card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2>{isEditingSession ? 'Edit' : 'Create'} Session</h2>
            <form onSubmit={handleCreateOrUpdateSession}>
              <div className={styles.inputGroup}><label>Name</label><input required type="text" value={newName} onChange={e => setNewName(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Type</label><select value={newType} onChange={e => setNewType(e.target.value as 'budget' | 'tracking')}><option value="budget">Budget</option><option value="tracking">Tracking</option></select></div>
              {newType === 'budget' && (<div className={styles.inputGroup}><label>Budget</label><input required type="number" step="0.01" value={newBudget} onChange={e => setNewBudget(e.target.value)} /></div>)}
              <div className={styles.inputGroup}><label>Currency</label><select value={newCurrency} onChange={e => setNewCurrency(e.target.value as Currency)}><option value="£">GBP (£)</option><option value="€">EUR (€)</option><option value="$">USD ($)</option><option value="ARS">ARS ($) - Pesos</option></select></div>
              <div className={styles.modalActions}><button type="button" onClick={() => { setIsAddingSession(false); setIsEditingSession(false); }} className={styles.cancelBtn}>Cancel</button><button type="submit" className="btn-primary">{isEditingSession ? 'Update' : 'Create'}</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Modals: Expense Create/Edit */}
      {(isAddingExpense || editingExpenseId) && (
        <div className={styles.modalOverlay}>
          <div className="glass glass-card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2>{editingExpenseId ? 'Edit' : 'Add'} Expense</h2>
            <form onSubmit={handleCreateOrUpdateExpense}>
              <div className={styles.inputGroup}><label>Amount</label><input required autoFocus type="number" step="0.01" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Vendor / Supplier</label><input required type="text" placeholder="e.g. Ryanair, Starbucks" value={expenseVendor} onChange={e => setExpenseVendor(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Category</label><input required type="text" placeholder="e.g. Flight, Food" value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} /></div>
              <div className={styles.inputGroup}><label>Note</label><input required type="text" placeholder="e.g. Return flight" value={expenseNote} onChange={e => setExpenseNote(e.target.value)} /></div>
              <div className={styles.modalActions}><button type="button" onClick={() => { setIsAddingExpense(false); setEditingExpenseId(null); }} className={styles.cancelBtn}>Cancel</button><button type="submit" className="btn-primary">{editingExpenseId ? 'Update' : 'Add'}</button></div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
