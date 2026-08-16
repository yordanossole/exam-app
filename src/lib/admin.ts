import { randomUUID } from 'node:crypto';
import { getDb, isDatabaseReadOnly } from './db';

export type AdminPlan = {
  plan_id: string;
  name: string;
  description: string;
  grade: number;
  price_etb: number;
  duration_days: number;
  badge: string | null;
  is_active: number;
  sort_order: number;
  subscriber_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  user_id: string;
  display_name: string;
  email: string;
  role: string;
  status: string;
  grade: number | null;
  plan_id: string | null;
  plan_name: string | null;
  created_at: string;
  last_active_at: string | null;
};

export type AdminExam = {
  exam_id: string;
  grade: number;
  year_ec: number;
  subject: string;
  subject_display: string;
  total_questions: number;
  actual_questions: number;
  total_sections: number;
  verified: number;
  needs_review: number;
  report_count: number;
  entry_date: string | null;
};

export type AdminReport = {
  report_id: number;
  exam_id: string;
  question_id: string;
  q_number: number;
  subject_display: string;
  grade: number;
  message: string;
  created_at: string;
};

export function listAdminPlans(includeInactive = true) {
  return getDb().prepare(`
    SELECT p.*, COUNT(u.user_id) AS subscriber_count
    FROM plans p
    LEFT JOIN users u ON u.plan_id = p.plan_id AND u.status = 'active'
    ${includeInactive ? '' : 'WHERE p.is_active = 1'}
    GROUP BY p.plan_id
    ORDER BY p.sort_order, p.price_etb, p.name
  `).all() as AdminPlan[];
}

export function listAdminUsers() {
  return getDb().prepare(`
    SELECT u.*, p.name AS plan_name
    FROM users u
    LEFT JOIN plans p ON p.plan_id = u.plan_id
    ORDER BY CASE u.status WHEN 'active' THEN 0 ELSE 1 END, u.created_at DESC
  `).all() as AdminUser[];
}

export function listAdminExams() {
  return getDb().prepare(`
    SELECT
      e.exam_id,
      e.grade,
      e.year_ec,
      e.subject,
      e.subject_display,
      e.total_questions,
      (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.exam_id) AS actual_questions,
      e.total_sections,
      e.verified,
      (SELECT COUNT(*) FROM questions q WHERE q.exam_id = e.exam_id AND (q.needs_review = 1 OR json_extract(q.content, '$.answer.correct_answer') IS NULL)) AS needs_review,
      (SELECT COUNT(*) FROM question_reports qr WHERE qr.exam_id = e.exam_id) AS report_count,
      e.entry_date
    FROM exams e
    ORDER BY e.grade, e.subject_display, e.year_ec DESC
  `).all() as AdminExam[];
}

export function listAdminReports(limit = 100) {
  return getDb().prepare(`
    SELECT qr.report_id, qr.exam_id, qr.question_id, q.q_number,
           e.subject_display, e.grade, qr.message, qr.created_at
    FROM question_reports qr
    JOIN questions q ON q.question_id = qr.question_id
    JOIN exams e ON e.exam_id = qr.exam_id
    ORDER BY qr.created_at DESC
    LIMIT ?
  `).all(limit) as AdminReport[];
}

export function getAdminDashboardData() {
  const db = getDb();
  const users = listAdminUsers();
  const plans = listAdminPlans();
  const exams = listAdminExams();
  const reports = listAdminReports();
  const flagged = db.prepare(`
    SELECT COUNT(*) AS count
    FROM questions
    WHERE needs_review = 1 OR json_extract(content, '$.answer.correct_answer') IS NULL
  `).get() as { count: number };

  return {
    database: {
      read_only: isDatabaseReadOnly(),
    },
    stats: {
      users: users.length,
      active_subscriptions: users.filter(user => user.status === 'active' && user.plan_id).length,
      exams: exams.length,
      published_exams: exams.filter(exam => Boolean(exam.verified)).length,
      open_reports: reports.length,
      flagged_questions: flagged.count,
    },
    users,
    plans,
    exams,
    reports,
  };
}

export function createAdminUser(input: Omit<AdminUser, 'user_id' | 'plan_name' | 'created_at' | 'last_active_at'>) {
  const userId = randomUUID();
  getDb().prepare(`
    INSERT INTO users (user_id, display_name, email, role, status, grade, plan_id, last_active_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(userId, input.display_name, input.email, input.role, input.status, input.grade, input.plan_id);
  return userId;
}

export function updateAdminUser(userId: string, input: Partial<Pick<AdminUser, 'display_name' | 'email' | 'role' | 'status' | 'grade' | 'plan_id'>>) {
  const current = getDb().prepare('SELECT * FROM users WHERE user_id = ?').get(userId) as AdminUser | undefined;
  if (!current) return false;

  getDb().prepare(`
    UPDATE users
    SET display_name = ?, email = ?, role = ?, status = ?, grade = ?, plan_id = ?
    WHERE user_id = ?
  `).run(
    input.display_name ?? current.display_name,
    input.email ?? current.email,
    input.role ?? current.role,
    input.status ?? current.status,
    input.grade === undefined ? current.grade : input.grade,
    input.plan_id === undefined ? current.plan_id : input.plan_id,
    userId,
  );
  return true;
}

export function createAdminPlan(input: Omit<AdminPlan, 'plan_id' | 'subscriber_count' | 'created_at' | 'updated_at'>) {
  const planId = randomUUID();
  getDb().prepare(`
    INSERT INTO plans (plan_id, name, description, grade, price_etb, duration_days, badge, is_active, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(planId, input.name, input.description, input.grade, input.price_etb, input.duration_days, input.badge, input.is_active, input.sort_order);
  return planId;
}

export function updateAdminPlan(planId: string, input: Partial<Pick<AdminPlan, 'name' | 'description' | 'grade' | 'price_etb' | 'duration_days' | 'badge' | 'is_active' | 'sort_order'>>) {
  const current = getDb().prepare('SELECT * FROM plans WHERE plan_id = ?').get(planId) as AdminPlan | undefined;
  if (!current) return false;

  getDb().prepare(`
    UPDATE plans
    SET name = ?, description = ?, grade = ?, price_etb = ?, duration_days = ?, badge = ?,
        is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE plan_id = ?
  `).run(
    input.name ?? current.name,
    input.description ?? current.description,
    input.grade ?? current.grade,
    input.price_etb ?? current.price_etb,
    input.duration_days ?? current.duration_days,
    input.badge === undefined ? current.badge : input.badge,
    input.is_active ?? current.is_active,
    input.sort_order ?? current.sort_order,
    planId,
  );
  return true;
}

export function updateAdminExam(examId: string, input: Partial<Pick<AdminExam, 'grade' | 'year_ec' | 'subject_display' | 'verified'>>) {
  const current = getDb().prepare('SELECT * FROM exams WHERE exam_id = ?').get(examId) as AdminExam | undefined;
  if (!current) return false;

  getDb().prepare(`
    UPDATE exams SET grade = ?, year_ec = ?, subject_display = ?, verified = ? WHERE exam_id = ?
  `).run(
    input.grade ?? current.grade,
    input.year_ec ?? current.year_ec,
    input.subject_display ?? current.subject_display,
    input.verified ?? current.verified,
    examId,
  );
  return true;
}
