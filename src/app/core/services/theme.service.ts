import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly theme = signal<ThemeMode>('light');

  initTheme(): void {
    if (!this.isBrowser) {
      return;
    }

    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: ThemeMode = stored ?? (prefersDark ? 'dark' : 'light');

    this.applyTheme(initial);
  }

  toggleTheme(): void {
    this.applyTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(mode: ThemeMode): void {
    this.applyTheme(mode);
  }

  private applyTheme(mode: ThemeMode): void {
    this.theme.set(mode);

    if (!this.isBrowser) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle('app-dark', mode === 'dark');
    root.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
}
