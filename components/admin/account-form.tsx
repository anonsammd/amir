'use client';

import { useState, useEffect } from 'react';
import { SocialAccount } from '@/lib/types';
import { Save, Loader2, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AccountFormProps {
  accountToEdit?: SocialAccount | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function AccountForm({ accountToEdit, onSuccess, onCancel }: AccountFormProps) {
  const [name, setName] = useState(accountToEdit?.name || '');
  const [platform, setPlatform] = useState(accountToEdit?.platform || 'instagram');
  const [handle, setHandle] = useState(accountToEdit?.handle || '');
  const [description, setDescription] = useState(accountToEdit?.description || '');
  const [link, setLink] = useState(accountToEdit?.link || '');
  const [displayOrder, setDisplayOrder] = useState(accountToEdit?.displayOrder ?? 1);
  const [hidden, setHidden] = useState(accountToEdit?.hidden ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (accountToEdit) {
      setName(accountToEdit.name);
      setPlatform(accountToEdit.platform);
      setHandle(accountToEdit.handle || '');
      setDescription(accountToEdit.description || '');
      setLink(accountToEdit.link);
      setDisplayOrder(accountToEdit.displayOrder);
      setHidden(accountToEdit.hidden);
    }
  }, [accountToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        id: accountToEdit?.id,
        name,
        platform,
        handle,
        description,
        link,
        displayOrder: Number(displayOrder),
        hidden,
      };

      const res = await fetch('/api/admin/accounts', {
        method: accountToEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save account.');
      }

      setSuccessMsg(accountToEdit ? 'Account updated successfully!' : 'Account added successfully!');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save account.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#101010] border border-[#171717] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#171717]">
        <h3 className="text-xl font-bold text-white uppercase tracking-tight">
          {accountToEdit ? 'Edit Social Channel' : 'Add New Social Channel'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-mono text-[#B8B8B8] hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-[#A90F20]/20 border border-[#A90F20] text-xs text-white">
          <AlertCircle className="w-4 h-4 text-[#FF3030] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3 mb-6 rounded-xl bg-[#FF3030]/20 border border-[#FF3030] text-xs text-white">
          <Check className="w-4 h-4 text-[#FF3030] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
            Brand / Account Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. DopexCreation Instagram"
            className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Platform *
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            >
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">X / Twitter</option>
              <option value="other">Other Platform</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Handle / Username
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. @dopexcreation"
              className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
            Channel Profile Link *
          </label>
          <input
            type="url"
            required
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://instagram.com/dopexcreation"
            className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short overview of edits published on this channel..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Display Order
            </label>
            <input
              type="number"
              min={1}
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors font-mono"
            />
          </div>

          <div className="pt-6">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="w-4 h-4 accent-[#FF3030] rounded"
              />
              <span className="flex items-center gap-1">
                {hidden ? <EyeOff className="w-3.5 h-3.5 text-[#FF3030]" /> : <Eye className="w-3.5 h-3.5 text-green-400" />}
                {hidden ? 'Hidden' : 'Visible Publicly'}
              </span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-[#171717] flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-bold uppercase transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,48,48,0.3)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Channel</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
