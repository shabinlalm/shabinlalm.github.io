export type SkillCategory = 'frontend' | 'backend' | 'database' | 'devops' | 'tools';

export interface Skill {
  name: string;
  category: SkillCategory;
  level: number;
  icon?: string;
}

export interface SkillCategoryGroup {
  key: SkillCategory;
  label: string;
  icon: string;
  skills: Skill[];
}
