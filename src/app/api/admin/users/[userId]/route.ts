import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateAdminUser } from '../../../../../lib/admin';

const updateSchema = z.object({
  display_name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(160).optional(),
  role: z.enum(['student', 'admin', 'reviewer']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
  grade: z.coerce.number().int().positive().nullable().optional(),
  plan_id: z.string().trim().min(1).nullable().optional(),
}).refine(value => Object.keys(value).length > 0, 'No changes supplied.');

export async function PATCH(request: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter valid user details.', details: parsed.error.flatten() }, { status: 400 });

  try {
    if (!updateAdminUser(userId, parsed.data)) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    return NextResponse.json({ updated: true });
  } catch (error) {
    const message = error instanceof Error && error.message.includes('UNIQUE') ? 'A user with this email already exists.' : 'Could not update user.';
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
