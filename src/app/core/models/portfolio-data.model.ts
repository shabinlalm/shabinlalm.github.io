import { Certification } from './certification.model';
import { ContactInfo } from './contact.model';
import { Experience } from './experience.model';
import { Profile } from './profile.model';
import { Project } from './project.model';
import { Skill } from './skill.model';

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  contact: ContactInfo;
}
