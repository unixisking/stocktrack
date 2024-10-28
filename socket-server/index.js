import express from 'express'
import { createServer } from 'http'
import compression from 'compression'
import morgan from 'morgan'
import { Server } from 'socket.io'
import WebSocket from 'ws'
import cors from 'cors'
import { createClient } from 'redis'

const RedisClient = createClient()

RedisClient.on('error', (err) => console.log('Redis Client Error', err))

await RedisClient.connect()

const endpoints = [
  // eslint-disable-next-line no-undef
  { channel: 'crypto', endpoint: `wss://api.tiingo.com/crypto` },
  // eslint-disable-next-line no-undef
  { channel: 'fx', endpoint: `wss://api.tiingo.com/fx` },
  // eslint-disable-next-line no-undef
  { channel: 'iex', endpoint: `wss://api.tiingo.com/iex` },
]

function subscribe(channel) {
  const tickers = {
    crypto: ['*'],
    iex: [
      'AAPL',
      'GOOGL',
      'TSLA',
      'VOO',
      'VTI',
      'VXUS',
      'NVDA',
      'INTC',
      'META',
      'KO',
    ],
    fx: ['eurusd', 'audusd', 'cadusd', 'jpyusd', 'eurchf', 'usdcnh', 'xauusd'],
  }
  return {
    eventName: 'subscribe',
    authorization: process.env.TIINGO_API_TOKEN,
    eventData: {
      thresholdLevel: 5,
      tickers: tickers[channel],
    },
  }
}

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    // origin: 'http://localhost:5173',
    origin: '*',
  },
})

app.use(compression())
app.use(express.static('public', { maxAge: '1h' }))
app.use(express.static('public/static', { immutable: true, maxAge: '1y' }))
app.use(morgan('tiny'))
app.use(cors())

// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000

// instead of using `app.listen` we use `httpServer.listen`
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`)
})

io.on('connection', (socket) => {
  for (const { channel, endpoint } of endpoints) {
    socket.on(channel, () => {
      const ws = new WebSocket(endpoint)

      ws.on('open', () => {
        ws.send(JSON.stringify(subscribe(channel)))
      })

      ws.on('message', (data) => {
        const message = data.toString()
        socket.emit(channel, message)
      })
    })
  }
})

app.get('/iex', async (_, res) => {
  const iex = await RedisClient.json.get('iex:dashboard')
  if (iex) {
    return res.json(iex)
  } else {
    const response = await fetch(
      // eslint-disable-next-line no-undef
      `https://api.tiingo.com/iex/?tickers=aapl,intc,meta,nvda,ko,googl,tsla,voo,vti,vxus&token=09136f0933ed340233993be53c2b2b5e08b8c01f`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await response.json()
    // console.log('data', data)
    await RedisClient.json.set('iex:dashboard', '$', data)
    await RedisClient.expire('iex:dashboard', 3600)
    return res.json(data)
  }
})

// app.get('/crypto', (_, res) => {})
// app.get('/fx', (_, res) => {})
