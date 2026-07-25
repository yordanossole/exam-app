'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from '../lib/navigation';
import Card from '../components/Card';
import Button from '../components/Button';
import { Badge } from '../components/StatChip';
import { paymentApi } from '../services/api';
import BackButton from '../components/BackButton';

export default function UpgradePage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    paymentApi.getPlans()
      .then(response => {
        const data = response.data?.plans ?? response.data?.data ?? response.data;
        if (active) setPlans(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  function handleSelectPlan(plan) {
    navigate('/payment', { state: { plan } });
  }

  return (
    <div style={screenWrap}>
      <BackButton fallback="/profile" label="Back to Profile" />
      <main style={scrollContent}>
        <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 24 }}>
          Get full access to all past exams and detailed statistics.
        </p>

        {loading ? (
          <div className="loader">Loading plans…</div>
        ) : error ? (
          <p style={{ font: 'var(--text-body)', color: 'var(--color-error)', textAlign: 'center' }}>
            Plans are temporarily unavailable. Please try again later.
          </p>
        ) : plans.length === 0 ? (
          <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            No plans are available right now.
          </p>
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

    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: '100dvh', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
