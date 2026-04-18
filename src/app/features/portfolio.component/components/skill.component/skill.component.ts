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

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss',
})
export class SkillComponent {
  /** ≤1024px: Referenz-Layout wie Screenshot (Spalte + Text | Kreis). */
  protected readonly narrowLearningLayout = signal(false);

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    const zone = inject(NgZone);
    const destroyRef = inject(DestroyRef);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const mq = window.matchMedia('(max-width: 1024px)');
    const sync = () => this.narrowLearningLayout.set(mq.matches);
    const onChange = () => zone.run(sync);

    afterNextRender(() => {
      sync();
      mq.addEventListener('change', onChange);
    });

    destroyRef.onDestroy(() => mq.removeEventListener('change', onChange));
  }

  scrollToContact(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}
