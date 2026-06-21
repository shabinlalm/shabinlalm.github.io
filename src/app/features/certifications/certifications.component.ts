import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [DatePipe, ButtonModule, CardModule, ScrollAnimateDirective, PageHeroComponent],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.scss',
})
export class CertificationsComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly portfolioService = inject(PortfolioService);

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Certifications',
      description: 'Professional certifications in Azure, AWS, Scrum, and Angular development.',
      keywords: 'certifications, azure, aws, scrum, angular',
    });
    this.portfolioService.loadPortfolio().subscribe();
  }
}
