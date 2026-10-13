'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { parseYouTubeVideoId } from '@/lib/youtube';
import { YouTubeEmbed } from '../youtube-embed';
import { Check, Loader2, Video, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
  projectToEdit?: Project | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ProjectForm({ projectToEdit, onSuccess, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(projectToEdit?.title || '');
  const [youtubeUrl, setYoutubeUrl] = useState(projectToEdit?.youtubeUrl || '');
  const [category, setCategory] = useState(projectToEdit?.category || 'EVENT');
  const [description, setDescription] = useState(projectToEdit?.description || '');
  const [customThumbnail, setCustomThumbnail] = useState(projectToEdit?.customThumbnail || '');
  const [featured, setFeatured] = useState(projectToEdit?.featured ?? true);
  const [displayOrder, setDisplayOrder] = useState(projectToEdit?.displayOrder ?? 1);
  const [hidden, setHidden] = useState(projectToEdit?.hidden ?? false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Derive preview YouTube ID
  const parsedPreview = parseYouTubeVideoId(youtubeUrl);
  const previewVideoId = parsedPreview.videoId || '5E4q3_Lq328'; // fallback sample video ID for live preview

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setYoutubeUrl(projectToEdit.youtubeUrl);
      setCategory(projectToEdit.category);
      setDescription(projectToEdit.description || '');
      setCustomThumbnail(projectToEdit.customThumbnail || '');
      setFeatured(projectToEdit.featured);
      setDisplayOrder(projectToEdit.displayOrder);
      setHidden(projectToEdit.hidden);
    }
  }, [projectToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const parsed = parseYouTubeVideoId(youtubeUrl);
    if (!parsed.isValid || !parsed.videoId) {
      setErrorMsg('Please enter a valid YouTube URL or 11-character Video ID.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        id: projectToEdit?.id,
        title,
        youtubeUrl,
        youtubeId: parsed.videoId,
        category,
        description,
        customThumbnail,
        featured,
        displayOrder: Number(displayOrder),
        hidden,
      };

      const res = await fetch('/api/admin/projects', {
        method: projectToEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to save project.');
      }

      setSuccessMsg(projectToEdit ? 'Project updated successfully!' : 'Project added successfully!');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#101010] border border-[#171717] rounded-3xl p-6 sm:p-8">
      {/* Form Controls Column */}
      <div className="lg:col-span-7">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#171717]">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">
            {projectToEdit ? 'Edit Showreel Project' : 'Add New Showreel Project'}
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
          {/* Project Title */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Festival Recap 2025"
              className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* YouTube Link / ID */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              YouTube Video Link / Shorts URL / Video ID *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/shorts/5E4q3_Lq328"
                className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#B8B8B8] mt-1 font-mono">
              Supports shorts, watch links, embed links, or raw 11-char video IDs.
            </p>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
                Category *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value.toUpperCase())}
                placeholder="EVENT, CINEMATIC, CAMPUS..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors uppercase font-mono"
              />
            </div>

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
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Short Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of edit style, audio design, or color grading..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Custom Poster Image URL */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
              Custom Poster Image URL (Optional)
            </label>
            <input
              type="url"
              value={customThumbnail}
              onChange={(e) => setCustomThumbnail(e.target.value)}
              placeholder="https://images.unsplash.com/... or /images/..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#FF3030] rounded"
              />
              <span>Featured Project</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-white">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="w-4 h-4 accent-[#FF3030] rounded"
              />
              <span className="flex items-center gap-1">
                {hidden ? <EyeOff className="w-3.5 h-3.5 text-[#FF3030]" /> : <Eye className="w-3.5 h-3.5 text-green-400" />}
                {hidden ? 'Hidden from Public Site' : 'Visible Publicly'}
              </span>
            </label>
          </div>

          {/* Submit */}
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
                  <span>Save Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Column */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-[#FF3030] uppercase tracking-wider flex items-center gap-1.5">
            <Video className="w-4 h-4" />
            Live 9:16 Card Preview
          </span>
          <span className="text-[10px] font-mono text-[#B8B8B8]">Real-time rendering</span>
        </div>

        {/* Card Component Preview */}
        <div className="w-full max-w-[280px]">
          <div className="bg-[#101010] border border-[#262626] rounded-2xl p-3 shadow-2xl">
            <div className="w-full mb-3">
              <YouTubeEmbed
                videoId={previewVideoId}
                title={title || 'Sample Showreel Title'}
                customThumbnail={customThumbnail}
                autoPlayOnClick={false}
              />
            </div>
            <div className="px-1 pb-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-[#FF3030] tracking-wider">
                  01 / {(category || 'CATEGORY').toUpperCase()}
                </span>
                {featured && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF3030]/10 border border-[#FF3030]/30 text-[8px] font-mono text-[#FF3030]">
                    FEATURED
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-1">
                {title || 'Sample Title'}
              </h4>
              <p className="text-[11px] text-[#B8B8B8] line-clamp-2">
                {description || 'Project description will appear here...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
