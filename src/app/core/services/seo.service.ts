import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoConfig } from '../models/seo.model';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  private readonly siteName = 'Jordan Mitchell | Software Engineer';
  private readonly defaultImage = '/assets/images/og-image.svg';

  updateSeo(config: SeoConfig): void {
    const fullTitle = config.title.includes('|') ? config.title : `${config.title} | Jordan Mitchell`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: config.description });

    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    const image = config.image ?? this.defaultImage;

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  setDefaultSeo(): void {
    this.updateSeo({
      title: this.siteName,
      description:
        'Senior Software Engineer specializing in Angular, .NET, and cloud-native applications. View projects, experience, and get in touch.',
      keywords: 'software engineer, angular developer, full stack, portfolio, web development',
    });
  }
}
