import { Component, Inject, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { trimmedEmail, trimmedMinLength } from './contact-validators';

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
  private successHideTimerId?: number;
  private errorHideTimerId?: number;

  showPlaceholders = false;

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', [trimmedMinLength(2)]],
    email: ['', [trimmedEmail()]],
    message: ['', [trimmedMinLength(10)]],
    agree: [false, [Validators.requiredTrue]],
  });

  /**
   * Creates the contact component and detects browser runtime.
   * @param platformId Angular platform identifier.
   */
  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Clears running timers during component teardown.
   */
  ngOnDestroy(): void {
    this.clearSuccessHideTimer();
    this.clearErrorHideTimer();
  }

  /**
   * Clears the success banner auto-hide timer.
   */
  private clearSuccessHideTimer(): void {
    if (this.successHideTimerId !== undefined) {
      window.clearTimeout(this.successHideTimerId);
      this.successHideTimerId = undefined;
    }
  }

  /**
   * Schedules automatic hiding of the success banner.
   */
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

  /**
   * Clears the error banner auto-hide timer.
   */
  private clearErrorHideTimer(): void {
    if (this.errorHideTimerId !== undefined) {
      window.clearTimeout(this.errorHideTimerId);
      this.errorHideTimerId = undefined;
    }
  }

  /**
   * Schedules automatic hiding of the error banner.
   */
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

  /**
   * Trims and normalizes a field value when it loses focus.
   * @param field Form field name.
   */
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

  /**
   * Normalizes all text fields before validation and submit.
   */
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

  /**
   * Submits the contact payload and updates UI feedback state.
   */
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
