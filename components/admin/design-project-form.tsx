'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DesignProject } from '@/lib/types';
import { Palette, Link as LinkIcon, Upload, Save, X, AlertCircle } from 'lucide-react';

interface DesignProjectFormProps {
  projectToEdit?: DesignProject | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DesignProjectForm({ projectToEdit, onSuccess, onCancel }: DesignProjectFormProps) {
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [brandName, setBrandName] = useState(projectToEdit?.brandName || '');
  const [imageUrl, setImageUrl] = useState(projectToEdit?.imageUrl || '');
  const [behanceLink, setBehanceLink] = useState(projectToEdit?.behanceLink || 'https://www.behance.net');
  const [displayOrder, setDisplayOrder] = useState(projectToEdit?.displayOrder ?? 1);
  const [hidden, setHidden] = useState(projectToEdit?.hidden ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    if (!title.trim() || !brandName.trim() || !imageUrl.trim() || !behanceLink.trim()) {
      setErrorMsg('Please fill in all required fields and upload an image.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        id: projectToEdit?.id,
        title: title.trim(),
        brandName: brandName.trim(),
        imageUrl: imageUrl.trim(),
        behanceLink: behanceLink.trim(),
        displayOrder,
        hidden,
      };

      const res = await fetch('/api/admin/design-projects', {
        method: projectToEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save design project.');
      }

      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#101010] border border-[#171717] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#171717]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF3030]/10 border border-[#FF3030]/30 text-[#FF3030] flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
              {projectToEdit ? 'Edit Design / Behance Project' : 'Add New Design Project'}
            </h3>
            <p className="text-xs text-[#B8B8B8]">
              Upload image directly and link to Behance.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl bg-[#171717] hover:bg-[#262626] text-[#B8B8B8] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-[#A90F20]/20 border border-[#A90F20] text-white text-xs">
          <AlertCircle className="w-5 h-5 text-[#FF3030] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Identity"
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Vortex Esports"
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Image File Upload */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
            <Upload className="w-3.5 h-3.5 inline mr-1 text-[#FF3030]" />
            Upload Design Image * (Max 5MB)
          </label>

          <div className="flex items-center gap-4">
            <label className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#262626] hover:border-[#FF3030]/60 rounded-xl bg-[#050505] cursor-pointer transition-colors group">
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8B8B8] group-hover:text-white">
                <Upload className="w-5 h-5 text-[#FF3030]" />
                <span>Click to browse or drop image file</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>

            {imageUrl && (
              <div className="w-20 h-20 rounded-xl border border-[#262626] overflow-hidden relative shrink-0 bg-black">
                <Image src={imageUrl} alt="Preview" fill unoptimized className="object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Behance Link */}
        <div>
          <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
            <LinkIcon className="w-3.5 h-3.5 inline mr-1 text-[#FF3030]" />
            Behance / External Link *
          </label>
          <input
            type="url"
            required
            value={behanceLink}
            onChange={(e) => setBehanceLink(e.target.value)}
            placeholder="https://www.behance.net/gallery/..."
            className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Display Order */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Hidden Toggle */}
          <div className="flex items-center pt-7">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="w-5 h-5 rounded bg-[#050505] border border-[#262626] text-[#FF3030] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-mono text-[#B8B8B8] uppercase tracking-wider">
                Hide from Public Site
              </span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#171717]">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,48,48,0.3)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Design Project</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
