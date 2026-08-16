import { NextResponse } from 'next/server';
import { listAdminPlans } from '../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const plans = listAdminPlans(false).map(plan => ({
    id: plan.plan_id,
    name: plan.name,
    description: plan.description,
    grade: plan.grade,
    price: plan.price_etb,
    duration_days: plan.duration_days,
    badge: plan.badge,
  }));
  return NextResponse.json({ plans });
}
