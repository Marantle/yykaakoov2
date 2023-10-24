import mongoose from 'mongoose'
import { Character } from './schemas/character.ts'
import { ENV } from 'util/env.ts'

const db = await mongoose.connect(ENV.mongoUri, {
  ssl: true,
  user: ENV.mongoUser,
  pass: ENV.mongoPass,
  dbName: 'yykaakoobot',
})
console.log('Connected to MongoDB')
export default db
