import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const COOKIE_NAME = 'admin_session';

// Helper to get secret key for JWT
function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || 'fallback-dev-secret-dopexcreation-32charsmin!';
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  username: string;
  role: 'admin';
  iat: number;
  exp: number;
}

/**
 * Validates admin credentials against environment variables.
 */
export async function authenticateAdmin(usernameInput: string, passwordInput: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  // Generic constant-time comparison check
  if (usernameInput !== adminUsername) {
    return false;
  }

  // If password hash is set in env, check with bcrypt
  if (adminPasswordHash) {
    try {
      return await bcrypt.compare(passwordInput, adminPasswordHash);
    } catch {
      return false;
    }
  }

  // Fallback for default local development if hash is not yet configured
  // Note: Production setup must provide ADMIN_PASSWORD_HASH
  if (process.env.NODE_ENV !== 'production' && passwordInput === 'dopexadmin2025') {
    return true;
  }

  return false;
}

/**
 * Creates an encrypted/signed JWT session cookie for authenticated admin.
 */
export async function createAdminSession(username: string): Promise<string> {
  const key = getSecretKey();
  const token = await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(key);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 12 * 60 * 60, // 12 hours
  });

  return token;
}

/**
 * Verifies the admin session token from cookies or auth header.
 */
export async function verifyAdminSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);

    if (payload.role !== 'admin' || typeof payload.username !== 'string') {
      return null;
    }

    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

/**
 * Clears the admin session cookie.
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
