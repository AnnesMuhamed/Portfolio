import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Heading block for legal pages: browser-back control and projected page title.
 */
@Component({
  selector: 'app-legal-page-masthead',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './legal-page-masthead.component.html',
  styleUrl: './legal-page-masthead.component.scss',
})
export class LegalPageMastheadComponent {
  private readonly location = inject(Location);

  /**
   * Navigates to the previous history entry (same as browser back).
   */
  goBack(): void {
    this.location.back();
  }
}
