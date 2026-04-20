import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * SSR render mode per route (prerender for all paths here).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
