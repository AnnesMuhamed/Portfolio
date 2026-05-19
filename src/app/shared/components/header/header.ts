import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
   * Creates the header component and syncs the current language.
   * @param platformId Angular platform identifier.
   * @param translate Translation service instance.
   * @param router Angular router instance.
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
   * Updates the local language state after a translation change.
   * @param e Language change event.
   */
  private onTranslateLangChange(e: { lang: string }): void {
    this.currentLang = e.lang;
  }

  /**
   * Cleans up body scroll locking on destroy.
   */
  ngOnDestroy(): void {
    this.syncMenuBodyScrollLock(false);
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
   * Navigates to the hero section, including cross-route handling.
   * @param event Source click event.
   */
  goToHero(event: Event): void {
    event.preventDefault();
    if (!this.isBrowser) return;
    this.activeSection = '';
    this.menuOpen = false;
    this.syncMenuBodyScrollLock(false);
    const scroll = () =>
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    const path = this.router.url.split('#')[0];
    if (path === '/home' || path === '/') {
      scroll();
      return;
    }
    void this.router.navigate(['/home'], { fragment: 'hero' }).then(() => {
      setTimeout(scroll, 80);
    });
  }

  /**
   * Triggers hero navigation for keyboard activation.
   * @param event Keyboard event on the logo.
   */
  onLogoKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.goToHero(event);
  }

  /**
   * Navigates to a section and performs smooth scrolling.
   * @param id Target section id.
   * @param event Source click event.
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
   * Closes the mobile menu and resets body scroll lock.
   */
  closeMenu(): void {
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
