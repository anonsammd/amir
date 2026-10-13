import { promises as fs } from 'fs';
import path from 'path';
import { Project, SocialAccount } from './types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_PROJECTS_PATH = process.env.GITHUB_PROJECTS_PATH || 'data/projects.json';
const GITHUB_ACCOUNTS_PATH = process.env.GITHUB_ACCOUNTS_PATH || 'data/accounts.json';

// Local file path fallbacks
const LOCAL_PROJECTS_PATH = path.join(process.cwd(), 'data', 'projects.json');
const LOCAL_ACCOUNTS_PATH = path.join(process.cwd(), 'data', 'accounts.json');

function isGitHubConfigured(): boolean {
  return Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}

interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

/**
 * Reads JSON file content from GitHub repository or local fallback.
 */
async function readGitHubJson<T>(filePath: string, localFallbackPath: string): Promise<{ data: T[]; sha?: string }> {
  if (isGitHubConfigured()) {
    try {
      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'DopexCreation-Portfolio-App',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const json: GitHubFileResponse = await res.json();
        const decodedContent = Buffer.from(json.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(decodedContent);
        return { data: Array.isArray(parsed) ? parsed : [], sha: json.sha };
      }
    } catch (err) {
      console.error(`Failed to fetch ${filePath} from GitHub, falling back to local file`, err);
    }
  }

  // Fallback to local file
  try {
    const raw = await fs.readFile(localFallbackPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return { data: Array.isArray(parsed) ? parsed : [] };
  } catch {
    return { data: [] };
  }
}

/**
 * Commits JSON file update to GitHub or saves locally.
 */
async function writeGitHubJson<T>(
  filePath: string,
  localFallbackPath: string,
  updatedData: T[],
  commitMessage: string,
  fileSha?: string
): Promise<{ success: boolean; error?: string }> {
  const jsonContent = JSON.stringify(updatedData, null, 2);

  if (isGitHubConfigured()) {
    try {
      // If SHA wasn't passed, fetch current SHA
      let currentSha = fileSha;
      if (!currentSha) {
        const checkUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
        const checkRes = await fetch(checkUrl, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'DopexCreation-Portfolio-App',
          },
          cache: 'no-store',
        });
        if (checkRes.ok) {
          const json: GitHubFileResponse = await checkRes.json();
          currentSha = json.sha;
        }
      }

      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
      const base64Content = Buffer.from(jsonContent, 'utf-8').toString('base64');

      const bodyPayload: Record<string, unknown> = {
        message: commitMessage,
        content: base64Content,
        branch: GITHUB_BRANCH,
      };

      if (currentSha) {
        bodyPayload.sha = currentSha;
      }

      const putRes = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'DopexCreation-Portfolio-App',
        },
        body: JSON.stringify(bodyPayload),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        return {
          success: false,
          error: errJson.message || `GitHub API error: ${putRes.status} ${putRes.statusText}`,
        };
      }

      // Also mirror update to local disk if available
      try {
        await fs.writeFile(localFallbackPath, jsonContent, 'utf-8');
      } catch {
        // Ignore local mirror errors on serverless
      }

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown GitHub write error';
      return { success: false, error: msg };
    }
  }

  // Fallback to local file update
  try {
    await fs.writeFile(localFallbackPath, jsonContent, 'utf-8');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to write local file';
    return { success: false, error: msg };
  }
}

// Public Project CRUD Operations (No Delete)

export async function getProjects(includeHidden: boolean = false): Promise<Project[]> {
  const { data } = await readGitHubJson<Project>(GITHUB_PROJECTS_PATH, LOCAL_PROJECTS_PATH);
  const sorted = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  if (includeHidden) {
    return sorted;
  }
  return sorted.filter((p) => !p.hidden);
}

