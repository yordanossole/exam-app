'use client';

import { useMemo, useState } from 'react';
import styles from './AdminDashboard.module.css';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '⌂' },
  { id: 'users', label: 'Users', icon: '♙' },
  { id: 'plans', label: 'Plans', icon: '◇' },
  { id: 'exams', label: 'Exams', icon: '▤' },
  { id: 'reports', label: 'Reports', icon: '!' },
];

const VIEW_COPY = {
  overview: ['Dashboard overview', 'Monitor learners, subscriptions, and exam quality.'],
  users: ['User management', 'Manage access, roles, grades, and subscriptions.'],
  plans: ['Subscription plans', 'Create and publish the plans shown in the learner app.'],
  exams: ['Exam library', 'Review exam metadata and control publishing status.'],
  reports: ['Question reports', 'Review issues submitted by learners.'],
};

export default function AdminDashboard({ initialData }) {
  const [data, setData] = useState(initialData);
  const [view, setView] = useState('overview');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [editor, setEditor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const filteredUsers = useMemo(() => data.users.filter(user => {
    const matchesQuery = `${user.display_name} ${user.email} ${user.plan_name ?? ''}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (statusFilter === 'all' || user.status === statusFilter);
  }), [data.users, query, statusFilter]);

  const filteredExams = useMemo(() => data.exams.filter(exam => {
    const matchesQuery = `${exam.subject_display} ${exam.exam_id} ${exam.year_ec}`.toLowerCase().includes(query.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || exam.grade === Number(gradeFilter);
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'published' ? Boolean(exam.verified) : !exam.verified);
    return matchesQuery && matchesGrade && matchesStatus;
  }), [data.exams, gradeFilter, query, statusFilter]);

  const filteredReports = useMemo(() => data.reports.filter(report => (
    `${report.subject_display} ${report.exam_id} ${report.question_id} ${report.message}`.toLowerCase().includes(query.toLowerCase())
  )), [data.reports, query]);

  function changeView(nextView) {
    setView(nextView);
    setQuery('');
    setStatusFilter('all');
    setGradeFilter('all');
    setNotice(null);
  }

  async function refreshData() {
    const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Could not refresh dashboard.');
    setData(body.data);
  }

  async function mutate(path, options, successMessage) {
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(path, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The change could not be saved.');
      await refreshData();
      setEditor(null);
      setNotice({ type: 'success', message: successMessage });
    } catch (error) {
      setNotice({ type: 'error', message: error instanceof Error ? error.message : 'The change could not be saved.' });
    } finally {
      setBusy(false);
    }
  }

  async function handleEditorSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));

    if (editor.type === 'user') {
      const payload = {
        display_name: values.display_name,
        email: values.email,
        role: values.role,
        status: values.status,
        grade: values.grade ? Number(values.grade) : null,
        plan_id: values.plan_id || null,
      };
      const editing = Boolean(editor.item);
      await mutate(
        editing ? `/api/admin/users/${editor.item.user_id}` : '/api/admin/users',
        { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) },
        editing ? 'User updated.' : 'User created.',
      );
      return;
    }

    if (editor.type === 'plan') {
      const payload = {
        name: values.name,
        description: values.description,
        grade: Number(values.grade),
        price_etb: Number(values.price_etb),
        duration_days: Number(values.duration_days),
        badge: values.badge || null,
        is_active: values.is_active === '1' ? 1 : 0,
        sort_order: Number(values.sort_order || 0),
      };
      const editing = Boolean(editor.item);
      await mutate(
        editing ? `/api/admin/plans/${editor.item.plan_id}` : '/api/admin/plans',
        { method: editing ? 'PATCH' : 'POST', body: JSON.stringify(payload) },
        editing ? 'Plan updated.' : 'Plan created and added to the upgrade page.',
      );
      return;
    }

    const payload = {
      subject_display: values.subject_display,
      grade: Number(values.grade),
      year_ec: Number(values.year_ec),
      verified: values.verified === '1' ? 1 : 0,
    };
    await mutate(
      `/api/admin/exams/${editor.item.exam_id}`,
      { method: 'PATCH', body: JSON.stringify(payload) },
      'Exam metadata updated.',
    );
  }

  const [title, description] = VIEW_COPY[view];
  const showSearch = ['users', 'exams', 'reports'].includes(view);

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/admin" aria-label="NT Exams admin dashboard">
          <img src="/@Logos/logo-blue.png" alt="NT Exams" />
          <span>Admin</span>
        </a>

        <nav className={styles.navigation} aria-label="Admin navigation">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${view === item.id ? styles.navItemActive : ''}`}
              onClick={() => changeView(item.id)}
            >
              <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'reports' && data.stats.open_reports > 0 && <span className={styles.navCount}>{data.stats.open_reports}</span>}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminIdentity}>
            <span className={styles.avatar}>AD</span>
            <span><strong>Administrator</strong><small>Content & billing</small></span>
          </div>
          <a href="/" className={styles.studentLink}>Open learner app <span>↗</span></a>
        </div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.eyebrow}>NT Exams administration</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className={styles.topActions}>
            {showSearch && (
              <label className={styles.searchBox}>
                <span aria-hidden="true">⌕</span>
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${view}…`} />
              </label>
            )}
            {view === 'users' && <button className={styles.primaryButton} type="button" onClick={() => setEditor({ type: 'user', item: null })}>+ Add user</button>}
            {view === 'plans' && <button className={styles.primaryButton} type="button" onClick={() => setEditor({ type: 'plan', item: null })}>+ New plan</button>}
          </div>
        </header>

        <main className={styles.main}>
          {data.database?.read_only && (
            <div className={`${styles.notice} ${styles.noticeWarning}`}>
              This deployment is using the bundled database in read-only mode. Connect a persistent database before changing users, plans, or exams.
            </div>
          )}
          {notice && <div className={`${styles.notice} ${notice.type === 'error' ? styles.noticeError : ''}`}>{notice.message}</div>}

          {view === 'overview' && <Overview data={data} onNavigate={changeView} />}
          {view === 'users' && (
            <UsersView
              users={filteredUsers}
              status={statusFilter}
              setStatus={setStatusFilter}
              onEdit={item => setEditor({ type: 'user', item })}
              onToggle={user => mutate(`/api/admin/users/${user.user_id}`, { method: 'PATCH', body: JSON.stringify({ status: user.status === 'active' ? 'suspended' : 'active' }) }, `User ${user.status === 'active' ? 'suspended' : 'activated'}.`)}
            />
          )}
          {view === 'plans' && (
            <PlansView
              plans={data.plans}
              onEdit={item => setEditor({ type: 'plan', item })}
              onToggle={plan => mutate(`/api/admin/plans/${plan.plan_id}`, { method: 'PATCH', body: JSON.stringify({ is_active: plan.is_active ? 0 : 1 }) }, `Plan ${plan.is_active ? 'hidden from' : 'published to'} the learner app.`)}
            />
          )}
          {view === 'exams' && (
            <ExamsView
              exams={filteredExams}
              grade={gradeFilter}
              setGrade={setGradeFilter}
              status={statusFilter}
              setStatus={setStatusFilter}
              onEdit={item => setEditor({ type: 'exam', item })}
              onToggle={exam => mutate(`/api/admin/exams/${exam.exam_id}`, { method: 'PATCH', body: JSON.stringify({ verified: exam.verified ? 0 : 1 }) }, `Exam ${exam.verified ? 'moved to draft' : 'published'}.`)}
            />
          )}
          {view === 'reports' && <ReportsView reports={filteredReports} />}
        </main>
      </section>

      {editor && (
        <EditorModal
          editor={editor}
          plans={data.plans}
          busy={busy}
          onClose={() => !busy && setEditor(null)}
          onSubmit={handleEditorSubmit}
        />
      )}
    </div>
  );
}

function Overview({ data, onNavigate }) {
  const publishRate = data.stats.exams ? Math.round((data.stats.published_exams / data.stats.exams) * 100) : 0;
  const cards = [
    ['Total users', data.stats.users, `${data.stats.active_subscriptions} subscribed`, 'users', '♙'],
    ['Active plans', data.plans.filter(plan => plan.is_active).length, `${data.plans.length} total plans`, 'plans', '◇'],
    ['Exam papers', data.stats.exams, `${publishRate}% published`, 'exams', '▤'],
    ['Needs attention', data.stats.flagged_questions + data.stats.open_reports, `${data.stats.open_reports} learner reports`, 'reports', '!'],
  ];

  return (
    <>
      <section className={styles.statGrid}>
        {cards.map(([label, value, detail, target, icon]) => (
          <button key={label} type="button" className={styles.statCard} onClick={() => onNavigate(target)}>
            <span className={styles.statIcon}>{icon}</span>
            <span className={styles.statLabel}>{label}</span>
            <strong>{value}</strong>
            <small>{detail}</small>
          </button>
        ))}
      </section>

      <section className={styles.overviewGrid}>
        <div className={styles.panel}>
          <PanelHeading title="Recent learner reports" action="View all" onAction={() => onNavigate('reports')} />
          {data.reports.length ? (
            <div className={styles.activityList}>
              {data.reports.slice(0, 5).map(report => (
                <div className={styles.activityItem} key={report.report_id}>
                  <span className={styles.activityIcon}>!</span>
                  <div><strong>{report.subject_display} · Q{report.q_number}</strong><p>{report.message}</p></div>
                  <time>{formatDate(report.created_at)}</time>
                </div>
              ))}
            </div>
          ) : <EmptyState title="No reports yet" body="Learner-submitted question issues will appear here." />}
        </div>

        <div className={styles.panel}>
          <PanelHeading title="Library health" action="Manage exams" onAction={() => onNavigate('exams')} />
          <div className={styles.healthScore}>
            <div className={styles.healthRing} style={{ '--progress': `${publishRate * 3.6}deg` }}><strong>{publishRate}%</strong><span>published</span></div>
            <div className={styles.healthDetails}>
              <MetricRow label="Published papers" value={data.stats.published_exams} tone="green" />
              <MetricRow label="Draft papers" value={data.stats.exams - data.stats.published_exams} tone="amber" />
              <MetricRow label="Flagged questions" value={data.stats.flagged_questions} tone="red" />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.panel}>
        <PanelHeading title="Plan performance" action="Manage plans" onAction={() => onNavigate('plans')} />
        <div className={styles.planSummaryGrid}>
          {data.plans.map(plan => (
            <div className={styles.planSummary} key={plan.plan_id}>
              <span className={styles.gradeMark}>G{plan.grade}</span>
              <div><strong>{plan.name}</strong><p>{plan.subscriber_count} active subscribers</p></div>
              <strong className={styles.price}>ETB {formatNumber(plan.price_etb)}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function UsersView({ users, status, setStatus, onEdit, onToggle }) {
  return (
    <section className={styles.panel}>
      <div className={styles.filterRow}>
        <div className={styles.segmented}>
          {['all', 'active', 'suspended'].map(item => <button key={item} className={status === item ? styles.segmentActive : ''} onClick={() => setStatus(item)}>{capitalize(item)}</button>)}
        </div>
        <span className={styles.resultCount}>{users.length} users</span>
      </div>
      {users.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>User</th><th>Role</th><th>Grade</th><th>Plan</th><th>Status</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{users.map(user => (
              <tr key={user.user_id}>
                <td data-label="User"><div className={styles.userCell}><span className={styles.tableAvatar}>{initials(user.display_name)}</span><span><strong>{user.display_name}</strong><small>{user.email}</small></span></div></td>
                <td data-label="Role"><span className={styles.roleText}>{capitalize(user.role)}</span></td>
                <td data-label="Grade">{user.grade ? `Grade ${user.grade}` : '—'}</td>
                <td data-label="Plan">{user.plan_name ?? 'Free access'}</td>
                <td data-label="Status"><StatusPill active={user.status === 'active'} activeText="Active" inactiveText="Suspended" /></td>
                <td data-label="Joined">{formatDate(user.created_at)}</td>
                <td className={styles.rowActions}>
                  <button title="Edit user" onClick={() => onEdit(user)}>Edit</button>
                  <button title={user.status === 'active' ? 'Suspend user' : 'Activate user'} onClick={() => onToggle(user)}>{user.status === 'active' ? 'Suspend' : 'Activate'}</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <EmptyState title="No users found" body="Try changing the search or status filter." />}
    </section>
  );
}

function PlansView({ plans, onEdit, onToggle }) {
  return (
    <section className={styles.planGrid}>
      {plans.map(plan => (
        <article key={plan.plan_id} className={`${styles.planCard} ${!plan.is_active ? styles.cardInactive : ''}`}>
          <div className={styles.planCardTop}>
            <span className={styles.gradeMark}>Grade {plan.grade}</span>
            <StatusPill active={Boolean(plan.is_active)} activeText="Published" inactiveText="Hidden" />
          </div>
          <div><h2>{plan.name}</h2><p>{plan.description}</p></div>
          <div className={styles.planPrice}><strong>ETB {formatNumber(plan.price_etb)}</strong><span>/ {plan.duration_days} days</span></div>
          <dl className={styles.planMeta}>
            <div><dt>Subscribers</dt><dd>{plan.subscriber_count}</dd></div>
            <div><dt>Badge</dt><dd>{plan.badge || 'None'}</dd></div>
            <div><dt>Display order</dt><dd>{plan.sort_order}</dd></div>
          </dl>
          <div className={styles.cardActions}>
            <button className={styles.secondaryButton} onClick={() => onEdit(plan)}>Edit details</button>
            <button className={styles.textButton} onClick={() => onToggle(plan)}>{plan.is_active ? 'Hide plan' : 'Publish plan'}</button>
          </div>
        </article>
      ))}
    </section>
  );
}

function ExamsView({ exams, grade, setGrade, status, setStatus, onEdit, onToggle }) {
  const grades = Array.from(new Set(exams.map(exam => exam.grade))).sort((a, b) => a - b);
  return (
    <section className={styles.panel}>
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <select value={grade} onChange={event => setGrade(event.target.value)} aria-label="Filter by grade"><option value="all">All grades</option>{grades.map(item => <option value={item} key={item}>Grade {item}</option>)}</select>
          <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter by publishing status"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select>
        </div>
        <span className={styles.resultCount}>{exams.length} exams</span>
      </div>
      {exams.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Exam</th><th>Grade</th><th>Year</th><th>Questions</th><th>Quality</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{exams.map(exam => (
              <tr key={exam.exam_id}>
                <td data-label="Exam"><div className={styles.examCell}><span className={styles.examIcon}>▤</span><span><strong>{exam.subject_display}</strong><small>{exam.exam_id}</small></span></div></td>
                <td data-label="Grade">Grade {exam.grade}</td>
                <td data-label="Year">{exam.year_ec} E.C.</td>
                <td data-label="Questions">{exam.actual_questions}<small className={styles.mutedInline}> / {exam.total_questions} listed</small></td>
                <td data-label="Quality"><span className={exam.needs_review || exam.report_count ? styles.qualityWarning : styles.qualityGood}>{exam.needs_review || exam.report_count ? `${exam.needs_review} flagged · ${exam.report_count} reports` : 'Ready'}</span></td>
                <td data-label="Status"><StatusPill active={Boolean(exam.verified)} activeText="Published" inactiveText="Draft" /></td>
                <td className={styles.rowActions}>
                  <button onClick={() => onEdit(exam)}>Edit</button>
                  <button onClick={() => onToggle(exam)}>{exam.verified ? 'Unpublish' : 'Publish'}</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : <EmptyState title="No exams found" body="Try changing the search or filters." />}
    </section>
  );
}

function ReportsView({ reports }) {
  return (
    <section className={styles.panel}>
      <div className={styles.filterRow}><p className={styles.panelIntro}>Reports are ordered newest first and linked to their source question.</p><span className={styles.resultCount}>{reports.length} reports</span></div>
      {reports.length ? <div className={styles.reportGrid}>{reports.map(report => (
        <article className={styles.reportCard} key={report.report_id}>
          <div className={styles.reportTop}><span className={styles.reportBadge}>Learner report</span><time>{formatDate(report.created_at)}</time></div>
          <h2>{report.subject_display} · Grade {report.grade} · Question {report.q_number}</h2>
          <p>{report.message}</p>
          <div className={styles.reportMeta}><code>{report.question_id}</code><a href={`/practice/exam/${report.exam_id}/exam`} target="_blank" rel="noreferrer">Open exam ↗</a></div>
        </article>
      ))}</div> : <EmptyState title="No reports found" body="There are no learner reports matching this search." />}
    </section>
  );
}

function EditorModal({ editor, plans, busy, onClose, onSubmit }) {
  const item = editor.item;
  const titles = { user: item ? 'Edit user' : 'Add user', plan: item ? 'Edit plan' : 'Create plan', exam: 'Edit exam' };
  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <div className={styles.modalHeader}><div><p className={styles.eyebrow}>Admin editor</p><h2 id="editor-title">{titles[editor.type]}</h2></div><button type="button" onClick={onClose} aria-label="Close editor">×</button></div>
        <form onSubmit={onSubmit} className={styles.form}>
          {editor.type === 'user' && <UserFields item={item} plans={plans} />}
          {editor.type === 'plan' && <PlanFields item={item} />}
          {editor.type === 'exam' && <ExamFields item={item} />}
          <div className={styles.modalActions}><button type="button" className={styles.secondaryButton} onClick={onClose} disabled={busy}>Cancel</button><button type="submit" className={styles.primaryButton} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
        </form>
      </section>
    </div>
  );
}

function UserFields({ item, plans }) {
  return <>
    <Field label="Full name"><input name="display_name" defaultValue={item?.display_name ?? ''} required minLength={2} autoFocus /></Field>
    <Field label="Email address"><input name="email" type="email" defaultValue={item?.email ?? ''} required /></Field>
    <div className={styles.formGrid}>
      <Field label="Role"><select name="role" defaultValue={item?.role ?? 'student'}><option value="student">Student</option><option value="reviewer">Reviewer</option><option value="admin">Administrator</option></select></Field>
      <Field label="Status"><select name="status" defaultValue={item?.status ?? 'active'}><option value="active">Active</option><option value="suspended">Suspended</option></select></Field>
      <Field label="Grade"><input name="grade" type="number" min="1" defaultValue={item?.grade ?? ''} placeholder="Optional" /></Field>
      <Field label="Subscription plan"><select name="plan_id" defaultValue={item?.plan_id ?? ''}><option value="">Free access</option>{plans.map(plan => <option value={plan.plan_id} key={plan.plan_id}>{plan.name}</option>)}</select></Field>
    </div>
  </>;
}

function PlanFields({ item }) {
  return <>
    <Field label="Plan name"><input name="name" defaultValue={item?.name ?? ''} required minLength={2} autoFocus /></Field>
    <Field label="Description"><textarea name="description" defaultValue={item?.description ?? ''} rows="3" maxLength={240} /></Field>
    <div className={styles.formGrid}>
      <Field label="Grade"><input name="grade" type="number" min="1" defaultValue={item?.grade ?? 6} required /></Field>
      <Field label="Price (ETB)"><input name="price_etb" type="number" min="0" step="0.01" defaultValue={item?.price_etb ?? ''} required /></Field>
      <Field label="Duration (days)"><input name="duration_days" type="number" min="1" defaultValue={item?.duration_days ?? 30} required /></Field>
      <Field label="Badge"><input name="badge" defaultValue={item?.badge ?? ''} placeholder="e.g. Popular" /></Field>
      <Field label="Visibility"><select name="is_active" defaultValue={String(item?.is_active ?? 1)}><option value="1">Published</option><option value="0">Hidden</option></select></Field>
      <Field label="Display order"><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order ?? 0} /></Field>
    </div>
  </>;
}

function ExamFields({ item }) {
  return <>
    <Field label="Subject name"><input name="subject_display" defaultValue={item.subject_display} required minLength={2} autoFocus /></Field>
    <div className={styles.formGrid}>
      <Field label="Grade"><input name="grade" type="number" min="1" defaultValue={item.grade} required /></Field>
      <Field label="Year (E.C.)"><input name="year_ec" type="number" min="1" defaultValue={item.year_ec} required /></Field>
      <Field label="Publishing status"><select name="verified" defaultValue={String(item.verified)}><option value="1">Published</option><option value="0">Draft</option></select></Field>
    </div>
    <p className={styles.formHint}>Question and section totals are managed by the exam import process. This editor updates catalog metadata and visibility.</p>
  </>;
}

function Field({ label, children }) { return <label className={styles.field}><span>{label}</span>{children}</label>; }
function PanelHeading({ title, action, onAction }) { return <div className={styles.panelHeading}><h2>{title}</h2><button type="button" onClick={onAction}>{action} →</button></div>; }
function MetricRow({ label, value, tone }) { return <div className={styles.metricRow}><span><i className={styles[tone]} />{label}</span><strong>{value}</strong></div>; }
function StatusPill({ active, activeText, inactiveText }) { return <span className={`${styles.statusPill} ${active ? styles.statusActive : styles.statusInactive}`}><i />{active ? activeText : inactiveText}</span>; }
function EmptyState({ title, body }) { return <div className={styles.emptyState}><span>◇</span><h2>{title}</h2><p>{body}</p></div>; }
function capitalize(value) { return value.charAt(0).toUpperCase() + value.slice(1); }
function initials(value) { return value.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(); }
function formatDate(value) { return value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value.replace(' ', 'T')}Z`)) : '—'; }
function formatNumber(value) { return new Intl.NumberFormat('en-ET', { maximumFractionDigits: 2 }).format(value); }
