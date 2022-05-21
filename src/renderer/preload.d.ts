declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: string, ...args: unknown[]): void;
        sendMessageSync<T>(channel: string, ...args: unknown[]): T;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke<T>(channel: string, ...args: unknown[]): Promise<T>;
      };
    };
  }
}

export { };
