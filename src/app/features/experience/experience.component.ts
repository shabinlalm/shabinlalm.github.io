import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [
    DatePipe,
    TimelineModule,
    TagModule,
    CardModule,
    ScrollAnimateDirective,
    PageHeroComponent,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly portfolioService = inject(PortfolioService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Experience',
      description: 'Professional work experience timeline for Jordan Mitchell, Senior Software Engineer.',
      keywords: 'experience, career, software engineer, work history',
    });
    this.portfolioService.loadPortfolio().subscribe();
  }
}
