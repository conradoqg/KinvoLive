import backendService from "./backend.service";

/* eslint-disable class-methods-use-this */
class LoggerService {
  public silly(...args: unknown[]) {
    backendService.log('silly', ...args);
  }

  public debug(...args: unknown[]) {
    backendService.log('debug', ...args);
  }

  public trace(...args: unknown[]) {
    backendService.log('trace', ...args);
  }

  public info(...args: unknown[]) {
    backendService.log('info', ...args);
  }

  public warn(...args: unknown[]) {
    backendService.log('log', ...args);
  }

  public error(...args: unknown[]) {
    backendService.log('error', ...args);
  }

  public fatal(...args: unknown[]) {
    window.electron.ipcRenderer.sendMessage('fatal', ...args);
  }
}

const defaultLogger = new LoggerService()

export default defaultLogger
