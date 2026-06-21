import { Component, input } from '@angular/core';
import { SocialLink } from '../../../core/models/profile.model';

@Component({
  selector: 'app-social-links',
  standalone: true,
  template: `
    <nav class="social-links" [attr.aria-label]="ariaLabel()">
      @for (link of links(); track link.url) {
        <a
          class="social-links__item"
          [href]="link.url"
          target="_blank"
          rel="noopener noreferrer"
          [attr.aria-label]="link.label"
        >
          <i [class]="link.icon" aria-hidden="true"></i>
        </a>
      }
    </nav>
  `,
  styles: `
    .social-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .social-links__item {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 9999px;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 1.125rem;
      transition: all 0.25s ease;

      &:hover {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: white;
        transform: translateY(-2px);
      }

      &:focus-visible {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
      }
    }
  `,
})
export class SocialLinksComponent {
  readonly links = input<SocialLink[]>([]);
  readonly ariaLabel = input<string>('Social media links');
}
