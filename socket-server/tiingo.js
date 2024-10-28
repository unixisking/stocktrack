import WebSocket from 'ws'

export function createSocketConnections(endpoint, clientSocket) {
  const ws = new WebSocket(endpoint)

  ws.on('open', () => {
    console.log(`Connected to ${endpoint}`)
  })

  ws.on('message', (data) => {
    console.log(`Received data from ${endpoint}:`, data.toString())
    clientSocket.emit(data)
  })

  ws.on('close', () => {
    console.log(`Connection closed: ${endpoint}`)
  })

  ws.on('error', (error) => {
    console.error(`Error on ${endpoint}:`, error)
  })
}
