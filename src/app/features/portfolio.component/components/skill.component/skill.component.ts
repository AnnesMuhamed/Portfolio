import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  NgZone,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Skills section with a responsive layout signal (narrow "learning" layout at max-width 1024px).
 */
@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss',
})
export class SkillComponent {
  protected readonly narrowLearningLayout = signal(false);

  private readonly platformId = inject(PLATFORM_ID);

  /**
   * After first render, registers a media query listener and cleans up on destroy.
   */
  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const mq = window.matchMedia('(max-width: 1024px)');
    const onChange = () => this.runNarrowLayoutSyncInZone(zone, mq);

    afterNextRender(() => {
      this.syncNarrowLayoutFromMedia(mq);
      mq.addEventListener('change', onChange);
    });

    destroyRef.onDestroy(() => mq.removeEventListener('change', onChange));
  }

  /**
   * Updates `narrowLearningLayout` from the media query `matches` flag.
   * @param mq - Breakpoint query (max width 1024px)
   */
  private syncNarrowLayoutFromMedia(mq: MediaQueryList): void {
    this.narrowLearningLayout.set(mq.matches);
  }

  /**
   * Runs layout sync inside the Angular zone (for media `change` events).
   * @param zone - Injected `NgZone`
   * @param mq - Same media query instance used at setup
   */
  private runNarrowLayoutSyncInZone(zone: NgZone, mq: MediaQueryList): void {
    zone.run(() => this.syncNarrowLayoutFromMedia(mq));
  }

  /**
   * Smooth-scrolls to the contact section.
   */
  scrollToContact(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
