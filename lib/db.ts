import { Pool } from 'pg';
import { Project, DesignProject, SocialAccount } from './types';
import { promises as fs } from 'fs';
import path from 'path';

let pool: Pool | null = null;
let tablesInitialized = false;

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.DATABASE_POSTGRES_URL) return process.env.DATABASE_POSTGRES_URL;
  if (process.env.DATABASE_POSTGRES_PRISMA_URL) return process.env.DATABASE_POSTGRES_PRISMA_URL;

  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('DATABASE_') && value && typeof value === 'string' && (value.startsWith('postgres://') || value.startsWith('postgresql://'))) {
      return value;
    }
  }

  const host = process.env.DATABASE_PGHOST || process.env.DATABASE_POSTGRES_HOST;
  const user = process.env.DATABASE_PGUSER || process.env.DATABASE_POSTGRES_USER;
  const password = process.env.DATABASE_PGPASSWORD || process.env.DATABASE_POSTGRES_PASSWORD;
  const database = process.env.DATABASE_PGDATABASE || process.env.DATABASE_POSTGRES_DATABASE;

  if (host && user && password && database) {
    return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  return undefined;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(getDatabaseUrl());
}

function getPool(): Pool | null {
  if (!pool) {
    const connectionString = getDatabaseUrl();
    if (!connectionString) return null;

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }
  return pool;
}

/**
 * Initializes PostgreSQL tables and seeds initial data from local JSON if empty.
 */
