export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  videoUrl?: string;
  client?: string;
  date?: string;
  link?: string;
  budget?: string;
  tags: string[];
}

export interface Review {
  id: string;
  name: string;
  text: string;
  rating: number;
  country: string;
  profilePic?: string;
  approved: boolean;
  date: string;
  featured: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  country: string;
  service: string;
  budget: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
}

export interface AdminSettings {
  aboutText: string;
  experience: string;
  clientsCount: string;
  countriesCount: string;
  contactPhone: string;
  contactTelegram: string;
  contactWhatsApp: string;
  profileImage?: string;
  // ID Card & Resume customizations
  cardName?: string;
  cardDesignation?: string;
  cardEmail?: string;
  cardLocation?: string;
  cardTwitter?: string;
  cardGithub?: string;
  cardInstagram?: string;
  cardLinkedin?: string;
  resumeAbout?: string;
  resumeSkills?: string;
  resumeExperience?: string;
  resumeProjects?: string;
  resumeEducation?: string;
  resumeCertifications?: string;
  resumeContact?: string;
  resumePdfUrl?: string;
  cardThemeColor?: string;
  cardBgStyle?: string;
  animationsEnabled?: boolean;
}

export interface AnalyticsData {
  totalViews: number;
  viewsByCountry: Record<string, number>;
  viewsByService: Record<string, number>;
  recentVisits: Array<{
    id: string;
    path: string;
    country: string;
    time: string;
  }>;
}
