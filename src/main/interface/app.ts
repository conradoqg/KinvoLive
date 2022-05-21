/* eslint-disable global-require */
import path from 'path';
import { app, BrowserWindow, shell, Tray, Menu, ipcMain } from 'electron';
import { Component, Initialize, Inject } from 'tsdi';
import { resolveHtmlPath } from '../util';
import TrayWindow from './trayWindow';
import AppUpdater from './appUpdater';
import Logger from '../service/logger.service';
import Config from '../service/config.service';

@Component()
export default class App {
  private mainWindow: BrowserWindow | null = null;

  private mainTray: Tray | null = null;

  private trayWindow: TrayWindow | null = null;

  private RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

  @Inject()
  private logger: Logger

  @Inject()
  private config: Config

  private async installExtensions() {
    const installer = require('electron-devtools-installer');
    const forceDownload = this.config.upgradeExtensions;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(this.logger.error);
  };

  private getAssetPath(...paths: string[]): string {
    return path.join(this.RESOURCES_PATH, ...paths);
  };

  private async createTray() {
    if (!this.config.isDebug || this.config.forceTray) {
      this.logger.info(this.getAssetPath('icon.png'))
      this.mainTray = new Tray(this.getAssetPath('icon.png'))
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Abrir', type: 'normal', click: () => {
            this.trayWindow.toggleWindow()
          },
        },
        { type: 'separator' },
        {
          label: 'Sair', type: 'normal', click: () => {
            this.mainWindow.destroy();
            this.mainTray.destroy();
            app.quit();
          }
        }
      ])
      this.mainTray.setContextMenu(contextMenu)
    }
  }

  private async createTrayWindow() {
    if (!this.config.isDebug || this.config.forceTray) {
      this.trayWindow = new TrayWindow({
        window: this.mainWindow,
        tray: this.mainTray,
      })
    }
  }

  private async createWindow() {
    if (this.config.isDebug) {
      await this.installExtensions();
    }

    this.mainWindow = new BrowserWindow({
      show: false,
      width: 530,
      height: 600,
      icon: this.getAssetPath('icon.png'),
      frame: this.config.isDebug,
      skipTaskbar: !this.config.isDebug,
      alwaysOnTop: !this.config.isDebug,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../../.erb/dll/preload.js'),
      },
    });

    this.mainWindow.loadURL(resolveHtmlPath('index.html'));

    if (this.config.isDebug && !this.config.forceTray) {
      this.mainWindow.on('ready-to-show', () => {
        if (!this.mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }
        if (this.config.startMinimized) {
          this.mainWindow.minimize();
        } else {
          this.mainWindow.show();
        }
      });

      this.mainWindow.on('closed', () => {
        this.mainWindow = null;
      });
    }

    this.mainWindow.setMenu(null)

    // Open urls in the user's browser
    this.mainWindow.webContents.setWindowOpenHandler((edata) => {
      shell.openExternal(edata.url);
      return { action: 'deny' };
    });

    // Remove this if your app does not use auto updates
    // eslint-disable-next-line
    //new AppUpdater();
  };

  @Initialize
  public async init() {
    if (this.config.isProduction) {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    if (this.config.isDebug) {
      this.logger.info('Debugging')
      require('electron-debug')();
    }

    /**
     * Add event listeners...
     */
    app.on('window-all-closed', () => {
      // Respect the OSX convention of having the application in memory even
      // after all windows have been closed
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    try {
      await this.createTray()
      await this.createWindow()
      await this.createTrayWindow()
      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (this.mainWindow === null) this.createWindow();
      });
    } catch (ex) {
      this.logger.error(ex)
    }
  }

  public notify() {
    if (this.mainWindow && this.mainTray && !this.mainWindow.isVisible()) {
      this.mainTray.setImage(this.getAssetPath('icon-notify.png'))

      ipcMain.once('tray-window-visible', () => {
        this.mainTray.setImage(this.getAssetPath('icon.png'))
      })
    }
  }
}
