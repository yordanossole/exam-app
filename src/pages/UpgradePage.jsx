import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../components/BottomTabBar';
import Card from '../components/Card';
import Button from '../components/Button';
import { Badge } from '../components/StatChip';

const MOCK_PLANS = [
  { id: 'p1', name: 'Standard', price: 99,  duration_days: 30,  description: '30 days full access to all exams', badge: null },
  { id: 'p2', name: 'Premium',  price: 250, duration_days: 90,  description: '90 days access + priority support', badge: 'Popular' },
  { id: 'p3', name: 'Annual',   price: 800, duration_days: 365, description: 'Full year access — best value', badge: 'Best value' },
];

export default function UpgradePage() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSelectPlan(plan) {
    navigate('/payment', { state: { plan } });
  }

  return (
    <div style={screenWrap}>
      <header style={pageHeader}>
        <button onClick={() => navigate(-1)} style={backBtn} aria-label="Go back">←</button>
        <span style={pageTitle}>Upgrade Plan</span>
        <div style={{ width: 44 }} />
      </header>

      <main style={scrollContent}>
        <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 24 }}>
          Get full access to all past exams and detailed statistics.
        </p>

        {loading ? (
          <div className="loader">Loading plans…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--card-gap)' }}>
            {plans.map(plan => (
              <Card key={plan.id} hero={plan.badge === 'Popular'} style={{ position: 'relative' }}>
                {plan.badge && (
                  <div style={{ position: 'absolute', top: 14, right: 16 }}>
                    <Badge text={plan.badge} variant="green" />
                  </div>
                )}

                <p style={{ font: 'var(--text-card-title)', fontSize: 18, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                  {plan.name}
                </p>
                <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                  {plan.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 20 }}>
                  <span style={{ font: 'var(--text-body)', fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 4 }}>ETB</span>
                  <span style={{ font: 'var(--text-stat)', fontSize: 36, letterSpacing: 'var(--ls-number)', color: 'var(--color-text-primary)', lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  <span style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                    / {plan.duration_days} days
                  </span>
                </div>

                <Button full onClick={() => handleSelectPlan(plan)}>
                  Choose {plan.name}
                </Button>
              </Card>
            ))}
          </div>
        )}

        <div style={{ height: 80 }} />
      </main>

      <BottomTabBar />
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const pageHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  height: 56, padding: '0 var(--screen-pad)',
  background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
};
const pageTitle = { font: 'var(--text-card-title)', fontSize: 17, color: 'var(--color-text-primary)' };
const backBtn = {
  background: 'none', border: 'none', fontSize: 22,
  color: 'var(--color-accent)', cursor: 'pointer', minHeight: 44, minWidth: 44,
  display: 'flex', alignItems: 'center',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
