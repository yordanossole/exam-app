import { NextResponse } from 'next/server';
import { getAdminDashboardData } from '../../../../lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ data: getAdminDashboardData() });
}
