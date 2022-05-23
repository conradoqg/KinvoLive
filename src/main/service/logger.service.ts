/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { Component, Initialize, Inject } from "tsdi";
import { ILogObject, Logger as TSLogger } from "tslog";
import { appendFileSync, existsSync, rmSync } from "fs";
import path from "path";
import { LoggerServiceInterface } from "shared/service/logger.service.interface";
import { shell } from "electron";
import { IPCController, IPCEvent } from "../controller/ipc.decorator";
import ConfigService from "./config.service";

@Component()
@IPCController({ name: 'LoggerService' })
export default class LoggerService implements LoggerServiceInterface {
  public LOG_PATH: string

  private loggerInstance: TSLogger

  constructor(@Inject() private configService: ConfigService) {
    this.loggerInstance = new TSLogger({
      minLevel: configService.minLogLevel,
      exposeErrorCodeFrame: configService.isDebug,
      exposeErrorCodeFrameLinesBeforeAndAfter: configService.isDebug ? 0 : undefined,
      colorizePrettyLogs: true
    })

    this.LOG_PATH = path.join(this.configService.dataPath, 'log.txt')
    if (existsSync(this.LOG_PATH)) rmSync(this.LOG_PATH)
    const logToTransport = (logObject: ILogObject) => {
      this.loggerInstance.printPrettyLog({
        write: (message: string) => {
          // eslint-disable-next-line no-control-regex
          const justText = message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
          appendFileSync(this.LOG_PATH, justText)
        }
      }, logObject)
    }
    this.loggerInstance.attachTransport(
      {
        silly: logToTransport,
        debug: logToTransport,
        trace: logToTransport,
        info: logToTransport,
        warn: logToTransport,
        error: logToTransport,
        fatal: logToTransport,
      },
      this.configService.minLogLevel
    );
  }

  @Initialize()
  init() {
    this.info(this.configService)
  }

  @IPCEvent({ log: false })
  public silly(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["silly", args]);
  }

  @IPCEvent({ log: false })
  public debug(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["debug", args]);
  }

  @IPCEvent({ log: false })
  public trace(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["trace", args]);
  }

  @IPCEvent({ log: false })
  public info(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["info", args]);
  }

  @IPCEvent({ log: false })
  public warn(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["warn", args]);
  }

  @IPCEvent({ log: false })
  public error(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["error", args]);
  }

  @IPCEvent({ log: false })
  public fatal(...args: unknown[]): void {
    // @ts-ignore
    this.loggerInstance._handleLog.apply(this.loggerInstance, ["fatal", args]);
  }

  @IPCEvent()
  openLog() {
    shell.openExternal(this.LOG_PATH);
  }
}
