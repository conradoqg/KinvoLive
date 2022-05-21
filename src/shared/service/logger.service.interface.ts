export interface LoggerServiceInterface {
  silly(...args: unknown[]): void

  debug(...args: unknown[]): void

  trace(...args: unknown[]): void

  info(...args: unknown[]): void

  warn(...args: unknown[]): void

  error(...args: unknown[]): void

  fatal(...args: unknown[]): void

  openLog(): void
}
