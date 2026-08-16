import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateAdminExam } from '../../../../../lib/admin';
import { isDatabaseReadOnly } from '../../../../../lib/db';

const updateSchema = z.object({
  grade: z.coerce.number().int().positive().optional(),
  year_ec: z.coerce.number().int().positive().optional(),
  subject_display: z.string().trim().min(2).max(100).optional(),
  verified: z.coerce.number().int().min(0).max(1).optional(),
}).refine(value => Object.keys(value).length > 0, 'No changes supplied.');

export async function PATCH(request: Request, context: { params: Promise<{ examId: string }> }) {
  if (isDatabaseReadOnly()) return NextResponse.json({ error: 'Exam changes require a persistent production database.' }, { status: 503 });
  const { examId } = await context.params;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter valid exam details.', details: parsed.error.flatten() }, { status: 400 });
  if (!updateAdminExam(examId, parsed.data)) return NextResponse.json({ error: 'Exam not found.' }, { status: 404 });
  return NextResponse.json({ updated: true });
}
