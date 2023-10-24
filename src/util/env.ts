import { z } from "zod";


export const ENV = z
  .object({
    CLIENT_ID: z.string(),
    GUILD_ID: z.string(),
    DISCORD_TOKEN: z.string(),
    MONGO_URI: z.string(),
    MONGO_USER: z.string(),
    MONGO_PASS: z.string(),
    BNET_CLIENTID: z.string(),
    BNET_SECRET: z.string(),
  })
  .transform((e) => ({
    clientId: e.CLIENT_ID,
    guildId: e.GUILD_ID,
    token: e.DISCORD_TOKEN,
    mongoUri: e.MONGO_URI,
    mongoUser: e.MONGO_USER,
    mongoPass: e.MONGO_PASS,
    bnetClientId: e.BNET_CLIENTID,
    bnetSecret: e.BNET_SECRET,
  })).parse(process.env);