import { Route } from '@angular/router';
import { PortfolioComponent } from './features/portfolio.component/portfolio.component';
import { WhyMeComponent } from './features/portfolio.component/components/why-me.component/why-me.component';
import { ProjectsComponent } from './features/portfolio.component/components/projects.component/projects.component';
import { ContactComponent } from './features/portfolio.component/components/contact.component/contact.component';

export const routes: Route[] = [
  { path: 'home', component: PortfolioComponent },
  { path: 'why-me', component: WhyMeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

