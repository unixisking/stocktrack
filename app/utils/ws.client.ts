import io from 'socket.io-client'

export function connect() {
  return io('http://localhost:3000') // replace with localhost at home
}
