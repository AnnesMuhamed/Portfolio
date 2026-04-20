import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  ApplicationConfig,
  DOCUMENT,
  PLATFORM_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { provideTranslateService, TranslateService, TranslationObject } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import de from './i18n/de.json';
import en from './i18n/en.json';

const LANG_STORAGE_KEY = 'portfolio-lang';

/**
 * Registers translations, sets the fallback language, and applies the active language
 * (including `document.documentElement.lang` and optional `localStorage`).
 * @returns Promise that completes once the initial language is active
 */
function initializeI18n(): Promise<unknown> {
  const translate = inject(TranslateService);
  const doc = inject(DOCUMENT);
  const platformId = inject(PLATFORM_ID);
  translate.setTranslation('en', en as TranslationObject);
  translate.setTranslation('de', de as TranslationObject);
  translate.addLangs(['en', 'de']);
  translate.setFallbackLang('en');
  translate.onLangChange.subscribe((e) => {
    doc.documentElement.lang = e.lang;
    if (isPlatformBrowser(platformId)) {
      localStorage.setItem(LANG_STORAGE_KEY, e.lang);
    }
  });
  let lang: 'en' | 'de' = 'en';
  if (isPlatformBrowser(platformId)) {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'de' || saved === 'en') lang = saved;
  }
  return firstValueFrom(translate.use(lang));
}

/**
 * Central browser application configuration (router, hydration, HTTP, i18n).
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    ...provideTranslateService({ fallbackLang: 'en' }),
    provideAppInitializer(initializeI18n),
  ],
};
