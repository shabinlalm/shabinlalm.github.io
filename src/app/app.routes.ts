import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
        title: 'Home',
        data: {
          seo: {
            title: 'Jordan Mitchell | Software Engineer',
            description: 'Senior Software Engineer portfolio showcasing projects, skills, and experience.',
          },
        },
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
        title: 'About',
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/skills/skills.component').then((m) => m.SkillsComponent),
        title: 'Skills',
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
        title: 'Projects',
      },
      {
        path: 'experience',
        loadComponent: () =>
          import('./features/experience/experience.component').then((m) => m.ExperienceComponent),
        title: 'Experience',
      },
      {
        path: 'certifications',
        loadComponent: () =>
          import('./features/certifications/certifications.component').then((m) => m.CertificationsComponent),
        title: 'Certifications',
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
        title: 'Contact',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
