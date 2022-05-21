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

    logger.info(`Starting DI controler...`);
    const tsdi = new TSDI();
    tsdi.enableComponentScanner()
    tsdi.get(App)
    tsdi.get(IPCController)
    logger.info(`Finished DI controler...`);
  } catch (ex) {
    logger.error(ex);
  }
}

main();
