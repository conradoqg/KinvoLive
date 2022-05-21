export const IPCController = (): ClassDecorator => {
  return target => {
    return Reflect.defineMetadata('ipc-controller:isController', true, target.prototype)
  }
}

export const IPCEvent = (async = true): MethodDecorator => {
  return (target: any, memberName: string) => {
    Reflect.defineMetadata('ipc-controller:eventName', memberName, target, memberName)
  }
}

export const IPCSend = (async = true): PropertyDecorator => {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('ipc-controller:sendName', propertyKey, target, propertyKey)
  }
}

export const IPCInvoke = (async = true): PropertyDecorator => {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('ipc-controller:invokeName', propertyKey, target, propertyKey)
  }
}
