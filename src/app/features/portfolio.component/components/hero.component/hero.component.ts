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

  /**
   * Creates the hero component and subscribes to language changes.
   * @param platformId Angular platform identifier.
   * @param translate Translation service instance.
   */
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly translate: TranslateService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentLang = this.translate.getCurrentLang() || 'en';
    this.langSub = this.translate.onLangChange.subscribe((e) => this.onTranslateLangChange(e));
  }

  /**
   * Updates the local language state after a translation change.
   * @param e Language change event.
   */
  private onTranslateLangChange(e: { lang: string }): void {
    this.currentLang = e.lang;
  }

  /**
   * Cleans up subscriptions and resets body scroll locking.
   */
  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.syncMenuBodyScrollLock(false);
  }

  /**
   * Toggles the mobile menu state and body scroll lock.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.syncMenuBodyScrollLock(this.menuOpen);
  }

  /**
   * Closes the mobile menu when the backdrop is clicked.
   * @param event Mouse event from the overlay.
   */
  onMobileMenuBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.menuOpen = false;
      this.syncMenuBodyScrollLock(false);
    }
  }

  /**
   * Switches the active UI language.
   * @param lang Target language code.
   * @param event Optional source event.
   */
  selectLanguage(lang: 'de' | 'en', event?: Event): void {
    event?.stopPropagation();
    this.translate.use(lang).subscribe();
  }

  /**
   * Smooth-scrolls to a section and closes the mobile menu.
   * @param id Target element id.
   * @param event Optional source event.
   */
  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    if (!this.isBrowser) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
    this.syncMenuBodyScrollLock(false);
  }

  /**
   * Applies or clears global scroll lock for the mobile menu.
   * @param locked Whether the page should be scroll-locked.
   */
  private syncMenuBodyScrollLock(locked: boolean): void {
    if (!this.isBrowser) {
      return;
    }
    const value = locked ? 'hidden' : '';
    document.body.style.overflow = value;
    document.documentElement.style.overflow = value;
  }
}
