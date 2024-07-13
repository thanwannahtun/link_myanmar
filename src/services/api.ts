import  Message  from '../models/message'
import  cacheService  from './cache'
import { messageRepository } from '../repositories/messageRepository'
import { webSocketService } from "./websocket"

export class ApiService {
  async getMessages(groupId: string, userId: string) {
    if (groupId) {
      return await messageRepository.getMessagesByGroupId(groupId)
    }
    if (userId) {
      return await messageRepository.getMessagesByUserId(userId)
    }
    return []
  }

  async sendMessage(data: { text: string, userId: string, groupId?: string, recipientId?: string }) {
    const { text, userId, groupId, recipientId } = data
    const message = new Message({
      text,
      userId,
      groupId,
      recipientId,
      encrypted: true,
      timestamp: new Date(),
    })
    await message.save()
    await cacheService.delete(`group_messages_${groupId}`)
    await cacheService.delete(`user_messages_${userId}`)
    webSocketService.broadcastMessage(message)
  }
}

export const apiService = new ApiService()
