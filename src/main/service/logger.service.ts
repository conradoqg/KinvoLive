/* eslint-disable class-methods-use-this */
import { wrapCallSite } from "source-map-support";
import { Component, Initialize, Inject } from "tsdi";
import { ILogObject, ISettings, ISettingsParam, Logger as TSLogger } from "tslog";
import { appendFileSync, existsSync, rmSync } from "fs";
import path from "path";
import Config from "./config.service";

@Component()
export default class Logger extends TSLogger {
  public LOG_PATH: string

  public constructor(@Inject() private config: Config, settings?: ISettingsParam, parentSettings?: ISettings) {
    super(settings, parentSettings);
    // eslint-disable-next-line no-underscore-dangle
    this._callSiteWrapper = wrapCallSite;
    this.settings.exposeErrorCodeFrame = this.config.isDebug
    this.settings.exposeStack = this.config.isDebug
    this.settings.exposeErrorCodeFrameLinesBeforeAndAfter = 0
    this.LOG_PATH = path.join(this.config.dataPath, 'log.txt')
    if (existsSync(this.LOG_PATH)) rmSync(this.LOG_PATH)
    const logToTransport = (logObject: ILogObject) => {
      this.printPrettyLog({
        write: (message: string) => appendFileSync(this.LOG_PATH, message)
      }, logObject)
    }
    this.attachTransport(
      {
        silly: logToTransport,
        debug: logToTransport,
        trace: logToTransport,
        info: logToTransport,
        warn: logToTransport,
        error: logToTransport,
        fatal: logToTransport,
      },
      "silly"
    );
  }

  @Initialize()
  init() {
    this.info(this.config)
  }
}
