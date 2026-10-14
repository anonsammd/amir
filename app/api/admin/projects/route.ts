import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getProjects, upsertProject, deleteProject } from '@/lib/github-store';
import { parseYouTubeVideoId } from '@/lib/youtube';
import { z } from 'zod';

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  youtubeUrl: z.string().min(1, 'YouTube URL or Video ID is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional().default(''),
  customThumbnail: z.string().optional().default(''),
  featured: z.boolean().default(true),
  displayOrder: z.number().int().default(1),
  hidden: z.boolean().default(false),
});

export async function GET() {
  const session = await verifyAdminSession();
  const includeHidden = Boolean(session);
  const projects = await getProjects(includeHidden);
  return NextResponse.json({ success: true, projects });
}

export async function POST(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const validation = projectSchema.safeParse(rawBody);

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid input data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { id, title, youtubeUrl, category, description, customThumbnail, featured, displayOrder, hidden } = validation.data;

    // Validate and extract YouTube ID
    const parsedYt = parseYouTubeVideoId(youtubeUrl);
    if (!parsedYt.isValid || !parsedYt.videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL or Video ID. Please provide a valid YouTube link or video ID.' },
        { status: 400 }
      );
    }

    const res = await upsertProject({
      id,
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      youtubeId: parsedYt.videoId,
      category: category.trim().toUpperCase(),
      description: description?.trim() || '',
      customThumbnail: customThumbnail?.trim() || '',
      featured,
      displayOrder,
      hidden,
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to save project.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: res.project });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save project';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

export async function DELETE(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get('id');

    let projectId = idParam;
    if (!projectId) {
      const body = await request.json().catch(() => ({}));
      projectId = body.id;
    }

    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json({ error: 'Project ID is required for deletion.' }, { status: 400 });
    }

    const res = await deleteProject(projectId);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to delete project.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete project';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
