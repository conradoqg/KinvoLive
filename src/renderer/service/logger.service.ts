/* eslint-disable class-methods-use-this */
class LoggerService {
  public silly(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['silly', ...args]);
  }

  public debug(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['debug', ...args]);
  }

  public trace(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['trace', ...args]);
  }

  public info(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['info', ...args]);
  }

  public warn(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['warn', ...args]);
  }

  public error(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['error', ...args]);
  }

  public fatal(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('log', ['fatal', ...args]);
  }
}

const defaultLogger = new LoggerService()

export default defaultLogger
