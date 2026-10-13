import { NextResponse } from 'next/server';
import { authenticateAdmin, createAdminSession } from '@/lib/auth';

// Simple in-memory rate limiting map for basic brute-force protection
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const now = Date.now();
    const attemptInfo = loginAttempts.get(ip) || { count: 0, lastAttempt: now };

    // Reset attempt counter after 15 minutes of inactivity
    if (now - attemptInfo.lastAttempt > 15 * 60 * 1000) {
      attemptInfo.count = 0;
    }

    if (attemptInfo.count >= 5) {
      const waitTimeMinutes = Math.ceil((15 * 60 * 1000 - (now - attemptInfo.lastAttempt)) / 60000);
      return NextResponse.json(
        { error: `Too many failed login attempts. Please try again in ${waitTimeMinutes} minutes.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body || {};

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 400 });
    }

    const isValid = await authenticateAdmin(username, password);

    if (!isValid) {
      loginAttempts.set(ip, { count: attemptInfo.count + 1, lastAttempt: now });
      // Add slight delay to slow down brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 800));
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    // Clear login attempts on success
    loginAttempts.delete(ip);

    await createAdminSession(username);

    return NextResponse.json({ success: true, message: 'Authenticated successfully.' });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
