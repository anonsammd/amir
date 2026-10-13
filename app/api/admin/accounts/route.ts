import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getAccounts, upsertAccount } from '@/lib/github-store';
import { z } from 'zod';

const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Account or brand name is required'),
  platform: z.string().min(1, 'Platform is required'),
  handle: z.string().optional().default(''),
  description: z.string().optional().default(''),
  profileImage: z.string().optional().default(''),
  link: z.string().url('Must be a valid URL'),
  displayOrder: z.number().int().default(1),
  hidden: z.boolean().default(false),
});

export async function GET() {
  const session = await verifyAdminSession();
  const includeHidden = Boolean(session);
  const accounts = await getAccounts(includeHidden);
  return NextResponse.json({ success: true, accounts });
}

export async function POST(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const validation = accountSchema.safeParse(rawBody);

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid input data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const res = await upsertAccount(validation.data);

    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to save account.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, account: res.account });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save account';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// Strictly prohibit permanent deletion as required by prompt
export async function DELETE() {
  return NextResponse.json(
    { error: 'Permanent deletion is strictly prohibited by policy. You may toggle the hidden status to hide accounts from public view.' },
    { status: 405 }
  );
}
