import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  template: `
    <section class="page-hero" [attr.aria-labelledby]="titleId()">
      <div class="container">
        @if (eyebrow()) {
          <span class="page-hero__eyebrow">{{ eyebrow() }}</span>
        }
        <h1 class="page-hero__title" [id]="titleId()">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-hero__subtitle">{{ subtitle() }}</p>
        }
      </div>
    </section>
  `,
  styles: `
    .page-hero__eyebrow {
      display: inline-block;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-primary);
      margin-bottom: 0.5rem;
    }
  `,
})
export class PageHeroComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly titleId = input<string>('page-title');
}
