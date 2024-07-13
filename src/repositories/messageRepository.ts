import Message from '../models/message'
// import cacheService from '../services/cache'

class MessageRepository {
  async getMessagesByGroupId(groupId: string):Promise<Message[]> {
    const cacheKey = `group_messages_${groupId}`
    // let messages = await cacheService.get(cacheKey)

    // if (!messages) {
     let messages = await Message.findAll({
        where: { groupId },
        order: [['timestamp', 'desc']],
        limit: 100,
      })
      // await cacheService.set(cacheKey, messages, 60) // Cache for 60 seconds
    // }

    return messages
  }

  async getMessagesByUserId(userId: string):Promise<Message[]>  {
    const cacheKey = `user_messages_${userId}`
    // let messages = await cacheService.get(cacheKey)

    // if (!messages) {
    let  messages = await Message.findAll({
        where: { userId },
        order: [['timestamp', 'desc']],
        limit: 100,
      })
      // await cacheService.set(cacheKey, messages, 60) // Cache for 60 seconds
    // }

    return messages
  }
}

export const messageRepository = new MessageRepository()
