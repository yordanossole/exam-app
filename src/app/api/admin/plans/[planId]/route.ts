import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateAdminPlan } from '../../../../../lib/admin';

const updateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  description: z.string().trim().max(240).optional(),
  grade: z.coerce.number().int().positive().optional(),
  price_etb: z.coerce.number().nonnegative().optional(),
  duration_days: z.coerce.number().int().positive().optional(),
  badge: z.string().trim().max(30).nullable().optional(),
  is_active: z.coerce.number().int().min(0).max(1).optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
}).refine(value => Object.keys(value).length > 0, 'No changes supplied.');

export async function PATCH(request: Request, context: { params: Promise<{ planId: string }> }) {
  const { planId } = await context.params;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter valid plan details.', details: parsed.error.flatten() }, { status: 400 });
  if (!updateAdminPlan(planId, parsed.data)) return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
  return NextResponse.json({ updated: true });
}
