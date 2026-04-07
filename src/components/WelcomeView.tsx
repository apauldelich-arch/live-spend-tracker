'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../app/landing.module.css';

export function WelcomeView({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.landingBody}>
      {/* HERO SECTION */}
      <header className={styles.heroContent}>
        <div className={styles.badge}>Real-Time Budget Tracker</div>
        <h1 className={styles.heroHeading}>
          Control Your Spending in <span style={{ color: 'var(--primary)' }}>Real-Time</span>.
        </h1>
        <p className={styles.heroSub}>
          Stop the end-of-month blind spot. Track specific 'spending baskets' as they happen, 100% privately.
        </p>
        
        <div className={styles.heroActions}>
          <button onClick={onStart} className={styles.primaryBtn}>
            Start New Tracker
          </button>
        </div>

        <div className={styles.heroVisual}>
          <Image 
            src="/hero.png" 
            alt="Life Spend Tracker Premium Interface" 
            width={1200} 
            height={800} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </div>
      </header>

      {/* PAIN POINTS SECTION */}
      <section className={`${styles.section} ${styles.painsSection}`}>
        <div className={styles.sectionHeader}>
          <h2>Stop guessing your remaining budget</h2>
          <p>Spreadsheets are too slow. Banking apps are too generic.</p>
        </div>
        <div className={styles.painsGrid}>
          <div className={styles.painCard}>
            <h4>The Mid-Month Blind Spot</h4>
            <p>Realizing you've burned your 'fun money' budget by the 14th because you weren't tracking it live is a common trap.</p>
          </div>
          <div className={styles.painCard}>
            <h4>The "Manual" Friction</h4>
            <p>If logging an expense takes more than 3 seconds, you won't do it. Most apps fail the "standing-in-line" test.</p>
          </div>
          <div className={styles.painCard}>
            <h4>Disconnected Totals</h4>
            <p>Banking apps show you *what* you spent, but not how it affects your specific goals for the week or month.</p>
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER COMPARISON */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Chaos vs. Clarity</h2>
          <p>Transform how you manage specific pools of capital.</p>
        </div>
        <div className={styles.comparisonGrid}>
          <div className={`${styles.compCard} ${styles.chaos}`}>
            <div className={styles.compLabel}>BEFORE: TRACKING CHAOS</div>
            <ul className={styles.compList}>
              <li>❌ "I think I have enough left..."</li>
              <li>❌ Mixing project costs with daily life</li>
              <li>❌ Calculating daily limits manually</li>
              <li>❌ Zero visibility on category burn</li>
            </ul>
          </div>
          <div className={`${styles.compCard} ${styles.clarity}`}>
            <div className={styles.compLabel}>AFTER: BURN CLARITY</div>
            <ul className={styles.compList}>
              <li>✅ Exact daily allowance remaining</li>
              <li>✅ Isolated project-specific funds</li>
              <li>✅ Real-time % usage indicators</li>
              <li>✅ Instant category-level insights</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Engineered for Financial Pulse</h2>
          <p>Simple tools for disciplined spending.</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📈</div>
            <h3>Budget Pulse</h3>
            <p>Designed for high-frequency tracking (groceries, nights out, daily limits) where speed is everything.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3>Project Agnostic</h3>
            <p>Use it for anything from a £50 night out to a £5,000 personal project, separate from your main account.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3>100% Private</h3>
            <p>No accounts. No cloud. No tracking. Your financial data lives exclusively on this device.</p>
          </div>
        </div>
      </section>


      {/* QUALIFIERS SECTION */}
      <section className={`${styles.section} ${styles.painsSection}`}>
        <div className={styles.qualifierGrid}>
          <div className={styles.qualifierBox}>
            <h3>Is this for you?</h3>
            <ul className={styles.compList}>
              <li>✓ You are planning a trip with a fixed budget.</li>
              <li>✓ You are managing a home renovation/project.</li>
              <li>✓ You want a private, local-first finance tool.</li>
              <li>✓ You need to see your burn rate in real-time.</li>
            </ul>
          </div>
          <div className={styles.qualifierBox} style={{ opacity: 0.8 }}>
            <h3>This is NOT for you if:</h3>
            <ul className={styles.compList}>
              <li>✗ You want to link your bank account (Syncing).</li>
              <li>✗ You need a shared account with 10+ people.</li>
              <li>✗ You enjoy scrolling through messy bank statements.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className={styles.section} style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.5 }}>
        <p>© 2026 Live Spend Tracker &middot; Privacy First &middot; Project Edition</p>
      </footer>
    </div>
  );
}
