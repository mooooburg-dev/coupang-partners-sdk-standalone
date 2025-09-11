/**
 * Simple logging utility for SDK
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(prefix = 'CoupangSDK', level: LogLevel = LogLevel.INFO) {
    this.prefix = prefix;
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  error(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(`[${this.prefix}] ERROR: ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.WARN) {
      console.warn(`[${this.prefix}] WARN: ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.INFO) {
      console.info(`[${this.prefix}] INFO: ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.level >= LogLevel.DEBUG) {
      console.debug(`[${this.prefix}] DEBUG: ${message}`, ...args);
    }
  }
}

// Default logger instance
export const logger = new Logger();