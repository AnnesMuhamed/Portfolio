import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnDestroy {
  menuOpen = false;
  currentLang = 'en';
  private readonly isBrowser: boolean;
  private langSub?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly translate: TranslateService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentLang = this.translate.getCurrentLang() || 'en';
    this.langSub = this.translate.onLangChange.subscribe((e) => {
      this.currentLang = e.lang;
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onMobileMenuBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.menuOpen = false;
    }
  }

  selectLanguage(lang: 'de' | 'en', event?: Event) {
    event?.stopPropagation();
    this.translate.use(lang).subscribe();
  }

  scrollTo(id: string, event?: Event) {
    event?.preventDefault();
    if (!this.isBrowser) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }
}
