const VALID_GRADES = new Set([6, 8, 12]);

function gradeFromValue(value) {
  if (typeof value === 'number' && VALID_GRADES.has(value)) return value;

  if (Array.isArray(value)) {
    for (const item of value) {
      const grade = gradeFromValue(item);
      if (grade) return grade;
    }
  }

  if (value && typeof value === 'object') {
    for (const key of ['grade', 'grade_level', 'grade_id', 'education_grade', 'level', 'name', 'title']) {
      const grade = gradeFromValue(value[key]);
      if (grade) return grade;
    }
  }

  if (typeof value !== 'string') return null;

  const exact = Number(value.trim());
  if (VALID_GRADES.has(exact)) return exact;

  const labeled = value.match(/(?:grade|g)\s*(6|8|12)\b/i);
  return labeled ? Number(labeled[1]) : null;
}

export function getPaidGrade(user) {
  const subscription = user?.active_subscription ?? user?.subscription;
  if (!subscription || subscription.active === false || subscription.is_active === false) return null;

  const status = String(subscription.status ?? '').toLowerCase();
  if (status && !['active', 'approved', 'paid', 'valid'].includes(status)) return null;

  return gradeFromValue(
    subscription.grade
      ?? subscription.grade_level
      ?? subscription.grades
      ?? subscription.allowed_grades
      ?? subscription.plan_id
      ?? subscription.plan?.grade
      ?? subscription.plan?.grade_level
      ?? subscription.plan?.id
      ?? subscription.plan?.name
      ?? subscription.name
  );
}
