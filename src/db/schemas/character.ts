import mongoose from 'mongoose'

const characterSchema = new mongoose.Schema(
  {
    discordUserId: { type: String, required: true, unique: true },
    characterName: { type: String, required: true },
    realm: { type: String, required: true },
  },
  {
    collection: 'chardata',
  }
)

export type Character = mongoose.InferSchemaType<typeof characterSchema>
export const Character = mongoose.model('Character', characterSchema)
