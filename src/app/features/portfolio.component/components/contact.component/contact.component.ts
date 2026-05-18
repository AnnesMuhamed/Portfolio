import { Component, Inject, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { trimmedEmail, trimmedMinLength } from './contact-validators';

/** Deploy `public/contact.php` to the site root next to `index.html` (e.g. All-Inkl). */
const CONTACT_ENDPOINT = '/contact.php';

type ContactPhpResponse = { ok: boolean; error?: string };

const SUCCESS_MESSAGE_HIDE_MS = 4000;
const ERROR_MESSAGE_HIDE_MS = 3000;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly isBrowser: boolean;
  /** Clears the auto-hide for the success banner. */
  private successHideTimerId?: number;
  /** Clears the auto-hide for the server error banner. */
  private errorHideTimerId?: number;

  /** Sichtbare Label (≥16px); keine Platzhalter-Doppelung zur gleichen Anschrift. */
  showPlaceholders = false;

  /** Alle Textvalidierungen nutzen intern trim(); Checkbox mit requiredTrue. */
  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [trimmedMinLength(2)]],
    email: ['', [trimmedEmail()]],
    message: ['', [trimmedMinLength(10)]],
    agree: [false, [Validators.requiredTrue]],
  });

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

  /** Nach blur: Control-Wert an trim() angleichen (einheitliche Normalisierung). */
  trimFieldBlur(field: 'name' | 'email' | 'message'): void {
    const c = this.contactForm.get(field);
    if (!c) return;
    const trimmed = String(c.value ?? '').trim();
    if (c.value !== trimmed) {
      c.setValue(trimmed);
    }
    c.markAsTouched({ onlySelf: true });
    c.updateValueAndValidity({ emitEvent: false });
  }

  /** Vor Submit & Payload: alle Textfelder trimmen, dann erst Validität prüfen. */
  private normalizeFormValues(): void {
    const v = this.contactForm.getRawValue();
    this.contactForm.patchValue(
      {
        name: v.name.trim(),
        email: v.email.trim(),
        message: v.message.trim(),
      },
      { emitEvent: false },
    );
    this.contactForm.controls.name.updateValueAndValidity({ emitEvent: false });
    this.contactForm.controls.email.updateValueAndValidity({ emitEvent: false });
    this.contactForm.controls.message.updateValueAndValidity({ emitEvent: false });
  }

  /** POST JSON `name`, `email`, `message` — same shape as `/api/contact` examples. */
  submitForm(): void {
    this.submitAttempted = true;
    this.submitSuccess = false;
    this.submitError = false;
    this.clearSuccessHideTimer();
    this.clearErrorHideTimer();

    this.normalizeFormValues();

    if (!this.contactForm.valid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (!this.isBrowser) {
      return;
    }

    const v = this.contactForm.getRawValue();
    const payload = {
      name: v.name,
      email: v.email,
      message: v.message,
    };

    this.submitting = true;

    this.http.post<ContactPhpResponse>(CONTACT_ENDPOINT, payload).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res?.ok) {
          this.submitSuccess = true;
          this.submitAttempted = false;
          this.contactForm.reset({
            name: '',
            email: '',
            message: '',
            agree: false,
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
