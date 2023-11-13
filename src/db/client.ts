import mongoose from 'mongoose'
import { ENV } from 'util/env.ts'
import logger from 'util/logger'

const db = await mongoose.connect(ENV.mongoUri, {
  ssl: true,
  user: ENV.mongoUser,
  pass: ENV.mongoPass,
  dbName: ENV.mongoDbName,
})
logger.info('Connected to MongoDB')
export default db
