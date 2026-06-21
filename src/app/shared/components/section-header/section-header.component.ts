import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  standalone: true,
  template: `
    <header class="section-header" [attr.aria-labelledby]="titleId()">
      @if (eyebrow()) {
        <span class="section-header__eyebrow">{{ eyebrow() }}</span>
      }
      <h2 class="section-header__title" [id]="titleId()">{{ title() }}</h2>
      @if (description()) {
        <p class="section-header__description">{{ description() }}</p>
      }
    </header>
  `,
})
export class SectionHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly titleId = input<string>('section-title');
}
