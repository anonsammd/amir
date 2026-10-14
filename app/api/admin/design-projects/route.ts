import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getDesignProjects, upsertDesignProject, deleteDesignProject } from '@/lib/github-store';
import { z } from 'zod';

const designSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(150, 'Title too long'),
  brandName: z.string().min(1, 'Brand name is required').max(100, 'Brand name too long'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  behanceLink: z.string().min(1, 'Behance / external link is required'),
  displayOrder: z.number().int().default(1),
  hidden: z.boolean().default(false),
});

export async function GET() {
  const session = await verifyAdminSession();
  const includeHidden = Boolean(session);
  const designProjects = await getDesignProjects(includeHidden);
  return NextResponse.json({ success: true, designProjects });
}

export async function POST(request: Request) {
  const session = await verifyAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const validation = designSchema.safeParse(rawBody);

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || 'Invalid input data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { id, title, brandName, imageUrl, behanceLink, displayOrder, hidden } = validation.data;

    const res = await upsertDesignProject({
      id,
      title: title.trim(),
      brandName: brandName.trim(),
      imageUrl: imageUrl.trim(),
      behanceLink: behanceLink.trim(),
      displayOrder,
      hidden,
    });

    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to save design project.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, designProject: res.designProject });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to save design project';
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

    let designId = idParam;
    if (!designId) {
      const body = await request.json().catch(() => ({}));
      designId = body.id;
    }

    if (!designId || typeof designId !== 'string') {
      return NextResponse.json({ error: 'Design project ID is required for deletion.' }, { status: 400 });
    }

    const res = await deleteDesignProject(designId);
    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to delete design project.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Design project deleted successfully.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete design project';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
