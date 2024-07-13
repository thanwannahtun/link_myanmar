import { Request, Response } from 'express'
import {messageRepository  } from "../repositories/messageRepository"
// import cacheService from '../services/cache'
import Message from '../models/message'
import {webSocketService} from "../services/websocket"

class MessageController {
  async getMessages(req: Request, res: Response) {
    const { groupId, userId } = req.query

    if (groupId) {
      const messages = await messageRepository.getMessagesByGroupId(groupId as string)
      return res.json(messages)
    }

    if (userId) {
      const messages = await messageRepository.getMessagesByUserId(userId as string)
      return res.json(messages)
    }

    return res.status(400).send('Group ID or User ID is required')
  }

  async  sendMessage(req: Request, res: Response) {
   try {
     const { text, userId, groupId, recipientId } = req.body
    const message = await Message.create({
      text,
      userId,
      groupId,
      recipientId,
      encrypted: true,
      timestamp: new Date(),
    })

    // await cacheService.delete(`group_messages_${groupId}`)
    // await cacheService.delete(`user_messages_${userId}`)

    // Broadcast to WebSocket clients
    webSocketService.broadcastMessage(message)

     return res.status(201).json(message)
   } catch (error) {
    res.status(500).send({message:"Server Error ",error})
   }
  }
}

export const messageController = new MessageController()
