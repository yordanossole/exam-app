import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function QuestionNavigator({ questions, currentIndex, answers, statuses, onSelect }) {
  const currentButtonRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    currentButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentIndex]);

  return (
    <nav aria-label={t('question.navigation')} style={nav}>
      <div style={scrollRow}>
        {questions.map((question, questionIndex) => {
          const isCurrent = questionIndex === currentIndex;
          const status = statuses[question.question_id] || (answers[question.question_id] ? 'answered' : 'unanswered');
          const statusColor = {
            unanswered: 'var(--color-track)',
            answered: 'var(--color-primary-tint)',
            correct: 'var(--color-success)',
            wrong: 'var(--color-accent)',
          }[status];

          return (
            <button
              key={question.question_id}
              ref={isCurrent ? currentButtonRef : null}
              type="button"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={t('question.navigationLabel', { number: question.q_number, status: t(`question.${status}`) })}
              onClick={() => onSelect(questionIndex)}
              style={{
                ...questionButton,
                background: statusColor,
                borderColor: status === 'unanswered' ? 'var(--color-border)' : statusColor,
                boxShadow: isCurrent ? '0 0 0 2px var(--color-primary)' : 'none',
                color: status === 'correct' || status === 'wrong' ? '#fff' : 'var(--color-text-primary)',
              }}
            >
              {question.q_number}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

const nav = { minWidth: 0, width: '100%', overflow: 'hidden' };
const scrollRow = { display: 'flex', flexWrap: 'nowrap', width: '100%', maxWidth: '100%', gap: 7, overflowX: 'auto', padding: '2px 1px 8px', scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' };
const questionButton = { flex: '0 0 34px', width: 34, minWidth: 34, height: 34, minHeight: 34, aspectRatio: '1 / 1', padding: 0, borderRadius: '50%', border: '1px solid', font: 'var(--text-label)', fontSize: 12, fontWeight: 800, lineHeight: 1, cursor: 'pointer', transition: 'background 0.2s var(--ease-out), color 0.2s var(--ease-out)' };
