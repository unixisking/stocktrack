import { algoliasearch } from 'algoliasearch'
import { createClient } from 'redis'

const db = createClient()

// Connect and authenticate with your Algolia app
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY
)

await db.connect()

// Fetch and index objects in Algolia
const processRecords = async () => {
  console.log('processing records...')
  const pattern = 'iex:*' // The key pattern to search for
  let cursor = 0
  let allKeys = []
  let objects = []

  do {
    // Fetch a batch of keys matching the pattern
    const reply = await db.scan(cursor, { MATCH: pattern, COUNT: 100 })
    cursor = reply.cursor // Update the cursor to continue the scan
    allKeys = allKeys.concat(reply.keys) // Collect the keys
  } while (cursor !== 0) // Continue until cursor is 0 (i.e., no more keys)

  console.log('All matching keys:', allKeys)

  // Now you can fetch the data for each key
  for (const key of allKeys) {
    const data = await db.json.get(key)
    objects.push({
      ticker: key.split(':')[1],
      security: data.security,
      sector: data.sector,
      industry: data.industry,
    })

    // console.log(`Data for ${key}:`, data)
  }

  return client.saveObjects({ indexName: 'stocks_index', objects })
}

processRecords()
  .then(() => console.log('Successfully indexed objects!'))
  .catch((err) => console.error(err))
  .finally(async () => await db.disconnect())
