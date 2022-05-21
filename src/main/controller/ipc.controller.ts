import { ipcMain } from 'electron';
import { Component, Initialize, Inject } from 'tsdi';
import Logger from '../service/logger.service';
import BackendService from '../service/backend.service';

@Component()
export default class IPCController {
  @Inject()
  private logger: Logger

  @Inject
  private kinvoService: BackendService;

  @Initialize
  public init(): void {
    const controllers = [this.kinvoService]

    this.logger.info('Starting IPC Controllers...')
    for (const controller of controllers) {
      const proto = Reflect.getPrototypeOf(controller)
      if (Reflect.hasOwnMetadata('ipc-controller:isController', proto) && Reflect.getOwnMetadata('ipc-controller:isController', proto)) {
        const className = controller.constructor.name
        const existingMethods = Object.getOwnPropertyNames(proto).filter(item => typeof proto[item] === 'function')
        const eventedMethods = existingMethods.map(method => Reflect.getOwnMetadata('ipc-controller:eventName', proto, method)).filter(eventName => eventName !== undefined)
        const invokedMethods = existingMethods.map(method => Reflect.getOwnMetadata('ipc-controller:invokeName', proto, method)).filter(invokeName => invokeName !== undefined)
        for (const eventMethod of eventedMethods) {
          this.logger.info(`Listening event ${className}:${eventMethod}`)
          ipcMain.on(eventMethod, async (ipcMainEvent, arg?) => {
            try {
              const result = await Reflect.apply(controller[eventMethod], controller, arg || [])
              ipcMainEvent.reply(eventMethod, result)
            } catch (ex) {
              this.logger.error(ex)
            }
          })
        }
        for (const invokeMethod of invokedMethods) {
          this.logger.info(`Listening invoke ${className}:${invokeMethod}`)
          ipcMain.handle(invokeMethod, async (ipcMainEvent, ...args) => {
            return Reflect.apply(controller[invokeMethod], controller, args)
          })
        }
      }
    }
    this.logger.info('Finished IPC Controllers...')
  }
}
