/**
 * Système de logging optimisé pour réduire les performances
 */
class Logger {
  constructor() {
    this.isDev = import.meta.env.DEV;
    this.isProd = import.meta.env.PROD;
    this.enableLogs = this.isDev && !import.meta.env.VITE_REDUCE_LOGS;
    this.enableVerbose = import.meta.env.VITE_VERBOSE_LOGS === 'true';
  }
  
  log(message, ...args) {
    if (this.enableLogs) {
      console.log(message, ...args);
    }
  }
  
  warn(message, ...args) {
    console.warn(message, ...args);
  }
  
  error(message, ...args) {
    console.error(message, ...args);
  }
  
  // Logs spécialisés avec préfixes
  auth(message, ...args) {
    if (this.enableLogs) {
      console.log(`🔐 Auth: ${message}`, ...args);
    }
  }
  
  api(method, url, ...args) {
    if (this.enableVerbose) {
      console.log(`📤 API: ${method.toUpperCase()} ${url}`, ...args);
    }
  }
  
  mock(message, ...args) {
    if (this.enableLogs) {
      console.log(`🎭 Mock: ${message}`, ...args);
    }
  }
  
  performance(message, duration, ...args) {
    if (duration > 100) {
      console.warn(`🐌 Performance: ${message} took ${duration}ms`, ...args);
    } else if (this.enableVerbose) {
      console.log(`⚡ Performance: ${message} took ${duration}ms`, ...args);
    }
  }
  
  debug(message, ...args) {
    if (this.enableVerbose) {
      console.debug(`🔍 Debug: ${message}`, ...args);
    }
  }
}

export const logger = new Logger();