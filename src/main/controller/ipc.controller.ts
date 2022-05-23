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
      const classOptions = Reflect.getOwnMetadata('ipc-controller:controllerOptions', proto)
      if (classOptions) {
        const existingMethods = Object.getOwnPropertyNames(proto).filter(item => typeof proto[item] === 'function')

        const eventedMethods = existingMethods.map(method => [method, Reflect.getOwnMetadata('ipc-controller:eventOptions', proto, method)]).filter(([, methodOptions]) => methodOptions !== undefined)
        for (const [methodName, methodOptions] of eventedMethods) {
          this.loggerService.debug(`Listening event ${classOptions.name}:${methodName} - log: ${methodOptions.log}`)
          ipcMain.on(`${classOptions.name}:${methodName}`, async (ipcMainEvent, arg?) => {
            const calledAt = dayjs()
            try {
              const result = await Reflect.apply(controller[methodName], controller, arg || [])
              ipcMainEvent.reply(methodName, result)
              if (methodOptions.log) this.loggerService.debug(`${classOptions.name}:${methodName} called and took ${humanize(dayjs.duration(dayjs().diff(calledAt, 'milliseconds')))}`)
            } catch (ex) {
              this.loggerService.error(ex)
            }
          })
        }

        const invokedMethods = existingMethods.map(method => [method, Reflect.getOwnMetadata('ipc-controller:invokeOptions', proto, method)]).filter(([, methodOptions]) => methodOptions !== undefined)
        for (const [methodName, methodOptions] of invokedMethods) {
          this.loggerService.debug(`Listening invoke ${classOptions.name}:${methodName} - log: ${methodOptions.log}`)
          ipcMain.handle(`${classOptions.name}:${methodName}`, async (_ipcMainEvent, ...args) => {
            try {
              const calledAt = dayjs()
              const result = await Reflect.apply(controller[methodName], controller, args)
              if (methodOptions.log) this.loggerService.debug(`${classOptions.name}:${methodName} called and took ${humanize(dayjs.duration(dayjs().diff(calledAt, 'milliseconds')))}`)
              return result
            } catch (ex) {
              this.loggerService.error(ex)
              throw ex;
            }
          })
        }
      }
    }
    this.loggerService.debug('Finished IPC Controllers...')
  }
}
