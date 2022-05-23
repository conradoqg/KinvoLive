export const IPCController = (options: { name: string }): ClassDecorator => {
  return target => {
    return Reflect.defineMetadata('ipc-controller:controllerOptions', options, target.prototype)
  }
}

export const IPCEvent = (options = { log: true }): MethodDecorator => {
  return (target: unknown, memberName: string) => {
    Reflect.defineMetadata('ipc-controller:eventOptions', options, target, memberName)
  }
}

export const IPCInvoke = (options = { log: true }): MethodDecorator => {
  return (target: unknown, memberName: string) => {
    Reflect.defineMetadata('ipc-controller:invokeOptions', options, target, memberName)
  }
}
