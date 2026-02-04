import { Component } from '@angular/core';
import { HeroComponent } from './components/hero.component/hero.component';
import { WhyMeComponent } from './components/why-me.component/why-me.component';
import { Header } from '../../shared/components/header/header';
@Component({
  selector: 'app-portfolio.component',
  standalone: true,
  imports: [HeroComponent, WhyMeComponent, Header],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})

export class PortfolioComponent {

}
