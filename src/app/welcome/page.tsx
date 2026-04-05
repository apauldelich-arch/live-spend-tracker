'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../landing.module.css';

export default function Welcome() {
  return (
    <div className={styles.landingBody}>
      <header className={styles.heroContent}>
        <div className={styles.badge}>Beta Access</div>
        <h1 className={styles.heroHeading}>
          Master Your Project's <span style={{ color: 'var(--primary)' }}>Burn Rate</span>.
        </h1>
        <p className={styles.heroSub}>
          The perfect companion for trips, renovations, and big-ticket life events. 
          Track specific budgets in real-time, 100% privately on your device.
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
          <div className={styles.featureIcon}>🏔️</div>
          <h3>Trip Optimized</h3>
          <p>Whether it’s a weekend in Rome or a month in Bali, track your daily burn rate so you never run out of fun-money.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🛠️</div>
          <h3>Project Ready</h3>
          <p>Home renovations, car builds, or side projects. Segregate your spending from your daily life accounts.</p>
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
