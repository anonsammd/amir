'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project, SocialAccount } from '@/lib/types';
import { ProjectForm } from './project-form';
import { AccountForm } from './account-form';
import { GitHubIcon } from '../brand-icons';
import {
  Film,
  Plus,
  Edit2,
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
  initialAccounts: SocialAccount[];
}

export function AdminDashboard({ initialProjects, initialAccounts }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'accounts' | 'status'>('projects');

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      const [pRes, aRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/accounts'),
      ]);
      const pJson = await pRes.json();
      const aJson = await aRes.json();

      if (pJson.projects) setProjects(pJson.projects);
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

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider transition-colors border border-[#262626]"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF3030]" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF3030]/10 hover:bg-[#FF3030] text-[#FF3030] hover:text-white border border-[#FF3030]/30 text-xs font-mono uppercase font-bold tracking-wider transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {statusMsg && (
          <div className="mb-6 p-3 rounded-xl bg-[#101010] border border-[#FF3030]/40 text-xs text-[#FF3030] font-mono flex items-center justify-between">
            <span>{statusMsg}</span>
            <button type="button" onClick={() => setStatusMsg(null)} className="text-[#B8B8B8] hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#101010] border border-[#171717] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">Total Showreels</div>
              <div className="text-3xl font-black text-white mt-1">{projects.length}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center text-[#FF3030]">
              <Film className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-[#101010] border border-[#171717] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">Active Public Items</div>
              <div className="text-3xl font-black text-white mt-1">
                {projects.filter((p) => !p.hidden).length + accounts.filter((a) => !a.hidden).length}
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
        <div className="flex items-center gap-3 border-b border-[#171717] pb-4 mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects');
              setIsAddingProject(false);
              setEditingProject(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717]'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Showreels ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('accounts');
              setIsAddingAccount(false);
              setEditingAccount(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
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
            className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-2 ${
              activeTab === 'status'
                ? 'bg-[#FF3030] text-white shadow-[0_0_15px_rgba(255,48,48,0.3)]'
                : 'bg-[#101010] text-[#B8B8B8] hover:text-white border border-[#171717]'
            }`}
          >
            <GitHubIcon className="w-4 h-4" />
            <span>Persistence & Config</span>
          </button>
        </div>

        {/* Tab 1: Projects Management */}
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
                    <h2 className="text-xl font-extrabold text-white uppercase tracking-tight">Showreel Edits</h2>
                    <p className="text-xs text-[#B8B8B8]">
                      Manage portfolio videos. Deletion is restricted; toggle visibility to hide items.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingProject(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,48,48,0.3)]"
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
                          className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
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
                          className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider border border-[#262626] transition-colors flex items-center gap-1.5"
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

        {/* Tab 2: Accounts Management */}
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
                    className="px-4 py-2.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,48,48,0.3)]"
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
                          className={`p-2 rounded-lg border text-xs font-mono transition-colors ${
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
                          className="px-3.5 py-1.5 rounded-lg bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider border border-[#262626] transition-colors flex items-center gap-1.5"
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

        {/* Tab 3: Persistence Status */}
        {activeTab === 'status' && (
          <div className="bg-[#101010] border border-[#171717] rounded-3xl p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#171717]">
              <Sparkles className="w-6 h-6 text-[#FF3030]" />
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  GitHub & Local Persistence Configuration
                </h3>
                <p className="text-xs text-[#B8B8B8]">
                  How metadata is synced and stored across sessions.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono leading-relaxed text-[#B8B8B8]">
              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-2">
                <div className="text-white font-bold uppercase tracking-wider">GitHub API Sync Status</div>
                <p>
                  When <code className="text-[#FF3030]">GITHUB_TOKEN</code>, <code className="text-[#FF3030]">GITHUB_OWNER</code>, and <code className="text-[#FF3030]">GITHUB_REPO</code> are configured, every admin add/edit operation commits directly to your GitHub repository (<code className="text-white">data/projects.json</code> and <code className="text-white">data/accounts.json</code>) using optimistic concurrency protection.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-2">
                <div className="text-white font-bold uppercase tracking-wider">Local File Fallback</div>
                <p>
                  During local development or prior to setting up GitHub repository secrets, updates are written directly to local <code className="text-white">data/projects.json</code> and <code className="text-white">data/accounts.json</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#050505] border border-[#262626] space-y-2">
                <div className="text-white font-bold uppercase tracking-wider">No Deletion Safety Rule</div>
                <p>
                  As mandated by brand policy, portfolio records are never permanently deleted from the database. Instead, toggle the <code className="text-[#FF3030]">hidden</code> field to conceal items from public visitors without losing historical metadata.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
