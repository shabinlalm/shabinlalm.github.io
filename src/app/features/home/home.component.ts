import { SlicePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SlicePipe,
    RouterLink,
    ButtonModule,
    CardModule,
    TagModule,
    ScrollAnimateDirective,
    SectionHeaderComponent,
    SocialLinksComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly portfolioService = inject(PortfolioService);

  ngOnInit(): void {
    this.seoService.setDefaultSeo();
    this.portfolioService.loadPortfolio().subscribe();
  }
}
