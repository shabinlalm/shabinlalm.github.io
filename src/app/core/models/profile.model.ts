export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  introduction: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
  careerHighlights: string[];
}
