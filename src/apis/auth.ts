import { ENV } from 'util/env'
import logger from 'util/logger'

const BNET_ID = ENV.bnetClientId
const BNET_SECRET = ENV.bnetSecret

let accessToken: string | null = null
let expiresAt = 0

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function getAccessToken(retries = 20) {
  if (!accessToken || Date.now() >= expiresAt) {
    const url = 'https://oauth.battle.net/token'

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        logger.info('Getting battlenet token (attempt ' + attempt + ')')
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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        accessToken = data.access_token
        expiresAt = Date.now() + data.expires_in * 1000
        return accessToken
      } catch (error) {
        logger.error('Failed to obtain an access token: ' + (error as Error).message)

        if (attempt < retries) {
          logger.info('Retrying in 5 minutes...')
          await sleep(5 * 60 * 1000) // Wait for 5 minutes before retrying
        } else {
          throw new Error('Failed to obtain an access token after multiple attempts')
        }
      }
    }
  }

  return accessToken
}

export { getAccessToken }
