import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

/**
 * Additional providers used only for server-side rendering (SSR).
 */
const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
};

/**
 * Merged browser and server configuration for SSR builds.
 */
export const config = mergeApplicationConfig(appConfig, serverConfig);
