import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

interface AboutItem {
  icon: string;
  textKey: string;
}

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

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private readonly translate: TranslateService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.langSub = this.translate.onLangChange.subscribe(() => this.resetTypewriter());
      this.typeLoop();
    }
  }

  ngOnDestroy() {
    this.langSub?.unsubscribe();
  }

  private resetTypewriter() {
    this.typeLoopGeneration++;
    this.currentIndex = 0;
    this.currentText = '';
    this.isDeleting = false;
    this.charIndex = 0;
    this.typeLoop();
  }

  typeLoop() {
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

  scrollToContact() {
    if (!this.isBrowser) return;
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
}