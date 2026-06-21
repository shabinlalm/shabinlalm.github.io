import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { Project } from '../../core/models/project.model';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    ChipModule,
    DialogModule,
    GalleriaModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ScrollAnimateDirective,
    PageHeroComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly portfolioService = inject(PortfolioService);

  readonly searchQuery = signal('');
  readonly selectedCategory = signal('All');
  readonly selectedProject = signal<Project | null>(null);
  readonly dialogVisible = signal(false);
  readonly galleriaActiveIndex = signal(0);

  readonly categories = computed(() => this.portfolioService.getProjectCategories());

  readonly filteredProjects = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    let projects = this.portfolioService.projects();

    if (category !== 'All') {
      projects = projects.filter((p) => p.category === category);
    }

    if (query) {
      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query) ||
          p.technologies.some((t) => t.toLowerCase().includes(query)),
      );
    }

    return projects;
  });

  readonly categoryOptions = computed(() =>
    this.categories().map((c) => ({ label: c, value: c })),
  );

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Projects',
      description: 'Explore software engineering projects including enterprise portals, analytics dashboards, and more.',
      keywords: 'projects, portfolio, angular, enterprise, web applications',
    });
    this.portfolioService.loadPortfolio().subscribe();
  }

  openProject(project: Project): void {
    this.selectedProject.set(project);
    this.galleriaActiveIndex.set(0);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedProject.set(null);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
  }
}
