import { app } from 'electron';
import path from 'path';
import { Component } from 'tsdi';
import { TLogLevelName } from 'tslog';

@Component
export default class ConfigService {
  public isDebug = false

  public isProduction = true

  public mockData = false

  public forceTray = false

  public upgradeExtensions = false

  public startMinimized = false

  public minLogLevel: TLogLevelName

  public dataPath: string

  constructor() {
    this.isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
    this.mockData = process.env.MOCK_DATA ? process.env.MOCK_DATA === 'true' : this.mockData
    this.forceTray = process.env.FORCE_TRAY ? process.env.FORCE_TRAY === 'true' : this.forceTray
    this.upgradeExtensions = process.env.UPGRADE_EXTENSIONS ? process.env.UPGRADE_EXTENSIONS === 'true' : this.upgradeExtensions
    this.startMinimized = process.env.START_MINIMIZED ? process.env.START_MINIMIZED === 'true' : this.startMinimized
    this.isProduction = process.env.NODE_ENV ? process.env.NODE_ENV === 'production' : this.isProduction
    if (this.isDebug) {
      this.dataPath = path.join(process.cwd(), 'data')
    } else {
      this.dataPath = app.getPath('userData')
    }
    this.minLogLevel = (process.env.MIN_LOG_LEVEL ? process.env.MIN_LOG_LEVEL : (this.isDebug ? 'silly' : 'warn')) as TLogLevelName
  }
}
