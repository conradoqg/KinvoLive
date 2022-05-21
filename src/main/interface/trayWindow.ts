import { BrowserWindow, ipcMain, Tray, screen } from "electron";

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

    this.tray.on("click", () => {
      ipcMain.emit("tray-window-clicked", { window: this.window, tray: this.tray });
      this.toggleWindow();
    });

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

  setWindowUrl(windowUrl: any) {
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
      width: this.width,
      height: this.height,
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
    const trayBounds = this.tray.getBounds();

    // where is the icon on the screen?
    let trayPos = 4; // 1:top-left 2:top-right 3:bottom-left 4.bottom-right
    trayPos = trayBounds.y > screenBounds.height / 2 ? trayPos : trayPos / 2;
    trayPos = trayBounds.x > screenBounds.width / 2 ? trayPos : trayPos - 1;

    const DEFAULT_MARGIN = { x: this.margin_x, y: this.margin_y };

    let x = null
    let y = null

    // calculate the new window position
    switch (trayPos) {
      case 1: // for TOP - LEFT
        x = Math.floor(trayBounds.x + DEFAULT_MARGIN.x + trayBounds.width / 2);
        y = Math.floor(trayBounds.y + DEFAULT_MARGIN.y + trayBounds.height / 2);
        break;

      case 2: // for TOP - RIGHT
        x = Math.floor(
          trayBounds.x - this.width - DEFAULT_MARGIN.x + trayBounds.width / 2
        );
        y = Math.floor(trayBounds.y + DEFAULT_MARGIN.y + trayBounds.height / 2);
        break;

      default:
      case 3: // for BOTTOM - LEFT
        x = Math.floor(trayBounds.x + DEFAULT_MARGIN.x + trayBounds.width / 2);
        y = Math.floor(
          trayBounds.y - this.height - DEFAULT_MARGIN.y + trayBounds.height / 2
        );
        break;

      case 4: // for BOTTOM - RIGHT
        x = Math.floor(
          trayBounds.x - this.width - DEFAULT_MARGIN.x + trayBounds.width / 2
        );
        y = Math.floor(
          trayBounds.y - this.height - DEFAULT_MARGIN.y + trayBounds.height / 2
        );
        break;
    }

    return { x, y };
  }
}
