/* eslint-disable global-require */
import { app, BrowserWindow, shell, Tray, Menu, ipcMain } from 'electron';
import { Component, Initialize, Inject } from 'tsdi';
import TrayWindow from './trayWindow';
import LoggerService from '../service/logger.service';
import ConfigService from '../service/config.service';
import Resources from './resources';
import PreferenceStore from '../store/preference.store';

@Component()
export default class App {
  private mainWindow: BrowserWindow | null = null;

  private mainTray: Tray | null = null;

  private trayWindow: TrayWindow | null = null;

  @Inject()
  private loggerService: LoggerService

  @Inject()
  private configService: ConfigService

  @Inject()
  private resources: Resources

  @Inject()
  private preferenceStore: PreferenceStore

  private async installExtensions() {
    const installer = require('electron-devtools-installer');
    const forceDownload = this.configService.upgradeExtensions;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload
      )
      .catch(this.loggerService.error);
  };

  private async createTray() {
    if (!this.configService.isDebug || this.configService.forceTray) {
      this.mainTray = new Tray(this.resources.trayIconDefault)
      this.mainTray.setIgnoreDoubleClickEvents(true)
    }
  }

  private async createTrayWindow() {
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

    if (!this.configService.isDebug || this.configService.forceTray) {
      this.trayWindow = new TrayWindow({
        window: this.mainWindow,
        tray: this.mainTray,
        menu: contextMenu,
        loggerService: this.loggerService
      })
    }
  }

  private async createWindow() {
    if (this.configService.isDebug) {
      await this.installExtensions();
    }

    const mainWindowPreference = this.preferenceStore.get('appMain', {
      width: 550,
      height: 650
    })

    this.mainWindow = new BrowserWindow({
      show: false,
      ...mainWindowPreference,
      icon: this.resources.windowIcon,
      minWidth: 550,
      minHeight: 650,
      frame: this.configService.isDebug,
      skipTaskbar: !this.configService.isDebug,
      alwaysOnTop: !this.configService.isDebug,
      webPreferences: {
        preload: this.resources.preloadScript,
      },
    });

    this.mainWindow.loadURL(this.resources.index);

    this.mainWindow.on('resized', () => {
      const newBounds = this.mainWindow.getBounds()
      mainWindowPreference.width = newBounds.width
      mainWindowPreference.height = newBounds.height
      this.preferenceStore.set('appMain', mainWindowPreference)
    })

    if (this.configService.isDebug && !this.configService.forceTray) {
      this.mainWindow.on('ready-to-show', () => {
        if (!this.mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }
        if (this.configService.startMinimized) {
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

  };

  @Initialize
  public async init() {
    if (this.configService.isProduction) {
      const sourceMapSupport = require('source-map-support');
      sourceMapSupport.install();
    }

    if (this.configService.isDebug) {
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

      if (app.dock) app.dock.hide()
    } catch (ex) {
      this.loggerService.error(ex)
    }
  }

  public notify() {
    if (this.mainWindow && this.mainTray && !this.mainWindow.isVisible()) {
      this.mainTray.setImage(this.resources.trayIconNotify)

      ipcMain.once('tray-window-visible', () => {
        this.mainTray.setImage(this.resources.trayIconDefault)
      })
    }
  }
}
