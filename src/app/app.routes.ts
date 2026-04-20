import { Route } from '@angular/router';
import { PortfolioComponent } from './features/portfolio.component/portfolio.component';
import { WhyMeComponent } from './features/portfolio.component/components/why-me.component/why-me.component';
import { ProjectsComponent } from './features/portfolio.component/components/projects.component/projects.component';
import { ContactComponent } from './features/portfolio.component/components/contact.component/contact.component';
import { LegalNoticeComponent } from './features/legal-notice.component/legal-notice.component';
import { PrivacyPolicyComponent } from './features/privacy-policy.component/privacy-policy.component';

/**
 * SPA routes: home, sections, contact, legal notice, and privacy policy.
 */
export const routes: Route[] = [
  { path: 'home', component: PortfolioComponent },
  { path: 'why-me', component: WhyMeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'legal-notice', component: LegalNoticeComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
