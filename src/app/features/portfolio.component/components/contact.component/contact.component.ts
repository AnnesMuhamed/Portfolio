import { Component, Inject, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

/** Must match `name` on the hidden form in `index.html` and Netlify form settings. */
const NETLIFY_FORM_NAME = 'portfolio-contact';

/**
 * Contact form with responsive placeholders; submits to Netlify Forms when hosted on Netlify.
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly isBrowser: boolean;
  private placeholderMq?: MediaQueryList;
  private placeholderMqListener?: () => void;

  showPlaceholders = false;

  /**
   * @param platformId - Platform id (SSR vs browser)
   */
  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Registers a media query for placeholder visibility at max-width 768px.
   */
  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    const mq = window.matchMedia('(max-width: 768px)');
    this.placeholderMqListener = () => this.syncPlaceholdersFromMediaQuery(mq);
    this.syncPlaceholdersFromMediaQuery(mq);
    mq.addEventListener('change', this.placeholderMqListener);
    this.placeholderMq = mq;
  }

  /**
   * Removes the media query listener.
   */
  ngOnDestroy(): void {
    if (this.placeholderMq && this.placeholderMqListener) {
      this.placeholderMq.removeEventListener('change', this.placeholderMqListener);
    }
  }

  /**
   * Copies `matches` from the media query into `showPlaceholders`.
   * @param mq - Mobile layout media query
   */
  private syncPlaceholdersFromMediaQuery(mq: MediaQueryList): void {
    this.showPlaceholders = mq.matches;
  }

  /**
   * Smooth-scrolls to the hero section.
   */
  scrollToHero(): void {
    if (!this.isBrowser) return;
    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
  }

  submitAttempted = false;
  submitting = false;
  submitSuccess = false;
  submitError = false;

  contactData = {
    name: '',
    email: '',
    message: '',
    agree: false
  };

  /** Netlify honeypot; must stay empty for humans. */
  netlifyHoneypot = '';

  /**
   * Validates the form and posts payload to the contact endpoint.
   * @param form - Template `NgForm` instance
   */
  submitForm(form: NgForm): void {
    this.submitAttempted = true;
    this.submitSuccess = false;
    this.submitError = false;

    if (!form.valid) {
      return;
    }

    const body = new HttpParams()
      .set('form-name', NETLIFY_FORM_NAME)
      .set('name', this.contactData.name.trim())
      .set('email', this.contactData.email.trim())
      .set('message', this.contactData.message.trim())
      .set('agree', 'on')
      .set('bot-field', this.netlifyHoneypot.trim());

    this.submitting = true;

    this.http
      .post('/', body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
        observe: 'response',
      })
      .subscribe({
        next: (res) => this.onNetlifySubmitNext(res.status, form),
        error: () => this.onContactSubmitError(),
      });
  }

  /**
   * Handles Netlify Forms POST: 2xx is treated as success.
   */
  private onNetlifySubmitNext(status: number, form: NgForm): void {
    this.submitting = false;
    if (status >= 200 && status < 300) {
      this.submitSuccess = true;
      this.submitAttempted = false;
      this.contactData = {
        name: '',
        email: '',
        message: '',
        agree: false
      };
      this.netlifyHoneypot = '';
      form.resetForm({
        name: '',
        email: '',
        message: '',
        agree: false
      });
    } else {
      this.submitError = true;
    }
  }

  /**
   * Sets error state after a failed or invalid request.
   */
  private onContactSubmitError(): void {
    this.submitting = false;
    this.submitError = true;
  }

}
