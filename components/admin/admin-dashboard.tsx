'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Project, DesignProject, SocialAccount } from '@/lib/types';
import { ProjectForm } from './project-form';
import { DesignProjectForm } from './design-project-form';
import { AccountForm } from './account-form';
import { GitHubIcon } from '../brand-icons';
import {
  Film,
  Palette,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  initialProjects: Project[];
  initialDesignProjects: DesignProject[];
  initialAccounts: SocialAccount[];
}

export function AdminDashboard({ initialProjects, initialDesignProjects, initialAccounts }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'design' | 'accounts' | 'status'>('projects');

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [designProjects, setDesignProjects] = useState<DesignProject[]>(initialDesignProjects);
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [editingDesignProject, setEditingDesignProject] = useState<DesignProject | null>(null);
  const [isAddingDesignProject, setIsAddingDesignProject] = useState(false);

  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const [pRes, dRes, aRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/design-projects'),
        fetch('/api/admin/accounts'),
      ]);
      const pJson = await pRes.json();
      const dJson = await dRes.json();
      const aJson = await aRes.json();

      if (pJson.projects) setProjects(pJson.projects);
      if (dJson.designProjects) setDesignProjects(dJson.designProjects);
      if (aJson.accounts) setAccounts(aJson.accounts);
    } catch (err) {
      console.error('Failed to refresh admin data:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin');
      router.refresh();
    } catch {
      router.push('/admin');
    }
  };

  const toggleProjectVisibility = async (project: Project) => {
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, hidden: !project.hidden }),
      });
      if (res.ok) {
        setStatusMsg(`Updated visibility for "${project.title}"`);
        refreshData();
      }
    } catch {
      setStatusMsg('Failed to update visibility');
    }
  };

  const deleteProject = async (proj: Project) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${proj.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/projects?id=${proj.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete project');
      }

      setStatusMsg(`Deleted project "${proj.title}" successfully.`);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project';
      setStatusMsg(msg);
    }
  };

  const toggleDesignProjectVisibility = async (dp: DesignProject) => {
    try {
      const res = await fetch('/api/admin/design-projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dp, hidden: !dp.hidden }),
      });
      if (res.ok) {
        setStatusMsg(`Updated visibility for "${dp.title}"`);
        refreshData();
      }
    } catch {
      setStatusMsg('Failed to update visibility');
    }
  };

  const deleteDesignProject = async (dp: DesignProject) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${dp.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/design-projects?id=${dp.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to delete design project');
      }

      setStatusMsg(`Deleted design project "${dp.title}" successfully.`);
      refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete design project';
      setStatusMsg(msg);
    }
  };

  const toggleAccountVisibility = async (account: SocialAccount) => {
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...account, hidden: !account.hidden }),
      });
      if (res.ok) {
        setStatusMsg(`Updated visibility for "${account.name}"`);
        refreshData();
      }
    } catch {
      setStatusMsg('Failed to update visibility');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#101010]/90 backdrop-blur-md border-b border-[#171717] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF3030] flex items-center justify-center text-black font-black">
              <Film className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight uppercase">
                DOPEX<span className="text-[#FF3030]">CREATION</span> STUDIO ADMIN
              </div>
              <div className="text-[10px] font-mono text-[#B8B8B8] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span>Authenticated Admin Session</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider transition-colors border border-[#262626]"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF3030]" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A90F20]/20 hover:bg-[#A90F20] text-white text-xs font-mono uppercase tracking-wider transition-colors border border-[#A90F20]/50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#FF3030]" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {statusMsg && (
          <div className="mb-8 p-4 rounded-2xl bg-[#101010] border border-[#FF3030]/40 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs font-mono text-white">
              <span className="w-2 h-2 rounded-full bg-[#FF3030] animate-pulse" />
              <span>{statusMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMsg(null)}
              className="text-xs text-[#B8B8B8] hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#101010] border border-[#171717] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">Video Showreels</div>
              <div className="text-3xl font-black text-white mt-1">{projects.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center text-[#FF3030]">
              <Film className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#101010] border border-[#171717] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">Design & Behance</div>
              <div className="text-3xl font-black text-white mt-1">{designProjects.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center text-[#FF3030]">
              <Palette className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#101010] border border-[#171717] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">Active Public Items</div>
              <div className="text-3xl font-black text-white mt-1">
                {projects.filter((p) => !p.hidden).length + designProjects.filter((d) => !d.hidden).length + accounts.filter((a) => !a.hidden).length}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center text-green-400">
              <Eye className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#101010] border border-[#171717] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">Social Channels</div>
              <div className="text-3xl font-black text-white mt-1">{accounts.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center text-[#FF3030]">
              <Share2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#171717] pb-4 mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects');
              setIsAddingProject(false);
              setEditingProject(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Video Showreels ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('design');
              setIsAddingDesignProject(false);
              setEditingDesignProject(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'design'
                ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Design & Behance ({designProjects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('accounts');
              setIsAddingAccount(false);
              setEditingAccount(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Social Channels ({accounts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'status'
                ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717]'
            }`}
          >
            <GitHubIcon className="w-4 h-4" />
            <span>Persistence & Config</span>
          </button>
        </div>

        {/* Tab 1: Video Projects Management */}
        {activeTab === 'projects' && (
          <div>
            {isAddingProject || editingProject ? (
              <ProjectForm
                projectToEdit={editingProject}
                onSuccess={() => {
                  setIsAddingProject(false);
                  setEditingProject(null);
                  refreshData();
                }}
                onCancel={() => {
                  setIsAddingProject(false);
                  setEditingProject(null);
                }}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">Video Showreels</h2>
                    <p className="text-xs text-[#B8B8B8]">
                      Manage and delete video showreels or toggle visibility.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingProject(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,48,48,0.3)] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Showreel</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#101010] border border-[#171717] hover:border-[#262626] gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-[#050505] border border-[#262626] flex items-center justify-center text-[#FF3030] font-mono text-xs font-bold shrink-0">
                          9:16
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{proj.title}</span>
                            <span className="px-2 py-0.5 rounded bg-[#171717] border border-[#262626] text-[10px] font-mono text-[#FF3030] uppercase">
                              {proj.category}
                            </span>
                            {proj.hidden && (
                              <span className="px-2 py-0.5 rounded bg-[#A90F20]/20 text-[#FF3030] text-[10px] font-mono uppercase">
                                HIDDEN
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-[#B8B8B8] mt-1">
                            ID: {proj.youtubeId} · Order: {proj.displayOrder}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleProjectVisibility(proj)}
                          className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                            proj.hidden
                              ? 'bg-[#171717] border-[#262626] text-[#B8B8B8] hover:text-white'
                              : 'bg-green-900/20 border-green-700/50 text-green-400'
                          }`}
                          title={proj.hidden ? 'Show on public site' : 'Hide from public site'}
                        >
                          {proj.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingProject(proj)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider border border-[#262626] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#FF3030]" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteProject(proj)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#A90F20]/20 hover:bg-[#A90F20] text-white text-xs font-mono uppercase tracking-wider border border-[#A90F20]/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#FF3030]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Design & Behance Projects Management */}
        {activeTab === 'design' && (
          <div>
            {isAddingDesignProject || editingDesignProject ? (
              <DesignProjectForm
                projectToEdit={editingDesignProject}
                onSuccess={() => {
                  setIsAddingDesignProject(false);
                  setEditingDesignProject(null);
                  refreshData();
                }}
                onCancel={() => {
                  setIsAddingDesignProject(false);
                  setEditingDesignProject(null);
                }}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">Design & Behance Showcase</h2>
                    <p className="text-xs text-[#B8B8B8]">
                      Add, edit, and delete design projects with direct Behance links.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingDesignProject(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,48,48,0.3)] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Design Project</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {designProjects.map((dp) => (
                    <div
                      key={dp.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#101010] border border-[#171717] hover:border-[#262626] gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-[#050505] border border-[#262626] overflow-hidden relative shrink-0">
                          <Image src={dp.imageUrl} alt={dp.title} fill unoptimized className="object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{dp.title}</span>
                            <span className="px-2 py-0.5 rounded bg-[#171717] border border-[#262626] text-[10px] font-mono text-[#FF3030] uppercase">
                              {dp.brandName}
                            </span>
                            {dp.hidden && (
                              <span className="px-2 py-0.5 rounded bg-[#A90F20]/20 text-[#FF3030] text-[10px] font-mono uppercase">
                                HIDDEN
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-[#B8B8B8] mt-1 truncate max-w-md">
                            Link: {dp.behanceLink}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleDesignProjectVisibility(dp)}
                          className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                            dp.hidden
                              ? 'bg-[#171717] border-[#262626] text-[#B8B8B8] hover:text-white'
                              : 'bg-green-900/20 border-green-700/50 text-green-400'
                          }`}
                          title={dp.hidden ? 'Show on public site' : 'Hide from public site'}
                        >
                          {dp.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingDesignProject(dp)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider border border-[#262626] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#FF3030]" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteDesignProject(dp)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#A90F20]/20 hover:bg-[#A90F20] text-white text-xs font-mono uppercase tracking-wider border border-[#A90F20]/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                          title="Delete design project"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#FF3030]" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Accounts Management */}
        {activeTab === 'accounts' && (
          <div>
            {isAddingAccount || editingAccount ? (
              <AccountForm
                accountToEdit={editingAccount}
                onSuccess={() => {
                  setIsAddingAccount(false);
                  setEditingAccount(null);
                  refreshData();
                }}
                onCancel={() => {
                  setIsAddingAccount(false);
                  setEditingAccount(null);
                }}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">Social Channels</h2>
                    <p className="text-xs text-[#B8B8B8]">
                      Manage social accounts displayed on the public site.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingAccount(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,48,48,0.3)] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Channel</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#101010] border border-[#171717] hover:border-[#262626] gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{acc.name}</span>
                          <span className="px-2 py-0.5 rounded bg-[#171717] border border-[#262626] text-[10px] font-mono text-[#FF3030] uppercase">
                            {acc.platform}
                          </span>
                          {acc.hidden && (
                            <span className="px-2 py-0.5 rounded bg-[#A90F20]/20 text-[#FF3030] text-[10px] font-mono uppercase">
                              HIDDEN
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono text-[#B8B8B8] mt-1">
                          Handle: {acc.handle || 'N/A'} · Link: {acc.link}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleAccountVisibility(acc)}
                          className={`p-2 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                            acc.hidden
                              ? 'bg-[#171717] border-[#262626] text-[#B8B8B8] hover:text-white'
                              : 'bg-green-900/20 border-green-700/50 text-green-400'
                          }`}
                          title={acc.hidden ? 'Show on public site' : 'Hide from public site'}
                        >
                          {acc.hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingAccount(acc)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider border border-[#262626] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#FF3030]" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Persistence Status */}
        {activeTab === 'status' && (
          <div className="bg-[#101010] border border-[#171717] rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#171717]">
              <Sparkles className="w-6 h-6 text-[#FF3030]" />
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  Database & Persistence Configuration
                </h3>
                <p className="text-xs text-[#B8B8B8]">
                  How metadata is stored across sessions and Vercel deployments.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono leading-relaxed text-[#B8B8B8]">
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-2">
                <div className="text-white font-bold uppercase tracking-wider">Neon PostgreSQL Database</div>
                <p>
                  Connected to Vercel Neon DB. All video showreels, design showcases, social accounts, and admin edits are permanently stored in your PostgreSQL database tables.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
