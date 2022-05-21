import 'reflect-metadata';
import 'dotenv/config';
import '../shared/i18n';
import { TSDI } from 'tsdi';
import { Logger } from 'tslog';
import { app } from 'electron';
import IPCController from './controller/ipc.controller';
import App from './interface/app';

async function main() {
  const logger = new Logger()
  try {
    await app.whenReady()

    logger.debug(`Starting DI...`);
    const tsdi = new TSDI();
    tsdi.enableComponentScanner()
    tsdi.get(App)
    tsdi.get(IPCController)
    logger.debug(`Finished DI`);
  } catch (ex) {
    logger.error(ex);
  }
}

main();
