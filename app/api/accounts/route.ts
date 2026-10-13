import { NextResponse } from 'next/server';
import { getAccounts } from '@/lib/github-store';

export async function GET() {
  const accounts = await getAccounts(false);
  return NextResponse.json({ success: true, accounts });
}
