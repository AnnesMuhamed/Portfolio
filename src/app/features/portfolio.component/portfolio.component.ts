import { Component } from '@angular/core';
import { HeroComponent } from './components/hero.component/hero.component';
import { Header } from '../../shared/components/header/header';
import { WhyMeComponent } from './components/why-me.component/why-me.component';
import { ProjectsComponent } from './components/projects.component/projects.component';
import { SkillComponent } from "./components/skill.component/skill.component";
import { ReferencesComponent } from "./components/references/references"; 
import { ContactComponent } from "./components/contact.component/contact.component";



@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [HeroComponent, Header, WhyMeComponent, ProjectsComponent, SkillComponent, ReferencesComponent, ContactComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})

export class PortfolioComponent {

}
