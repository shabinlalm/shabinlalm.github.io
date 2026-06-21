import { Component, OnInit, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    ProgressBarModule,
    ScrollAnimateDirective,
    PageHeroComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly portfolioService = inject(PortfolioService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Skills',
      description:
        'Technical skills in frontend, backend, database, DevOps, and development tools.',
      keywords: 'skills, angular, typescript, dotnet, azure, devops',
    });
    this.portfolioService.loadPortfolio().subscribe();
  }

  getSkillCategories() {
    return this.portfolioService.getSkillCategories();
  }
}
