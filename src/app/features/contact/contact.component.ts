import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ScrollAnimateDirective } from '../../core/directives/scroll-animate.directive';
import { PortfolioService } from '../../core/services/portfolio.service';
import { SeoService } from '../../core/services/seo.service';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    ScrollAnimateDirective,
    PageHeroComponent,
  ],
  providers: [MessageService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly seoService = inject(SeoService);
  private readonly messageService = inject(MessageService);
  readonly portfolioService = inject(PortfolioService);

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly submitting = false;

  ngOnInit(): void {
    this.seoService.updateSeo({
      title: 'Contact',
      description: 'Get in touch with Jordan Mitchell for opportunities, collaborations, or inquiries.',
      keywords: 'contact, hire, software engineer, email',
    });
    this.portfolioService.loadPortfolio().subscribe();
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Message Sent',
      detail: 'Thank you for reaching out! I will get back to you soon.',
      life: 5000,
    });

    this.contactForm.reset();
  }

  isInvalid(field: 'name' | 'email' | 'subject' | 'message'): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
