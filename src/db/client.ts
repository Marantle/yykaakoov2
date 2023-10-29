import mongoose from 'mongoose'
import { ENV } from 'util/env.ts'

const db = await mongoose.connect(ENV.mongoUri, {
  ssl: true,
  user: ENV.mongoUser,
  pass: ENV.mongoPass,
  dbName: ENV.mongoDbName,
})
console.log('Connected to MongoDB')
export default db
