import { app } from 'electron';
import path from 'path';
import { Component } from 'tsdi';

@Component
export default class Config {
  public isDebug = false

  public isProduction = true

  public mockData = false

  public forceTray = false

  public upgradeExtensions = false

  public startMinimized = false

  public dataPath: string

  constructor() {
    this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
    this.mockData = process.env.MOCK_DATA !== null ? process.env.MOCK_DATA === 'true' : this.mockData
    this.forceTray = process.env.FORCE_TRAY !== null ? process.env.FORCE_TRAY === 'true' : this.forceTray
    this.upgradeExtensions = process.env.UPGRADE_EXTENSIONS !== null ? process.env.UPGRADE_EXTENSIONS === 'true' : this.upgradeExtensions
    this.startMinimized = process.env.START_MINIMIZED !== null ? process.env.START_MINIMIZED === 'true' : this.startMinimized
    this.isProduction = process.env.NODE_ENV !== null ? process.env.NODE_ENV === 'production' : this.isProduction
    if (this.isDebug) {
      this.dataPath = path.join(process.cwd(), 'data')
    } else {
      this.dataPath = app.getPath('userData')
    }
  }
}
