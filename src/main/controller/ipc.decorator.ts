export const IPCController = (): ClassDecorator => {
  return target => {
    return Reflect.defineMetadata('ipc-controller:isController', true, target.prototype)
  }
}

export const IPCEvent = (options = { log: true }): MethodDecorator => {
  return (target: unknown, memberName: string) => {
    Reflect.defineMetadata('ipc-controller:eventName', options, target, memberName)
  }
}

export const IPCSend = (options = { log: true }): MethodDecorator => {
  return (target: unknown, memberName: string) => {
    Reflect.defineMetadata('ipc-controller:sendName', options, target, memberName)
  }
}

export const IPCInvoke = (options = { log: true }): MethodDecorator => {
  return (target: unknown, memberName: string) => {
    Reflect.defineMetadata('ipc-controller:invokeName', options, target, memberName)
  }
}
