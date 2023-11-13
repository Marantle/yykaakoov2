import ping from './fun/ping.ts'
import server from './utility/server.ts'
import user from './utility/user.ts'
import avatar from './utility/avatar.ts'
import { Command } from './commandTypes.ts'
import { Collection } from 'discord.js'
import vault from './mythic/vault.ts'
import setMain from './character/setmain.ts'
import myVault from './mythic/myvault.ts'
import titlecutoff from './mythic/titlecutoff.ts'
import rating from './mythic/rating.ts'
import follow from './character/follow.ts'
import followedrating from './followed/followedrating.ts'
import followed from './followed/followed.ts'
const collection = new Collection<string, Command>()

for (const command of [
  ping,
  server,
  user,
  avatar,
  vault,
  setMain,
  myVault,
  titlecutoff,
  rating,
  follow,
  followed,
  followedrating,
]) {
  collection.set(command.data.name, command)
}

export default collection
