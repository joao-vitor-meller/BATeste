import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
  default: 'app',

  /**
   * The loggers object can be used to define multiple loggers.
   * By default, we configure only one logger (named "app").
   */
  loggers: {
    app: {
      enabled: true,
      name: env.get('APP_NAME'),
      level: env.get('LOG_LEVEL'),

      redact: {
        paths: ['*.stripe_client_secret'],
        censor: '[REDACTED]',
      },

      transport: {
        targets: targets()
          /**
           * Dev logging
           */
          .pushIf(app.inDev, {
            target: 'pino/file',
            options: {
              destination: 'logs/app.log',
            },
            level: env.get('LOG_LEVEL'),
          })

          /**
           * Production logging
           */
          .pushIf(app.inProduction, {
            target: 'pino-pretty',
            level: env.get('LOG_LEVEL'),
          })
          .toArray(),
      },
    },
  },
})

export default loggerConfig

/**
 * Inferring types for the list of loggers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface LoggersList extends InferLoggers<typeof loggerConfig> {}
}
