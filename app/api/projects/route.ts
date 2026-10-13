import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/github-store';

export async function GET() {
  const projects = await getProjects(false);
  return NextResponse.json({ success: true, projects });
}
