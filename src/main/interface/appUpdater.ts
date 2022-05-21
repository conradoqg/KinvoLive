import { autoUpdater } from 'electron-updater';
import { Component, Inject } from 'tsdi';
import { Logger } from 'tslog';

@Component()
export default class AppUpdater {
  @Inject()
  private logger: Logger

  constructor() {
    autoUpdater.logger = this.logger;
    // autoUpdater.checkForUpdatesAndNotify();
  }
}
