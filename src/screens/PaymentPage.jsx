'use client';

import { useRef, useState } from 'react';
import { useLocation, useNavigate } from '../lib/navigation';
import { paymentApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { useLanguage } from '../context/LanguageContext';
import { useTelegramMainButton } from '../context/TelegramContext';

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const plan = location.state?.plan;

  const [loading,   setLoading]   = useState(false);
  const [file,      setFile]      = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const usesTelegramMainButton = useTelegramMainButton({
    text: loading ? t('payment.submitting') : t('payment.submitProof'),
    onClick: () => formRef.current?.requestSubmit(),
    disabled: loading,
    loading,
    visible: Boolean(plan && !submitted),
  });

  if (!plan) {
    return (
      <div style={{ ...screenWrap, alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ font: 'var(--text-body)', color: 'var(--color-error)', padding: 24 }}>
          {t('payment.noPlan')}
        </p>
        <Button onClick={() => navigate('/upgrade')}>{t('common.viewPlans')}</Button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert(t('payment.proofRequired'));
    setLoading(true);
    try {
      const res = await paymentApi.submitPayment({ plan_id: plan.id, amount_etb: plan.price });
      const paymentId = res.data.id ?? res.data.data?.id;
      await paymentApi.uploadProof(paymentId, file);
      setSubmitted(true);
    } catch (err) {
      console.error('Payment failed', err);
      alert(t('payment.error'));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ ...screenWrap, alignItems: 'center', justifyContent: 'center', padding: '40px var(--screen-pad)' }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--color-accent-tint)', border: '2px solid var(--color-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, marginBottom: 24,
        }}>
          ✓
        </div>
        <h1 style={{ font: 'var(--text-screen-title)', color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: 12 }}>
          {t('payment.submitted')}
        </h1>
        <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: 300, marginBottom: 32 }}>
          {t('payment.submittedBody')}
        </p>
        <Button full onClick={() => navigate('/')}>{t('payment.backHome')}</Button>
      </div>
    );
  }

  return (
    <div style={screenWrap}>
      <main style={scrollContent}>

        {/* Selected plan summary */}
        <Card style={{ marginBottom: 16 }}>
          <p style={labelStyle}>{t('payment.selectedPlan')}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ font: 'var(--text-card-title)', fontSize: 18, color: 'var(--color-text-primary)' }}>
              {plan.name}
            </span>
            <span style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginLeft: 4 }}>
              · {t('payment.days', { days: plan.duration_days })}
            </span>
          </div>
          <div style={{ font: 'var(--text-stat)', fontSize: 28, letterSpacing: 'var(--ls-number)', color: 'var(--color-accent)', marginTop: 6 }}>
            ETB {plan.price}
          </div>
        </Card>

        {/* Bank details */}
        <Card style={{ marginBottom: 16 }}>
          <p style={labelStyle}>{t('payment.bankDetails')}</p>
          <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            {t('payment.transferTo', { amount: plan.price })}
          </p>
          <div style={{
            background: 'var(--color-bg)', borderRadius: 10,
            padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {[
              [t('payment.bank'), 'CBE (Commercial Bank of Ethiopia)'],
              [t('payment.accountName'), 'Exam Platform LLC'],
              [t('payment.accountNumber'), '1000123456789'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ font: 'var(--text-body)', fontSize: 13, color: 'var(--color-text-secondary)' }}>{k}</span>
                <span style={{ font: 'var(--text-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upload form */}
        <Card style={{ marginBottom: 24 }}>
          <form ref={formRef} onSubmit={handleSubmit}>
            <p style={labelStyle}>{t('payment.uploadTitle')}</p>
            <p style={{ font: 'var(--text-body)', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
              {t('payment.uploadDescription')}
            </p>

            {/* File picker */}
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '18px 16px', marginBottom: 20,
              border: `2px dashed ${file ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: file ? 'var(--color-accent-tint)' : 'var(--color-bg)',
              borderRadius: 10, cursor: 'pointer',
              font: 'var(--text-body)', fontSize: 14, fontWeight: 500,
              color: file ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              position: 'relative', minHeight: 64,
              transition: 'border-color var(--duration-tap) ease, background var(--duration-tap) ease',
            }}>
              <input
                type="file"
                id="proof"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                required
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
              {file ? `✓ ${file.name}` : t('payment.chooseFile')}
            </label>

            <Button full size="lg" type="submit" disabled={loading} style={usesTelegramMainButton ? { display: 'none' } : undefined}>
              {loading ? t('payment.submitting') : t('payment.submitProof')}
            </Button>
          </form>
        </Card>

        <div style={{ height: 80 }} />
      </main>
    </div>
  );
}

const screenWrap = {
  display: 'flex', flexDirection: 'column',
  minHeight: 'var(--app-viewport-height)', maxWidth: 480, margin: '0 auto',
  background: 'var(--color-bg)',
};
const scrollContent = {
  flex: 1, overflowY: 'auto', padding: 'var(--space-4) var(--screen-pad)',
  WebkitOverflowScrolling: 'touch',
};
const labelStyle = {
  font: 'var(--text-body)', fontSize: 12, fontWeight: 700,
  letterSpacing: 'var(--ls-label)', textTransform: 'uppercase',
  color: 'var(--color-text-secondary)', marginBottom: 10,
};
