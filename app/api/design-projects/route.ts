import { NextResponse } from 'next/server';
import { getDesignProjects } from '@/lib/github-store';

export async function GET() {
  try {
    const designProjects = await getDesignProjects(false);
    return NextResponse.json({ success: true, designProjects });
  } catch (err) {
    console.error('Failed to fetch public design projects:', err);
    return NextResponse.json({ success: true, designProjects: [] });
  }
}
