import mongoose from 'mongoose'

// follow list should be unique entries only
const levelupcharacterSchema = new mongoose.Schema(
  {
    characterNameRealm: { type: String, required: true },
    level: { type: Number, required: true },
  },
  {
    collection: 'levelupcharacter',
  }
)

// follow unique index

export type LevelupCharacter = mongoose.InferSchemaType<typeof levelupcharacterSchema>
export const LevelupCharacter = mongoose.model('LevelupCharacter', levelupcharacterSchema)
