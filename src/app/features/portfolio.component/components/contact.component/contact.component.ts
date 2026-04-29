import { Component, Inject, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

/** Deploy `public/contact.php` to the site root next to `index.html` (e.g. All-Inkl). */
const CONTACT_ENDPOINT = '/contact.php';

type ContactPhpResponse = { ok: boolean; error?: string };

const SUCCESS_MESSAGE_HIDE_MS = 4000;

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
  /** Clears the auto-hide for the success banner. */
  private successHideTimerId?: number;

  showPlaceholders = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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

  ngOnDestroy(): void {
    if (this.placeholderMq && this.placeholderMqListener) {
      this.placeholderMq.removeEventListener('change', this.placeholderMqListener);
    }
    this.clearSuccessHideTimer();
  }

  private clearSuccessHideTimer(): void {
    if (this.successHideTimerId !== undefined) {
      window.clearTimeout(this.successHideTimerId);
      this.successHideTimerId = undefined;
    }
  }

  private scheduleSuccessMessageHide(): void {
    this.clearSuccessHideTimer();
    if (!this.isBrowser) {
      return;
    }
    this.successHideTimerId = window.setTimeout(() => {
      this.submitSuccess = false;
      this.successHideTimerId = undefined;
    }, SUCCESS_MESSAGE_HIDE_MS);
  }

  private syncPlaceholdersFromMediaQuery(mq: MediaQueryList): void {
    this.showPlaceholders = mq.matches;
  }

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

  /** POST JSON `name`, `email`, `message` — same shape as `/api/contact` examples. */
  submitForm(form: NgForm): void {
    this.submitAttempted = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.clearSuccessHideTimer();

    if (!form.valid) {
      return;
    }

    if (!this.isBrowser) {
      return;
    }

    const payload = {
      name: this.contactData.name.trim(),
      email: this.contactData.email.trim(),
      message: this.contactData.message.trim(),
    };

    this.submitting = true;

    this.http.post<ContactPhpResponse>(CONTACT_ENDPOINT, payload).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res?.ok) {
          this.submitSuccess = true;
          this.submitAttempted = false;
          this.contactData = {
            name: '',
            email: '',
            message: '',
            agree: false
          };
          form.resetForm({
            name: '',
            email: '',
            message: '',
            agree: false
          });
          this.scheduleSuccessMessageHide();
        } else {
          this.submitError = true;
        }
      },
      error: () => {
        this.submitting = false;
        this.submitError = true;
      },
    });
  }
}
