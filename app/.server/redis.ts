import { createClient } from 'redis'

const RedisClient = createClient()

RedisClient.on('error', (err) => console.log('Redis Client Error', err))

await RedisClient.connect()

export default RedisClient
