import mongoose from 'mongoose'

// follow list should be unique entries only
const characterSchema = new mongoose.Schema(
  {
    discordUserId: { type: String, required: true, unique: true },
    characterName: { type: String, required: true },
    realm: { type: String, required: true },
    // followed should be set of unique documents
    followed: [
      {
        characterName: { type: String, required: true },
        realm: { type: String, required: true },
        region: { type: String, required: true },
      },
    ],
  },
  {
    collection: 'chardata',
  }
)

// follow unique index

export type Character = mongoose.InferSchemaType<typeof characterSchema>
export const Character = mongoose.model('Character', characterSchema)
