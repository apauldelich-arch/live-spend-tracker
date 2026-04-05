'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../app/landing.module.css';

export function WelcomeView({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.landingBody}>
      {/* HERO SECTION */}
      <header className={styles.heroContent}>
        <div className={styles.badge}>Travel & Project Edition</div>
        <h1 className={styles.heroHeading}>
          Master Your Project's <span style={{ color: 'var(--primary)' }}>Burn Rate</span>.
        </h1>
        <p className={styles.heroSub}>
          The perfect companion for trips, renovations, and big-ticket life events. 
          Track specific budgets in real-time, 100% privately.
        </p>
        
        <div className={styles.heroActions}>
          <button onClick={onStart} className={styles.primaryBtn}>
            Start New Project
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
            <h4>Spreadsheet Fatigue</h4>
            <p>Manual entry on a phone is a nightmare. You end up waiting until you're home to log, or worse—forgetting entirely.</p>
          </div>
          <div className={styles.painCard}>
            <h4>The "Post-Trip" Shock</h4>
            <p>Realizing you've overspent 40% of your budget only after the holiday/renovation is finished is too late.</p>
          </div>
          <div className={styles.painCard}>
            <h4>Unknown Burn Rate</h4>
            <p>Banking apps show you *what* you spent, but not if you're on track for a specific project duration.</p>
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
          <h2>Engineered for High-Stakes Spent</h2>
          <p>Simple tools for complex life events.</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏔️</div>
            <h3>Trip Optimized</h3>
            <p>Perfect for gap years, honeymoons, or weekenders. Track daily burn rate so you never run out of "fun-money" early.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🛠️</div>
            <h3>Renovation Ready</h3>
            <p>Manage contractors, materials, and unexpected costs in one place, separate from your main bank account.</p>
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
