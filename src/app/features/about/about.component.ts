import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ButtonModule,
    CardModule,
    ScrollAnimateDirective,
    PageHeroComponent,
    SectionHeaderComponent,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly portfolioService = inject(PortfolioService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'About',
      description:
        'Learn about Jordan Mitchell - Senior Software Engineer with expertise in Angular, .NET, and cloud architecture.',
      keywords: 'about, software engineer, experience, career',
    });
    this.portfolioService.loadPortfolio().subscribe();
  }
}
