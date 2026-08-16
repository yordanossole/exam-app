import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminPlan } from '../../../../lib/admin';
import { isDatabaseReadOnly } from '../../../../lib/db';

const planSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(240).default(''),
  grade: z.coerce.number().int().positive(),
  price_etb: z.coerce.number().nonnegative(),
  duration_days: z.coerce.number().int().positive(),
  badge: z.string().trim().max(30).nullable().optional(),
  is_active: z.coerce.number().int().min(0).max(1).default(1),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  if (isDatabaseReadOnly()) return NextResponse.json({ error: 'Plan changes require a persistent production database.' }, { status: 503 });
  const parsed = planSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter valid plan details.', details: parsed.error.flatten() }, { status: 400 });

  const planId = createAdminPlan({ ...parsed.data, badge: parsed.data.badge || null });
  return NextResponse.json({ plan_id: planId }, { status: 201 });
}
