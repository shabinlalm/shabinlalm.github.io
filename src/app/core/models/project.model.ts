export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  challenges: string[];
  screenshots: string[];
  thumbnail: string;
  category: string;
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}
