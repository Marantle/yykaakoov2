import pino from 'pino'
import pretty from 'pino-pretty'

const transport = pino.transport({
  targets: [
    {
      level: 'trace',
      target: 'pino-pretty',
      options: {},
    },
    {
      level: 'trace',
      target: 'pino-pretty',
      options: {
        colorize: false,
        destination: import.meta.dir + '/app.log',
      },
    },
  ],
})

const logger = pino({}, transport)
export default logger
