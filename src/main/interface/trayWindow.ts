/* eslint-disable no-console */
import { BrowserWindow, ipcMain, Tray, screen, Menu } from "electron";
import LoggerService from "main/service/logger.service";

type Options = {
  tray?: Tray;
  trayIconPath?: string;
  window?: BrowserWindow;
  windowUrl?: string;
  width?: number;
  height?: number;
  margin_x?: number;
  margin_y?: number;
  framed?: boolean;
  menu: Menu;
  loggerService: LoggerService;
}

export default class TrayWindow {
  tray: Tray;

  window: BrowserWindow;

  // defaults
  width = 200;

  height = 300;

  margin_x = 0;

  margin_y = 0;

  framed = false;

  constructor(options: Options) {
    if (!TrayWindow.validation(options)) return;

    this.init(options);
  }

  static validation(options: Options) {
    if (typeof options !== "object") {
      console.log("!!!tray-window can not create without any [options]");
      return false;
    }
    if (!options.tray && !options.trayIconPath) {
      console.log(
        "!!!tray-window can not create without [tray] or [trayIconPath] parameters"
      );
      return false;
    }
    if (!options.window && !options.windowUrl) {
      console.log(
        "!!!tray-window can not create without [window] or [windowUrl] parameters"
      );
      return false;
    }

    return true;
  }

  init(options: Options) {
    this.setWindowSize(options);

    if (options.tray) this.setTray(options.tray)
    else this.createTray(options.trayIconPath);
    if (options.window) this.setWindow(options.window)
    else this.createWindow(options.windowUrl);

    this.tray.on('click', () => options.loggerService && options.loggerService.silly('click'))
    this.tray.on('double-click', () => options.loggerService && options.loggerService.silly('double-click'))
    this.tray.on('right-click', () => options.loggerService && options.loggerService.silly('right-click'))
    this.tray.on('mouse-down', () => options.loggerService && options.loggerService.silly('mouse-down'))
    this.tray.on('mouse-up', () => options.loggerService && options.loggerService.silly('mouse-up'))

    if (process.platform === 'linux') {
      this.tray.setContextMenu(options.menu)
    } else {
      this.tray.on("click", () => {
        ipcMain.emit("tray-window-clicked", { window: this.window, tray: this.tray });
        this.toggleWindow();
      });
      this.tray.on('right-click', () => {
        this.tray.popUpContextMenu(options.menu)
      })
    }

    this.setWindowAutoHide();
    this.alignWindow();

    ipcMain.emit("tray-window-ready", { window: this.window, tray: this.tray });
  }

  setWindowSize(options: { width?: number; height?: number; margin_x?: number; margin_y?: number; framed?: boolean; }) {
    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;
    if (options.margin_x) this.margin_x = options.margin_x;
    if (options.margin_y) this.margin_y = options.margin_y;
    if (options.framed) this.framed = options.framed;
  }

  createTray(trayIconPath: string | Electron.NativeImage) {
    this.tray = new Tray(trayIconPath);
  }

  setTray(newTray: Tray) {
    this.tray = newTray;
  }

  setWindow(newWindow: BrowserWindow) {
    this.window = newWindow;
    const bounds = this.window.getBounds()
    this.setWindowSize({
      width: bounds.width,
      height: bounds.height,
      margin_x: 0,
      margin_y: 0,
      framed: this.framed
    });
  }

  createWindow(windowUrl: string) {
    this.window = undefined;

    this.window = new BrowserWindow({
      width: this.width,
      height: this.height,
      maxWidth: this.width,
      maxHeight: this.height,
      show: false,
      frame: this.framed,
      fullscreenable: false,
      resizable: false,
      useContentSize: true,
      transparent: true,
      alwaysOnTop: true,
      webPreferences: {
        backgroundThrottling: false
      }
    });
    this.window.setMenu(null);

    this.setWindowUrl(windowUrl);

    return window;
  }

  setWindowUrl(windowUrl: string) {
    this.window.loadURL(windowUrl);
  }

  setWindowAutoHide() {
    this.window.hide();
    this.window.on("blur", () => {
      if (!this.window.webContents.isDevToolsOpened()) {
        this.window.hide();
        ipcMain.emit("tray-window-hidden", { window: this.window, tray: this.tray });
      }
    });
    this.window.on("close", (event: { preventDefault: () => void; }) => {
      event.preventDefault();
      this.window.hide();
    });
  }

  toggleWindow() {
    if (this.window.isVisible()) {
      this.window.hide();
      ipcMain.emit("tray-window-hidden", { window: this.window, tray: this.tray });
      return;
    }

    this.showWindow();
    ipcMain.emit("tray-window-visible", { window: this.window, tray: this.tray });
  }

  alignWindow() {
    const position = this.calculateWindowPosition();
    this.window.setBounds({
      width: this.window.getBounds().width,
      height: this.window.getBounds().height,
      x: position.x,
      y: position.y
    });
  }

  showWindow() {
    this.alignWindow();
    this.window.show();
  }

  calculateWindowPosition() {
    const screenBounds = screen.getPrimaryDisplay().size;

    let referenceX = null
    let referenceY = null
    let referenceWidth = null
    let referenceHeight = null
    if (process.platform === 'linux') {
      const mouseBounds = screen.getCursorScreenPoint()
      referenceX = mouseBounds.x
      referenceY = mouseBounds.y
      referenceWidth = 0
      referenceHeight = 0
    } else {
      const trayBounds = this.tray.getBounds();
      referenceX = trayBounds.x
      referenceY = trayBounds.y
      referenceWidth = trayBounds.width
      referenceHeight = trayBounds.height
    }

    // where is the icon on the screen?
    let trayPos = 4; // 1:top-left 2:top-right 3:bottom-left 4.bottom-right
    trayPos = referenceY > screenBounds.height / 2 ? trayPos : trayPos / 2;
    trayPos = referenceX > screenBounds.width / 2 ? trayPos : trayPos - 1;

    const DEFAULT_MARGIN = { x: this.margin_x, y: this.margin_y };

    let x = null
    let y = null

    // calculate the new window position
    switch (trayPos) {
      case 1: // for TOP - LEFT
        x = Math.floor(referenceX + DEFAULT_MARGIN.x + referenceWidth / 2);
        y = Math.floor(referenceY + DEFAULT_MARGIN.y + referenceHeight / 2);
        break;

      case 2: // for TOP - RIGHT
        x = Math.floor(
          referenceX - this.window.getBounds().width - DEFAULT_MARGIN.x + referenceWidth / 2
        );
        y = Math.floor(referenceY + DEFAULT_MARGIN.y + referenceHeight / 2);
        break;

      default:
      case 3: // for BOTTOM - LEFT
        x = Math.floor(referenceX + DEFAULT_MARGIN.x + referenceWidth / 2);
        y = Math.floor(
          referenceY - this.window.getBounds().height - DEFAULT_MARGIN.y + referenceHeight / 2
        );
        break;

      case 4: // for BOTTOM - RIGHT
        x = Math.floor(
          referenceX - this.window.getBounds().width - DEFAULT_MARGIN.x + referenceWidth / 2
        );
        y = Math.floor(
          referenceY - this.window.getBounds().height - DEFAULT_MARGIN.y + referenceHeight / 2
        );
        break;
    }

    return { x, y };
  }
}
