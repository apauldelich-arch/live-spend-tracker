'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../app/landing.module.css';

export function WelcomeView({ onStart }: { onStart: () => void }) {
  return (
    <div className={styles.landingBody} style={{ minHeight: 'auto', paddingBottom: '100px' }}>
      <header className={styles.heroContent} style={{ marginTop: '0' }}>
        <div className={styles.badge}>Travel & Project Edition</div>
        <h1 className={styles.heroHeading} style={{ fontSize: '2.5rem' }}>
          Master Your Project's <span style={{ color: 'var(--primary)' }}>Burn Rate</span>.
        </h1>
        <p className={styles.heroSub} style={{ fontSize: '1rem' }}>
          The perfect companion for trips, renovations, and big-ticket life events. 
          Track specific budgets in real-time, 100% privately.
        </p>
        
        <div className={styles.heroActions}>
          <button onClick={onStart} className={styles.primaryBtn} style={{ cursor: 'pointer', border: 'none' }}>
            New Project
          </button>
        </div>

        <div className={styles.heroVisual} style={{ marginTop: '2rem' }}>
          <Image 
            src="/hero.png" 
            alt="Life Spend Tracker Premium Interface" 
            width={1200} 
            height={800} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </header>

      <section className={styles.featuresGrid} style={{ margin: '3rem 0', gridTemplateColumns: '1fr' }}>
        <div className={styles.featureCard} style={{ padding: '1.5rem' }}>
          <div className={styles.featureIcon}>🏔️</div>
          <h3>Trip Optimized</h3>
          <p>Track your daily burn rate on holiday so you never run out of fun-money.</p>
        </div>

        <div className={styles.featureCard} style={{ padding: '1.5rem' }}>
          <div className={styles.featureIcon}>🛡️</div>
          <h3>100% Private</h3>
          <p>No accounts. No cloud. Your data lives exclusively on this device.</p>
        </div>
      </section>

      <footer style={{ padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
        © 2026 Live Spend Tracker.
      </footer>
    </div>
  );
}
