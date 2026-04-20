import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Footer } from '../../shared/components/footer/footer';
import { Header } from '../../shared/components/header/header';

/**
 * Legal notice (Impressum) page with shared header and footer.
 */
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [Header, Footer, TranslatePipe],
  templateUrl: './legal-notice.component.html',
  styleUrl: '../legal-pages.shared.scss',
})
export class LegalNoticeComponent {}
