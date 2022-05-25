import { app } from "electron";
import path from "path";
import { Inject, Component } from "tsdi";
import ConfigService from "../service/config.service";

@Component()
export default class Resources {

  public trayIconDefault: string

  public trayIconNotify: string

  public windowIcon: string

  public preloadScript: string

  public index: string

  private RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../../assets');

  constructor(@Inject() private configService: ConfigService) {
    this.windowIcon = this.getAssetPath('icon.png')

    if (process.platform === 'win32') {
      this.trayIconDefault = this.getAssetPath('icon-default.ico')
      this.trayIconNotify = this.getAssetPath('icon-notify.ico')
    } else {
      this.trayIconDefault = this.getAssetPath('icon-default.png')
      this.trayIconNotify = this.getAssetPath('icon-notify.png')
    }

    if (app.isPackaged) {
      this.preloadScript = path.join(__dirname, 'preload.js')
    } else {
      this.preloadScript = path.join(__dirname, '../../../.erb/dll/preload.js')
    }

    this.index = this.resolveHtmlPath('index.html')
  }

  private getAssetPath(...paths: string[]): string {
    return path.join(this.RESOURCES_PATH, ...paths);
  }

  private resolveHtmlPath(htmlFileName: string): string {
    if (this.configService.isDebug) {
      const port = process.env.PORT || 1212;
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      return url.href;
    }

    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  }
}
