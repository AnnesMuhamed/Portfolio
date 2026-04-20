import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Logs an error thrown while bootstrapping the browser application.
 * @param err - Error from `bootstrapApplication`
 */
function reportBootstrapError(err: unknown): void {
  console.error(err);
}

bootstrapApplication(App, appConfig).catch(reportBootstrapError);
