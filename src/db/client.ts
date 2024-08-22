import mongoose from 'mongoose'
import { ENV } from 'util/env.ts'
import logger from 'util/logger'

try {
  await mongoose
    .connect(ENV.mongoUri, {
      ssl: true,
      user: ENV.mongoUser,
      pass: ENV.mongoPass,
      dbName: ENV.mongoDbName,
    })
    console.log('Connected to MongoDB')
  
} catch (error: any) {
  console.error('Error connecting to MongoDB:', error.message)

  // Handle specific error conditions
  if (error.name === 'MongoNetworkError') {
    console.error('Network error occurred. Check your MongoDB server.')
  } else if (error.name === 'MongooseServerSelectionError') {
    console.error(
      'Server selection error. Ensure' + ' MongoDB is running and accessible.'
    )
  } else {
    // Handle other types of errors
    console.error('An unexpected error occurred:', error)
  }
  
}

const db = mongoose.connection
logger.info('Connected to MongoDB')
export default db
