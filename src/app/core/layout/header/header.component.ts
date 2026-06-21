import { Component, ViewEncapsulation, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { filter } from 'rxjs';
import { ThemeService } from '../../../core/services/theme.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule, DrawerModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  private readonly router = inject(Router);
  readonly themeService = inject(ThemeService);

  readonly mobileMenuOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: 'pi pi-home' },
    { label: 'About', path: '/about', icon: 'pi pi-user' },
    { label: 'Skills', path: '/skills', icon: 'pi pi-code' },
    { label: 'Projects', path: '/projects', icon: 'pi pi-briefcase' },
    { label: 'Experience', path: '/experience', icon: 'pi pi-history' },
    { label: 'Certifications', path: '/certifications', icon: 'pi pi-verified' },
    { label: 'Contact', path: '/contact', icon: 'pi pi-envelope' },
  ];

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.mobileMenuOpen.set(false);
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
