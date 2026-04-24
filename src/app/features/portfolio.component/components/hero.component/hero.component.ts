import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * Hero section with navigation, language switcher, and mobile menu (body scroll lock when open).
 */
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
   * @param platformId - Angular platform id (browser vs server)
   * @param translate - ngx-translate service for language changes
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
   * Updates the displayed language when ngx-translate switches locale.
   * @param e - Language change event from ngx-translate
   */
  private onTranslateLangChange(e: { lang: string }): void {
    this.currentLang = e.lang;
  }

  /**
   * Unsubscribes and releases menu scroll lock.
   */
  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.syncMenuBodyScrollLock(false);
  }

  /**
   * Toggles the mobile menu and syncs body scroll lock.
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.syncMenuBodyScrollLock(this.menuOpen);
  }

  /**
   * Closes the menu when the backdrop is clicked (not the menu panel).
   * @param event - Mouse event from the backdrop
   */
  onMobileMenuBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.menuOpen = false;
      this.syncMenuBodyScrollLock(false);
    }
  }

  /**
   * Switches the active UI language.
   * @param lang - Target language
   * @param event - Optional event (stops propagation)
   */
  selectLanguage(lang: 'de' | 'en', event?: Event): void {
    event?.stopPropagation();
    this.translate.use(lang).subscribe();
  }

  /**
   * Smooth-scrolls to the element with `id`, closes the menu, and clears scroll lock.
   * @param id - DOM id of the target element
   * @param event - Optional link click (`preventDefault`)
   */
  scrollTo(id: string, event?: Event): void {
    event?.preventDefault();
    if (!this.isBrowser) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
    this.syncMenuBodyScrollLock(false);
  }

  /**
   * Sets `overflow` on `body` and `documentElement` to lock background scroll when the menu is open.
   * @param locked - `true` to lock, `false` to restore
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
