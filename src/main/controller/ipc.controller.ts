import { ipcMain } from 'electron';
import { Component, Initialize, Inject } from 'tsdi';
import dayjs from 'dayjs';
import LoggerService from '../service/logger.service';
import BackendService from '../service/backend.service';
import { humanize } from '../../shared/helpers/dayjs';

@Component()
export default class IPCController {
  @Inject()
  private loggerService: LoggerService

  @Inject
  private kinvoService: BackendService;

  @Initialize
  public init(): void {
    const controllers = [this.kinvoService, this.loggerService]

    this.loggerService.debug('Starting IPC Controllers...')
    for (const controller of controllers) {
      const proto = Reflect.getPrototypeOf(controller)
      if (Reflect.hasOwnMetadata('ipc-controller:isController', proto) && Reflect.getOwnMetadata('ipc-controller:isController', proto)) {
        const className = controller.constructor.name
        const existingMethods = Object.getOwnPropertyNames(proto).filter(item => typeof proto[item] === 'function')
        const eventedMethods = existingMethods.map(method => [method, Reflect.getOwnMetadata('ipc-controller:eventName', proto, method)]).filter(([method]) => method !== undefined)
        const invokedMethods = existingMethods.map(method => [method, Reflect.getOwnMetadata('ipc-controller:invokeName', proto, method)]).filter(([method]) => method !== undefined)
        for (const [eventMethod, options] of eventedMethods) {
          this.loggerService.debug(`Listening event ${className}:${eventMethod}`)
          ipcMain.on(`${className}:${eventMethod}`, async (ipcMainEvent, arg?) => {
            const calledAt = dayjs()
            try {
              const result = await Reflect.apply(controller[eventMethod], controller, arg || [])
              ipcMainEvent.reply(eventMethod, result)
              if (options.log) this.loggerService.debug(`${className}:${eventMethod} called and took ${humanize(dayjs.duration(dayjs().diff(calledAt, 'milliseconds')))}`)
            } catch (ex) {
              this.loggerService.error(ex)
            }
          })
        }
        for (const [invokeMethod, options] of invokedMethods) {
          this.loggerService.debug(`Listening invoke ${className}:${invokeMethod}`)
          ipcMain.handle(`${className}:${invokeMethod}`, async (_ipcMainEvent, ...args) => {
            const calledAt = dayjs()
            const result = Reflect.apply(controller[invokeMethod], controller, args)
            if (options.log) this.loggerService.debug(`${className}:${invokeMethod} called and took ${humanize(dayjs.duration(dayjs().diff(calledAt, 'milliseconds')))}`)
            return result
          })
        }
      }
    }
    this.loggerService.debug('Finished IPC Controllers...')
  }
}
