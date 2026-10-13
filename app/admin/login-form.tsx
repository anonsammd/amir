'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Film, Lock, ShieldAlert, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Invalid credentials');
      }

      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid username or password.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      {/* Red Background Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-40" />

      <div className="w-full max-w-md bg-[#101010] border border-[#171717] rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FF3030] text-black flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,48,48,0.4)]">
            <Film className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            DOPEX<span className="text-[#FF3030]">CREATION</span>
          </h1>
          <p className="text-xs font-mono text-[#B8B8B8] uppercase tracking-widest mt-1">
            Studio Admin Portal Access
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-[#A90F20]/20 border border-[#A90F20] text-white text-xs">
            <ShieldAlert className="w-5 h-5 text-[#FF3030] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin Username"
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,48,48,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authenticate Session</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#171717] text-center text-[11px] font-mono text-[#B8B8B8]">
          Protected route. Environment variables set credentials.
        </div>
      </div>
    </div>
  );
}