export async function upsertProject(projectData: Partial<Project> & { title: string; youtubeUrl: string; youtubeId: string; category: string }): Promise<{ success: boolean; project?: Project; error?: string }> {
  const { data: existingProjects, sha } = await readGitHubJson<Project>(GITHUB_PROJECTS_PATH, LOCAL_PROJECTS_PATH);

  const now = new Date().toISOString();
  let updatedProject: Project;
  let newList: Project[];

  if (projectData.id) {
    // Edit existing project
    const idx = existingProjects.findIndex((p) => p.id === projectData.id);
    if (idx === -1) {
      return { success: false, error: `Project with ID '${projectData.id}' not found.` };
    }
    updatedProject = {
      ...existingProjects[idx],
      ...projectData,
      updatedAt: now,
    };
    newList = [...existingProjects];
    newList[idx] = updatedProject;
  } else {
    // Add new project
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    updatedProject = {
      id: newId,
      title: projectData.title,
      youtubeUrl: projectData.youtubeUrl,
      youtubeId: projectData.youtubeId,
      category: projectData.category.toUpperCase(),
      description: projectData.description || '',
      customThumbnail: projectData.customThumbnail || '',
      featured: projectData.featured ?? true,
      displayOrder: projectData.displayOrder ?? existingProjects.length + 1,
      hidden: projectData.hidden ?? false,
      createdAt: now,
      updatedAt: now,
    };
    newList = [...existingProjects, updatedProject];
  }

  const commitMsg = projectData.id ? `admin: update project ${updatedProject.title}` : `admin: add project ${updatedProject.title}`;
  const res = await writeGitHubJson<Project>(GITHUB_PROJECTS_PATH, LOCAL_PROJECTS_PATH, newList, commitMsg, sha);

  if (!res.success) {
    return { success: false, error: res.error };
  }

  return { success: true, project: updatedProject };
}

// Public Accounts CRUD Operations (No Delete)

export async function getAccounts(includeHidden: boolean = false): Promise<SocialAccount[]> {
  const { data } = await readGitHubJson<SocialAccount>(GITHUB_ACCOUNTS_PATH, LOCAL_ACCOUNTS_PATH);
  const sorted = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  if (includeHidden) {
    return sorted;
  }
  return sorted.filter((a) => !a.hidden);
}

export async function upsertAccount(accountData: Partial<SocialAccount> & { name: string; platform: string; link: string }): Promise<{ success: boolean; account?: SocialAccount; error?: string }> {
  const { data: existingAccounts, sha } = await readGitHubJson<SocialAccount>(GITHUB_ACCOUNTS_PATH, LOCAL_ACCOUNTS_PATH);

  const now = new Date().toISOString();
  let updatedAccount: SocialAccount;
  let newList: SocialAccount[];

  if (accountData.id) {
    const idx = existingAccounts.findIndex((a) => a.id === accountData.id);
    if (idx === -1) {
      return { success: false, error: `Account with ID '${accountData.id}' not found.` };
    }
    updatedAccount = {
      ...existingAccounts[idx],
      ...accountData,
      updatedAt: now,
    };
    newList = [...existingAccounts];
    newList[idx] = updatedAccount;
  } else {
    const newId = `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    updatedAccount = {
      id: newId,
      name: accountData.name,
      platform: accountData.platform.toLowerCase(),
      handle: accountData.handle || '',
      description: accountData.description || '',
      profileImage: accountData.profileImage || '',
      link: accountData.link,
      displayOrder: accountData.displayOrder ?? existingAccounts.length + 1,
      hidden: accountData.hidden ?? false,
      createdAt: now,
      updatedAt: now,
    };
    newList = [...existingAccounts, updatedAccount];
  }

  const commitMsg = accountData.id ? `admin: update account ${updatedAccount.name}` : `admin: add account ${updatedAccount.name}`;
  const res = await writeGitHubJson<SocialAccount>(GITHUB_ACCOUNTS_PATH, LOCAL_ACCOUNTS_PATH, newList, commitMsg, sha);

  if (!res.success) {
    return { success: false, error: res.error };
  }

  return { success: true, account: updatedAccount };
}