export async function initializeDatabase(): Promise<void> {
  if (tablesInitialized) return;
  const db = getPool();
  if (!db) return;

  try {
    const client = await db.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id VARCHAR(64) PRIMARY KEY,
          title TEXT NOT NULL,
          youtube_url TEXT NOT NULL,
          youtube_id VARCHAR(64) NOT NULL,
          category VARCHAR(64) NOT NULL,
          description TEXT,
          custom_thumbnail TEXT,
          featured BOOLEAN DEFAULT FALSE,
          display_order INT DEFAULT 0,
          hidden BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS design_projects (
          id VARCHAR(64) PRIMARY KEY,
          title TEXT NOT NULL,
          brand_name TEXT NOT NULL,
          image_url TEXT NOT NULL,
          behance_link TEXT NOT NULL,
          display_order INT DEFAULT 0,
          hidden BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS accounts (
          id VARCHAR(64) PRIMARY KEY,
          name TEXT NOT NULL,
          platform VARCHAR(64) NOT NULL,
          handle VARCHAR(128),
          description TEXT,
          profile_image TEXT,
          link TEXT NOT NULL,
          display_order INT DEFAULT 0,
          hidden BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Seed projects
      const pRes = await client.query('SELECT COUNT(*) FROM projects;');
      if (parseInt(pRes.rows[0].count, 10) === 0) {
        try {
          const localProjectsPath = path.join(process.cwd(), 'data', 'projects.json');
          const raw = await fs.readFile(localProjectsPath, 'utf-8');
          const projects: Project[] = JSON.parse(raw);
          for (const p of projects) {
            await client.query(
              `INSERT INTO projects (id, title, youtube_url, youtube_id, category, description, custom_thumbnail, featured, display_order, hidden, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
               ON CONFLICT (id) DO NOTHING;`,
              [
                p.id,
                p.title,
                p.youtubeUrl,
                p.youtubeId,
                p.category,
                p.description || '',
                p.customThumbnail || '',
                p.featured || false,
                p.displayOrder || 0,
                p.hidden || false,
                p.createdAt || new Date().toISOString(),
                p.updatedAt || new Date().toISOString(),
              ]
            );
          }
        } catch (seedErr) {
          console.error('Failed to seed projects into Neon DB:', seedErr);
        }
      }

      // Seed design projects
      const dRes = await client.query('SELECT COUNT(*) FROM design_projects;');
      if (parseInt(dRes.rows[0].count, 10) === 0) {
        try {
          const localDesignPath = path.join(process.cwd(), 'data', 'design-projects.json');
          const raw = await fs.readFile(localDesignPath, 'utf-8');
          const designProjects: DesignProject[] = JSON.parse(raw);
          for (const d of designProjects) {
            await client.query(
              `INSERT INTO design_projects (id, title, brand_name, image_url, behance_link, display_order, hidden, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               ON CONFLICT (id) DO NOTHING;`,
              [
                d.id,
                d.title,
                d.brandName,
                d.imageUrl,
                d.behanceLink,
                d.displayOrder || 0,
                d.hidden || false,
                d.createdAt || new Date().toISOString(),
                d.updatedAt || new Date().toISOString(),
              ]
            );
          }
        } catch (seedErr) {
          console.error('Failed to seed design projects into Neon DB:', seedErr);
        }
      }

      // Seed accounts
      const aRes = await client.query('SELECT COUNT(*) FROM accounts;');
      if (parseInt(aRes.rows[0].count, 10) === 0) {
        try {
          const localAccountsPath = path.join(process.cwd(), 'data', 'accounts.json');
          const raw = await fs.readFile(localAccountsPath, 'utf-8');
          const accounts: SocialAccount[] = JSON.parse(raw);
          for (const a of accounts) {
            await client.query(
              `INSERT INTO accounts (id, name, platform, handle, description, profile_image, link, display_order, hidden, created_at, updated_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
               ON CONFLICT (id) DO NOTHING;`,
              [
                a.id,
                a.name,
                a.platform,
                a.handle || '',
                a.description || '',
                a.profileImage || '',
                a.link,
                a.displayOrder || 0,
                a.hidden || false,
                a.createdAt || new Date().toISOString(),
                a.updatedAt || new Date().toISOString(),
              ]
            );
          }
        } catch (seedErr) {
          console.error('Failed to seed accounts into Neon DB:', seedErr);
        }
      }

      tablesInitialized = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Projects DB
export async function getDbProjects(includeHidden: boolean = false): Promise<Project[]> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return [];

  const query = includeHidden
    ? `SELECT id, title, youtube_url as "youtubeUrl", youtube_id as "youtubeId", category, description, custom_thumbnail as "customThumbnail", featured, display_order as "displayOrder", hidden, created_at as "createdAt", updated_at as "updatedAt" FROM projects ORDER BY display_order ASC;`
    : `SELECT id, title, youtube_url as "youtubeUrl", youtube_id as "youtubeId", category, description, custom_thumbnail as "customThumbnail", featured, display_order as "displayOrder", hidden, created_at as "createdAt", updated_at as "updatedAt" FROM projects WHERE hidden = false ORDER BY display_order ASC;`;

  const res = await db.query(query);
  return res.rows;
}

export async function upsertDbProject(projectData: Partial<Project> & { title: string; youtubeUrl: string; youtubeId: string; category: string }): Promise<{ success: boolean; project?: Project; error?: string }> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return { success: false, error: 'Database not configured' };

  const now = new Date().toISOString();
  let projectId = projectData.id;
  if (!projectId) {
    projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }

  let displayOrder = projectData.displayOrder;
  if (displayOrder === undefined) {
    const countRes = await db.query('SELECT COUNT(*) FROM projects;');
    displayOrder = parseInt(countRes.rows[0].count, 10) + 1;
  }

  const project: Project = {
    id: projectId,
    title: projectData.title,
    youtubeUrl: projectData.youtubeUrl,
    youtubeId: projectData.youtubeId,
    category: projectData.category.toUpperCase(),
    description: projectData.description || '',
    customThumbnail: projectData.customThumbnail || '',
    featured: projectData.featured ?? true,
    displayOrder,
    hidden: projectData.hidden ?? false,
    createdAt: projectData.createdAt || now,
    updatedAt: now,
  };

  await db.query(
    `INSERT INTO projects (id, title, youtube_url, youtube_id, category, description, custom_thumbnail, featured, display_order, hidden, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       youtube_url = EXCLUDED.youtube_url,
       youtube_id = EXCLUDED.youtube_id,
       category = EXCLUDED.category,
       description = EXCLUDED.description,
       custom_thumbnail = EXCLUDED.custom_thumbnail,
       featured = EXCLUDED.featured,
       display_order = EXCLUDED.display_order,
       hidden = EXCLUDED.hidden,
       updated_at = EXCLUDED.updated_at;`,
    [
      project.id,
      project.title,
      project.youtubeUrl,
      project.youtubeId,
      project.category,
      project.description,
      project.customThumbnail,
      project.featured,
      project.displayOrder,
      project.hidden,
      project.createdAt,
      project.updatedAt,
    ]
  );

  return { success: true, project };
}

export async function deleteDbProject(id: string): Promise<{ success: boolean; error?: string }> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return { success: false, error: 'Database not configured' };
  await db.query('DELETE FROM projects WHERE id = $1;', [id]);
  return { success: true };
}

// Design Projects DB
export async function getDbDesignProjects(includeHidden: boolean = false): Promise<DesignProject[]> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return [];

  const query = includeHidden
    ? `SELECT id, title, brand_name as "brandName", image_url as "imageUrl", behance_link as "behanceLink", display_order as "displayOrder", hidden, created_at as "createdAt", updated_at as "updatedAt" FROM design_projects ORDER BY display_order ASC;`
    : `SELECT id, title, brand_name as "brandName", image_url as "imageUrl", behance_link as "behanceLink", display_order as "displayOrder", hidden, created_at as "createdAt", updated_at as "updatedAt" FROM design_projects WHERE hidden = false ORDER BY display_order ASC;`;

  const res = await db.query(query);
  return res.rows;
}

