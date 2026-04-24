import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { type NextFunction, type Request, type Response } from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Forwards the request to the Angular SSR engine or calls Express `next` if unhandled.
 * @param req - Incoming HTTP request
 * @param res - HTTP response
 * @param next - Express `next` when no SSR response is produced
 */
function angularSsrHandler(req: Request, res: Response, next: NextFunction): void {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
}

app.use(angularSsrHandler);

/**
 * `app.listen` callback: throws on error; otherwise logs the listening URL.
 * @param port - Port the server listens on
 * @param error - Optional error from the listen callback
 */
function onServerListen(port: string | number, error?: Error): void {
  if (error) {
    throw error;
  }
  console.log(`Node Express server listening on http://localhost:${port}`);
}

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;

  /**
   * Express `listen` callback; forwards to {@link onServerListen}.
   * @param err - Optional listen error
   */
  function handleListen(err?: Error): void {
    onServerListen(port, err);
  }

  app.listen(port, handleListen);
}

/**
 * Node request handler for hosting integrations (e.g. serverless adapters).
 */
export const reqHandler = createNodeRequestHandler(app);
