import { Component } from '@angular/core';
import { HeroComponent } from './components/hero.component/hero.component';
import { Header } from '../../shared/components/header/header';
import { WhyMeComponent } from './components/why-me.component/why-me.component';
import { ProjectsComponent } from './components/projects.component/projects.component';
import { SkillComponent } from "./components/skill.component/skill.component";



@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [HeroComponent, Header, WhyMeComponent, ProjectsComponent, SkillComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})

export class PortfolioComponent {

}
