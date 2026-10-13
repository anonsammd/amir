export interface Project {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  category: string;
  description?: string;
  customThumbnail?: string;
  featured: boolean;
  displayOrder: number;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  name: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'other' | string;
  handle?: string;
  description?: string;
  profileImage?: string;
  link: string;
  displayOrder: number;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budgetRange?: string;
  message: string;
}

export interface ManifestData {
  projects: Project[];
  accounts: SocialAccount[];
}
