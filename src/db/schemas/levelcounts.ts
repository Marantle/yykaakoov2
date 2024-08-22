import mongoose from 'mongoose'

// follow list should be unique entries only
const levelcountsSchema = new mongoose.Schema(
  {
      level: { type: Number, required: true },
      count: { type: Number, required: true },
  },
  {
    collection: 'levelcounts',
  }
)

// follow unique index

export type Levelcounts = mongoose.InferSchemaType<typeof levelcountsSchema>
export const Levelcounts = mongoose.model('LevelcountsSchema', levelcountsSchema)
