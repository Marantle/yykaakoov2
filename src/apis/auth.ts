import { ENV } from 'util/env'
const BNET_ID = ENV.bnetClientId
const BNET_SECRET = ENV.bnetSecret

let accessToken: string | null = null
let expiresAt = 0

async function getAccessToken() {
  if (!accessToken || Date.now() >= expiresAt) {
    const url = 'https://oauth.battle.net/token'

    try {
      console.log('getting battlenet token')
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${BNET_ID}:${BNET_SECRET}`
          ).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      })

      const data = await response.json()

      accessToken = data.access_token
      expiresAt = Date.now() + data.expires_in * 1000
    } catch (error) {
      throw new Error(
        'Failed to obtain an access token: ' + (error as Error).message
      )
    }
  }

  return accessToken
}

export { getAccessToken }
