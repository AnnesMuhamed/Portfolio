import { Component } from '@angular/core';
import { HeroComponent } from './components/hero.component/hero.component';


@Component({
  selector: 'app-portfolio.component',
  standalone: true,
  imports: [HeroComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})

export class PortfolioComponent {

}
