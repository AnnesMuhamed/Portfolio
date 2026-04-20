import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

/**
 * Bootstraps the Angular application in the SSR/server context.
 * @param context - Angular bootstrap context
 * @returns Promise that resolves when the app is running
 */
const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

export default bootstrap;