export async function upsertDbDesignProject(data: Partial<DesignProject> & { title: string; brandName: string; imageUrl: string; behanceLink: string }): Promise<{ success: boolean; designProject?: DesignProject; error?: string }> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return { success: false, error: 'Database not configured' };

  const now = new Date().toISOString();
  let id = data.id;
  if (!id) {
    id = `des_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }

  let displayOrder = data.displayOrder;
  if (displayOrder === undefined) {
    const countRes = await db.query('SELECT COUNT(*) FROM design_projects;');
    displayOrder = parseInt(countRes.rows[0].count, 10) + 1;
  }

  const designProj: DesignProject = {
    id,
    title: data.title,
    brandName: data.brandName,
    imageUrl: data.imageUrl,
    behanceLink: data.behanceLink,
    displayOrder,
    hidden: data.hidden ?? false,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  await db.query(
    `INSERT INTO design_projects (id, title, brand_name, image_url, behance_link, display_order, hidden, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       brand_name = EXCLUDED.brand_name,
       image_url = EXCLUDED.image_url,
       behance_link = EXCLUDED.behance_link,
       display_order = EXCLUDED.display_order,
       hidden = EXCLUDED.hidden,
       updated_at = EXCLUDED.updated_at;`,
    [
      designProj.id,
      designProj.title,
      designProj.brandName,
      designProj.imageUrl,
      designProj.behanceLink,
      designProj.displayOrder,
      designProj.hidden,
      designProj.createdAt,
      designProj.updatedAt,
    ]
  );

  return { success: true, designProject: designProj };
}

export async function deleteDbDesignProject(id: string): Promise<{ success: boolean; error?: string }> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return { success: false, error: 'Database not configured' };
  await db.query('DELETE FROM design_projects WHERE id = $1;', [id]);
  return { success: true };
}

// Accounts DB
export async function getDbAccounts(includeHidden: boolean = false): Promise<SocialAccount[]> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return [];

  const query = includeHidden
    ? `SELECT id, name, platform, handle, description, profile_image as "profileImage", link, display_order as "displayOrder", hidden, created_at as "createdAt", updated_at as "updatedAt" FROM accounts ORDER BY display_order ASC;`
    : `SELECT id, name, platform, handle, description, profile_image as "profileImage", link, display_order as "displayOrder", hidden, created_at as "createdAt", updated_at as "updatedAt" FROM accounts WHERE hidden = false ORDER BY display_order ASC;`;

  const res = await db.query(query);
  return res.rows;
}

export async function upsertDbAccount(accountData: Partial<SocialAccount> & { name: string; platform: string; link: string }): Promise<{ success: boolean; account?: SocialAccount; error?: string }> {
  await initializeDatabase();
  const db = getPool();
  if (!db) return { success: false, error: 'Database not configured' };

  const now = new Date().toISOString();
  let accountId = accountData.id;
  if (!accountId) {
    accountId = `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }

  let displayOrder = accountData.displayOrder;
  if (displayOrder === undefined) {
    const countRes = await db.query('SELECT COUNT(*) FROM accounts;');
    displayOrder = parseInt(countRes.rows[0].count, 10) + 1;
  }

  const account: SocialAccount = {
    id: accountId,
    name: accountData.name,
    platform: accountData.platform.toLowerCase(),
    handle: accountData.handle || '',
    description: accountData.description || '',
    profileImage: accountData.profileImage || '',
    link: accountData.link,
    displayOrder,
    hidden: accountData.hidden ?? false,
    createdAt: accountData.createdAt || now,
    updatedAt: now,
  };

  await db.query(
    `INSERT INTO accounts (id, name, platform, handle, description, profile_image, link, display_order, hidden, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       platform = EXCLUDED.platform,
       handle = EXCLUDED.handle,
       description = EXCLUDED.description,
       profile_image = EXCLUDED.profile_image,
       link = EXCLUDED.link,
       display_order = EXCLUDED.display_order,
       hidden = EXCLUDED.hidden,
       updated_at = EXCLUDED.updated_at;`,
    [
      account.id,
      account.name,
      account.platform,
      account.handle,
      account.description,
      account.profileImage,
      account.link,
      account.displayOrder,
      account.hidden,
      account.createdAt,
      account.updatedAt,
    ]
  );

  return { success: true, account };
}
