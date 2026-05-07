import { Component, Inject, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

/** Deploy `public/contact.php` to the site root next to `index.html` (e.g. All-Inkl). */
const CONTACT_ENDPOINT = '/contact.php';

type ContactPhpResponse = { ok: boolean; error?: string };

const SUCCESS_MESSAGE_HIDE_MS = 4000;
const ERROR_MESSAGE_HIDE_MS = 3000;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly isBrowser: boolean;
  /** Clears the auto-hide for the success banner. */
  private successHideTimerId?: number;
  /** Clears the auto-hide for the server error banner. */
  private errorHideTimerId?: number;

  /** Sichtbare Label (≥16px); keine Platzhalter-Doppelung zur gleichen Anschrift. */
  showPlaceholders = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnDestroy(): void {
    this.clearSuccessHideTimer();
    this.clearErrorHideTimer();
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

  private clearErrorHideTimer(): void {
    if (this.errorHideTimerId !== undefined) {
      window.clearTimeout(this.errorHideTimerId);
      this.errorHideTimerId = undefined;
    }
  }

  private scheduleErrorMessageHide(): void {
    this.clearErrorHideTimer();
    if (!this.isBrowser) {
      return;
    }
    this.errorHideTimerId = window.setTimeout(() => {
      this.submitError = false;
      this.errorHideTimerId = undefined;
    }, ERROR_MESSAGE_HIDE_MS);
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

  /**
   * Keine führenden Leerzeichen (Leertasten/Zeilenumbrüche) vor dem ersten sichtbaren Zeichen –
   * reine Spaces zählen damit auch nicht als „ausgefüllt“ bei der Validierung.
   */
  stripLeadingWhitespace(field: 'name' | 'email' | 'message', value: string): void {
    const next = value.trimStart();
    if (next !== value) {
      this.contactData[field] = next;
    }
  }

  /** POST JSON `name`, `email`, `message` — same shape as `/api/contact` examples. */
  submitForm(form: NgForm): void {
    this.submitAttempted = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.clearSuccessHideTimer();
    this.clearErrorHideTimer();

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
          this.scheduleErrorMessageHide();
        }
      },
      error: () => {
        this.submitting = false;
        this.submitError = true;
        this.scheduleErrorMessageHide();
      },
    });
  }
}
