import { Component, Inject, OnDestroy, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '@ngx-translate/core';

const CONTACT_ENDPOINT = '/contact.php';

type ContactApiResponse = { ok: boolean; error?: string };

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

  /** Platzhalter nur bei max. 768px Breite (sichtbar); darüber nur Labels. */
  showPlaceholders = false;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => {
      this.showPlaceholders = mq.matches;
    };
    update();
    mq.addEventListener('change', update);
    this.placeholderMq = mq;
    this.placeholderMqListener = update;
  }

  ngOnDestroy(): void {
    if (this.placeholderMq && this.placeholderMqListener) {
      this.placeholderMq.removeEventListener('change', this.placeholderMqListener);
    }
  }

  scrollToHero() {
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

  submitForm(form: NgForm) {
    this.submitAttempted = true;
    this.submitSuccess = false;
    this.submitError = false;

    if (!form.valid) {
      return;
    }

    const payload = {
      name: this.contactData.name.trim(),
      email: this.contactData.email.trim(),
      message: this.contactData.message.trim(),
    };

    this.submitting = true;

    this.http.post<ContactApiResponse>(CONTACT_ENDPOINT, payload).subscribe({
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
        } else {
          this.submitError = true;
        }
      },
      error: () => {
        this.submitting = false;
        this.submitError = true;
      }
    });
  }

}
