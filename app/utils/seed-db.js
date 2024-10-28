import { createClient } from 'redis'
import { readFile } from 'node:fs/promises'
import path from 'path'

const db = createClient()

const sp = []

try {
  // Reading the CSV file
  const file = await readFile(path.join(process.cwd(), 'sp500.csv'), 'utf8')
  const lines = file.split('\n')

  // Loop through the remaining rows to extract tickers
  for (let i = 1; i < 45; i++) {
    const row = lines[i].split(',')

    // Skip empty lines
    if (row.length > 1) {
      sp.push({
        ticker: row[0],
        security: row[1],
        sector: row[2],
        industry: row[3],
      }) // Add ticker to array
    }
  }
} catch (error) {
  console.error('Error reading CSV file:', error)
  process.exit(1) // Exit if file reading fails
}

// Redis connection setup
db.on('error', (err) => console.error('Redis Client Error:', err))

try {
  await db.connect() // Try to connect to Redis
  console.log('Connected to Redis')
  console.log('tickers', sp)
} catch (err) {
  console.error('Error connecting to Redis:', err)
  process.exit(1) // Exit if Redis connection fails
}

// Loop through each ticker and fetch data
for (const stock of sp) {
  const URL = `https://api.tiingo.com/tiingo/daily/${stock.ticker}/prices?startDate=2024-1-1&endDate=2024-09-01&token=${process.env.TIINGO_API_TOKEN}`

  try {
    // Fetch data from Tiingo API for each ticker
    const response = await fetch(URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status} for ticker: ${stock.ticker}`
      ) // Handle non-200 responses
    }

    const data = await response.json()

    try {
      // Set JSON data in Redis for each ticker
      await db.json.set(`iex:${stock.ticker}`, '$', {
        ticker: stock.ticker,
        security: stock.security,
        industry: stock.industry,
        sector: stock.sector,
        data,
      })
      console.log(`Data saved to Redis for ${stock.ticker}`)
    } catch (redisError) {
      console.error(
        `Redis error while setting data for ${stock.ticker}:`,
        redisError
      )
    }
  } catch (fetchError) {
    console.error(
      `Error fetching data from Tiingo for ${stock.ticker}:`,
      fetchError
    )
  }
}

// Finally disconnect from Redis after processing all tickers
await db.disconnect()
console.log('Disconnected from Redis')
