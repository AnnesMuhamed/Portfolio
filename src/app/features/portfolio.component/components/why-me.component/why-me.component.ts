import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

interface AboutItem {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-why-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './why-me.component.html',
  styleUrls: ['./why-me.component.scss'],
})
export class WhyMeComponent implements OnInit {
  private readonly isBrowser: boolean;

  items: AboutItem[] = [
    { icon: '/images/location.png', text: 'located in Cologne...' },
    { icon: '/images/remote.png', text: 'open to work remote...' },
    { icon: '/images/relocate.png', text: 'open to relocate...' }
  ];

  currentIndex = 0;
  currentText = '';
  isDeleting = false;
  charIndex = 0;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) this.typeLoop();
  }

  typeLoop() {
  const currentItem = this.items[this.currentIndex];
  const fullText = currentItem.text;

  if (!this.isDeleting) {
    this.charIndex++;
    this.currentText = fullText.substring(0, this.charIndex);

    if (this.charIndex >= fullText.length) {
      this.isDeleting = true;
      setTimeout(() => this.typeLoop(), 1500);
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
  setTimeout(() => this.typeLoop(), speed);
}
}