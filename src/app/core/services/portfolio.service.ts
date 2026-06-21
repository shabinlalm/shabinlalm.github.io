import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, of, shareReplay, tap } from 'rxjs';
import { Certification } from '../models/certification.model';
import { ContactInfo } from '../models/contact.model';
import { Experience } from '../models/experience.model';
import { PortfolioData } from '../models/portfolio-data.model';
import { Profile } from '../models/profile.model';
import { Project } from '../models/project.model';
import { Skill, SkillCategory, SkillCategoryGroup } from '../models/skill.model';

const SKILL_CATEGORIES: { key: SkillCategory; label: string; icon: string }[] = [
  { key: 'frontend', label: 'Frontend', icon: 'pi pi-desktop' },
  { key: 'backend', label: 'Backend', icon: 'pi pi-server' },
  { key: 'database', label: 'Database', icon: 'pi pi-database' },
  { key: 'devops', label: 'DevOps', icon: 'pi pi-cloud' },
  { key: 'tools', label: 'Tools', icon: 'pi pi-wrench' },
];

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private readonly http = inject(HttpClient);

  readonly loading = signal(true);
  readonly profile = signal<Profile | null>(null);
  readonly skills = signal<Skill[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly experience = signal<Experience[]>([]);
  readonly certifications = signal<Certification[]>([]);
  readonly contact = signal<ContactInfo | null>(null);

  private data$: Observable<PortfolioData> | null = null;

  loadPortfolio(): Observable<PortfolioData> {
    if (!this.data$) {
      this.loading.set(true);
      this.data$ = this.http.get<PortfolioData>('/assets/data/portfolio.json').pipe(
        tap((data) => this.setData(data)),
        catchError(() => {
          this.loading.set(false);
          return of({} as PortfolioData);
        }),
        shareReplay(1),
      );
    }
    return this.data$;
  }

  getSkillCategories(): SkillCategoryGroup[] {
    const skills = this.skills();
    return SKILL_CATEGORIES.map((category) => ({
      ...category,
      skills: skills.filter((skill) => skill.category === category.key),
    })).filter((group) => group.skills.length > 0);
  }

  getProjectCategories(): string[] {
    const categories = new Set(this.projects().map((p) => p.category));
    return ['All', ...Array.from(categories).sort()];
  }

  private setData(data: PortfolioData): void {
    this.profile.set(data.profile);
    this.skills.set(data.skills ?? []);
    this.projects.set(data.projects ?? []);
    this.experience.set(data.experience ?? []);
    this.certifications.set(data.certifications ?? []);
    this.contact.set(data.contact);
    this.loading.set(false);
  }
}
