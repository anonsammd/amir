'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Mail, MessageSquare, DollarSign, Film } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  projectType: z.string().min(1, 'Please select a project type'),
  budgetRange: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fallbackInfo, setFallbackInfo] = useState<string | null>(null);

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@dopexcreation.com';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: 'Short-Form Reel (9:16)',
      budgetRange: '$500 - $1,000',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    setFallbackInfo(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit inquiry.');
      }

      setSubmitSuccess(json.message || 'Thank you! Your message has been sent successfully.');
      if (json.fallbackMode) {
        setFallbackInfo(json.contactEmail || contactEmail);
      }
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try emailing directly.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#050505] relative overflow-hidden border-t border-[#171717]">
      {/* Background Red Glow Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-radial rounded-full pointer-events-none blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101010] border border-[#171717] mb-4">
            <Mail className="w-3.5 h-3.5 text-[#FF3030]" />
            <span className="text-xs font-mono font-medium tracking-widest text-[#B8B8B8] uppercase">
              LET&apos;S CONNECT
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            HAVE A PROJECT <span className="text-gradient-pure-red">IN MIND?</span>
          </h2>

          <p className="text-base sm:text-lg text-[#B8B8B8] font-normal leading-relaxed">
            Let&apos;s turn your footage into something worth watching.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-[#101010] border border-[#171717] rounded-3xl p-6 sm:p-10 shadow-2xl">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[#FF3030]/10 border border-[#FF3030]/30 text-[#FF3030] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
              <p className="text-sm text-[#B8B8B8] max-w-md mb-6">{submitSuccess}</p>
              {fallbackInfo && (
                <div className="p-4 rounded-xl bg-[#171717] border border-[#262626] text-xs text-[#B8B8B8] mb-6">
                  Direct Email: <a href={`mailto:${fallbackInfo}`} className="text-[#FF3030] font-bold underline">{fallbackInfo}</a>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSubmitSuccess(null)}
                className="px-6 py-2.5 rounded-full bg-[#171717] hover:bg-[#262626] text-white text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {submitError && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#A90F20]/20 border border-[#A90F20] text-white text-xs">
                  <AlertCircle className="w-5 h-5 text-[#FF3030] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">Submission Error</p>
                    <p className="text-[#B8B8B8]">{submitError}</p>
                    <p className="mt-2 text-[#B8B8B8]">
                      Or email directly at:{' '}
                      <a href={`mailto:${contactEmail}`} className="text-[#FF3030] underline font-mono font-bold">
                        {contactEmail}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
                  />
                  {errors.name && (
                    <p className="text-[11px] text-[#FF3030] mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-[#FF3030] mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Project Type Dropdown */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
                    <Film className="w-3.5 h-3.5 inline mr-1 text-[#FF3030]" />
                    Project Type *
                  </label>
                  <select
                    {...register('projectType')}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
                  >
                    <option value="Short-Form Reel (9:16)">Short-Form Reel (9:16)</option>
                    <option value="Event Recap Film">Event Recap Film</option>
                    <option value="YouTube Long-Form Edit">YouTube Long-Form Edit</option>
                    <option value="Brand / Commercial Ad">Brand / Commercial Ad</option>
                    <option value="Full Channel Management">Full Channel Editing</option>
                    <option value="Other Creative Work">Other Creative Work</option>
                  </select>
                  {errors.projectType && (
                    <p className="text-[11px] text-[#FF3030] mt-1">{errors.projectType.message}</p>
                  )}
                </div>

                {/* Budget Range Dropdown */}
                <div>
                  <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
                    <DollarSign className="w-3.5 h-3.5 inline mr-1 text-[#FF3030]" />
                    Budget Range (Optional)
                  </label>
                  <select
                    {...register('budgetRange')}
                    className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors"
                  >
                    <option value="< $500">Under $500</option>
                    <option value="$500 - $1,000">$500 - $1,000</option>
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000+">$3,000+</option>
                  </select>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#B8B8B8] uppercase tracking-wider mb-2">
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1 text-[#FF3030]" />
                  Project Overview *
                </label>
                <textarea
                  rows={4}
                  {...register('message')}
                  placeholder="Describe your footage, project scope, desired style, or deadline..."
                  className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-[#262626] focus:border-[#FF3030] text-white text-sm focus:outline-none transition-colors resize-none"
                />
                {errors.message && (
                  <p className="text-[11px] text-[#FF3030] mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#FF3030] hover:bg-[#A90F20] disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,48,48,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Project Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
