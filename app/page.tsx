import { getProjects, getAccounts } from '@/lib/github-store';
import { SiteHeader } from '@/components/site-header';
import { HeroSection } from '@/components/hero-section';
import { ProjectsSection } from '@/components/projects-section';
import { AccountsSection } from '@/components/accounts-section';
import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';
import { SiteFooter } from '@/components/site-footer';
import { CinematicBackground } from '@/components/cinematic-background';
import { ScrollProgress } from '@/components/scroll-progress';
import { CursorSpotlight } from '@/components/cursor-spotlight';

export const metadata = {
  title: 'DopexCreation | Amir Saifi — Professional Video Editor',
  description:
    'Explore cinematic edits, event films, short-form reels, and creative video projects by Amir Saifi at DopexCreation.',
  openGraph: {
    title: 'DopexCreation | Amir Saifi — Professional Video Editor',
    description:
      'Explore cinematic edits, event films, short-form reels, and creative video projects by Amir Saifi at DopexCreation.',
    url: 'https://dopexcreation.com',
    siteName: 'DopexCreation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DopexCreation | Amir Saifi — Professional Video Editor',
    description:
      'Explore cinematic edits, event films, short-form reels, and creative video projects by Amir Saifi at DopexCreation.',
  },
};

// Revalidate public data every 60 seconds or on-demand
export const revalidate = 60;

export default async function HomePage() {
  const [projects, accounts] = await Promise.all([
    getProjects(false),
    getAccounts(false),
  ]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#FF3030] selection:text-white relative">
      <ScrollProgress />
      <CursorSpotlight />
      <CinematicBackground />
      <SiteHeader />
      <main className="flex-grow relative z-10">
        <HeroSection />
        <ProjectsSection initialProjects={projects} />
        <AccountsSection initialAccounts={accounts} />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
