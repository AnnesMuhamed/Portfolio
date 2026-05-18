import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HeroComponent } from './components/hero.component/hero.component';
import { Header } from '../../shared/components/header/header';
import { WhyMeComponent } from './components/why-me.component/why-me.component';
import { ProjectsComponent } from './components/projects.component/projects.component';
import { SkillComponent } from "./components/skill.component/skill.component";
import { ReferencesComponent } from './components/references/references';
import { ContactComponent } from "./components/contact.component/contact.component";
import { Footer } from "../../shared/components/footer/footer";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [HeroComponent, Header, WhyMeComponent, ProjectsComponent, SkillComponent, ReferencesComponent, ContactComponent, Footer],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})

export class PortfolioComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('portfolioRoot')
  portfolioRootRef?: ElementRef<HTMLElement>;

  @ViewChild('siteHeader', { read: ElementRef })
  headerRef?: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;

  private mediaQuery?: MediaQueryList;

  private onMediaChange?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = this.portfolioRootRef?.nativeElement;
    const headerHost = this.headerRef?.nativeElement;
    if (!root || !headerHost) return;

    const mq = window.matchMedia('(max-width: 768px)');
    this.mediaQuery = mq;

    const apply = () => {
      if (mq.matches) {
        root.style.setProperty('--portfolio-header-h', '0px');
        return;
      }
      const h = Math.ceil(headerHost.getBoundingClientRect().height);
      root.style.setProperty('--portfolio-header-h', `${Math.max(h, 1)}px`);
    };

    this.onMediaChange = () => apply();
    mq.addEventListener('change', this.onMediaChange);

    apply();
    requestAnimationFrame(() => apply());

    this.resizeObserver = new ResizeObserver(() => apply());
    this.resizeObserver.observe(headerHost);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();

    if (this.mediaQuery && this.onMediaChange) {
      this.mediaQuery.removeEventListener('change', this.onMediaChange);
    }
  }
}
