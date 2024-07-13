import WebSocket, { Server } from 'ws'
import Message from '../models/message'

class WebSocketService {
  private wss: Server

  constructor() {
    this.wss = new Server({ port: 8080 })

    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', async (data) => {
        const { text, userId, groupId, recipientId } = JSON.parse(data.toString())
        const message = await Message.create({
          text,
          userId,
          groupId,
          recipientId,
          encrypted: true, // Assume encryption is handled on the client-side
          timestamp: new Date(),
        })
        
        // Broadcast to all clients
        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message))
          }
        })
      })
    })
  }

  broadcastMessage(message: any) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }

  // start() {
  //   // Initialize WebSocket server
  // }
   start(server: any) {
    server.on('upgrade', (request: any, socket: any, head: any) => {
      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request)
      })
    })
    console.log('WebSocket server started.')
  }
}

export const webSocketService = new WebSocketService()
