import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';

/**
 * Privacy policy page with shared header and footer.
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [Header, Footer, TranslatePipe],
  templateUrl: './privacy-policy.component.html',
  styleUrl: '../legal-pages.shared.scss',
})
export class PrivacyPolicyComponent {}
