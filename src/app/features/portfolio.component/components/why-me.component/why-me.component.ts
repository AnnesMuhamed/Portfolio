import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

/**
 * Single about item shown in the typewriter rotation.
 */
interface AboutItem {
  icon: string;
  textKey: string;
}

/**
 * "Why me" section with a typewriter animation over translated strings.
 */
@Component({
  selector: 'app-why-me',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './why-me.component.html',
  styleUrls: ['./why-me.component.scss'],
})
export class WhyMeComponent implements OnInit, OnDestroy {
  private readonly isBrowser: boolean;
  private langSub?: Subscription;
  private typeLoopGeneration = 0;

  items: AboutItem[] = [
    { icon: '/images/location.png', textKey: 'whyMe.typing.location' },
    { icon: '/images/remote.png', textKey: 'whyMe.typing.remote' },
    { icon: '/images/relocate.png', textKey: 'whyMe.typing.relocate' },
  ];

  currentIndex = 0;
  currentText = '';
  isDeleting = false;
  charIndex = 0;

  /**
   * @param platformId - Angular platform id
   * @param translate - Translation service for typewriter strings
   */
  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly translate: TranslateService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Starts the typewriter loop and subscribes to language changes (browser only).
   */
  ngOnInit(): void {
    if (this.isBrowser) {
      this.langSub = this.translate.onLangChange.subscribe(() => this.resetTypewriter());
      this.typeLoop();
    }
  }

  /**
   * Unsubscribes from language changes.
   */
  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  /**
   * Invalidates in-flight timeouts and restarts the typewriter from the first item.
   */
  private resetTypewriter(): void {
    this.typeLoopGeneration++;
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.charIndex = 0;
    this.typeLoop();
  }

  /**
   * Runs one typewriter step (type or delete) and schedules the next via `setTimeout`.
   */
  typeLoop(): void {
    const gen = this.typeLoopGeneration;
    const currentItem = this.items[this.currentIndex];
    const fullText = this.translate.instant(currentItem.textKey);

    if (!this.isDeleting) {
      this.charIndex++;
      this.currentText = fullText.substring(0, this.charIndex);

      if (this.charIndex >= fullText.length) {
        this.isDeleting = true;
        setTimeout(() => {
          if (gen !== this.typeLoopGeneration) return;
          this.typeLoop();
        }, 1500);
        return;
      }
    } else {
      this.charIndex--;
      this.currentText = fullText.substring(0, this.charIndex);

      if (this.charIndex <= 0) {
        this.isDeleting = false;
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
      }
    }

    const speed = this.isDeleting ? 40 : 80;
    setTimeout(() => {
      if (gen !== this.typeLoopGeneration) return;
      this.typeLoop();
    }, speed);
  }

  /**
   * Smooth-scrolls to the contact section.
   */
  scrollToContact(): void {
    if (!this.isBrowser) return;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
