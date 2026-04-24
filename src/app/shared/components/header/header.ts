import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

/**
 * Global header: logo, section navigation, language switcher, and mobile menu.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnDestroy {
  currentLang = 'en';
  activeSection = '';
  menuOpen = false;
  private readonly isBrowser: boolean;

  /**
   * @param platformId - Angular platform id
   * @param translate - Translation service
   * @param router - Router for navigating to home with a fragment
   */
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly translate: TranslateService,
    private readonly router: Router,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentLang = this.translate.getCurrentLang() || 'en';
    this.translate.onLangChange.subscribe((e) => this.onTranslateLangChange(e));
  }

  /**
   * Keeps `currentLang` in sync with ngx-translate.
   * @param e - Language change event from ngx-translate
   */
  private onTranslateLangChange(e: { lang: string }): void {
    this.currentLang = e.lang;
  }

  /**
   * Releases body scroll lock when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.syncMenuBodyScrollLock(false);
  }

  /**
   * Changes the active translation.
   * @param lang - Target language
   * @param event - Optional event (stopPropagation)
   */
  selectLanguage(lang: 'de' | 'en', event?: Event): void {
    event?.stopPropagation();
    this.translate.use(lang).subscribe();
  }

  /**
   * Navigates to `/home` if needed, then scrolls to the section `id`.
   * @param id - Section id on the home page
   * @param event - Link click event (`preventDefault`)
   */
  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    this.activeSection = id;
    this.menuOpen = false;
    this.syncMenuBodyScrollLock(false);
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    const path = this.router.url.split('#')[0];
    if (path === '/home' || path === '/') {
      scroll();
      return;
    }
    void this.router.navigate(['/home'], { fragment: id }).then(() => {
      setTimeout(scroll, 80);
    });
  }

  /**
   * Toggles the mobile overlay menu (same interaction model as the hero burger).
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.syncMenuBodyScrollLock(this.menuOpen);
  }

  /**
   * Closes the menu when tapping the dimmed backdrop.
   */
  onMobileMenuBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.menuOpen = false;
      this.syncMenuBodyScrollLock(false);
    }
  }

  /**
   * Closes the mobile menu.
   */
  closeMenu(): void {
    this.menuOpen = false;
    this.syncMenuBodyScrollLock(false);
  }

  /**
   * Toggles `overflow` on `body` and `documentElement` while the mobile menu is open.
   * @param locked - When `true`, hides overflow; when `false`, restores default scrolling
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
