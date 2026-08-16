import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminUser } from '../../../../lib/admin';

const userSchema = z.object({
  display_name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  role: z.enum(['student', 'admin', 'reviewer']).default('student'),
  status: z.enum(['active', 'suspended']).default('active'),
  grade: z.coerce.number().int().positive().nullable().optional(),
  plan_id: z.string().trim().min(1).nullable().optional(),
});

export async function POST(request: Request) {
  const parsed = userSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter valid user details.', details: parsed.error.flatten() }, { status: 400 });

  try {
    const userId = createAdminUser({ ...parsed.data, grade: parsed.data.grade ?? null, plan_id: parsed.data.plan_id ?? null });
    return NextResponse.json({ user_id: userId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes('UNIQUE') ? 'A user with this email already exists.' : 'Could not create user.';
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
