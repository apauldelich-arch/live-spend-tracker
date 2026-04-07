'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../landing.module.css';

export default function Welcome() {
  return (
    <div className={styles.landingBody}>
      <header className={styles.heroContent}>
        <div className={styles.badge}>Real-Time Budget Tracker</div>
        <h1 className={styles.heroHeading}>
          Control Your Spending in <span style={{ color: 'var(--primary)' }}>Real-Time</span>.
        </h1>
        <p className={styles.heroSub}>
          Stop the end-of-month blind spot. Track specific 'spending baskets' as they happen, 100% privately on your device.
        </p>
        
        <div className={styles.heroActions}>
          <Link href="/" className={styles.primaryBtn}>
            Launch App
          </Link>
        </div>

        <div className={styles.heroVisual}>
          <Image 
            src="/hero.png" 
            alt="Life Spend Tracker Premium Interface" 
            width={1200} 
            height={800} 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </header>

      <section className={styles.featuresGrid}>
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
          <p>No accounts. No credit cards to link. No cloud databases. Your data lives exclusively on your device's local storage.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🏷️</div>
          <h3>Smart Normalization</h3>
          <p>Typos won't break your analytics. Our engine automatically trims and standardizes your categories and vendors.</p>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', padding: '4rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        © 2026 Live Spend Tracker. Designed for high-performance budgeting.
      </footer>
    </div>
  );
}
