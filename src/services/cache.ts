import Redis from 'ioredis'

class CacheService {
  private client: Redis

  constructor() {
    this.client = new Redis()
  }

  async set(key: string, value: any, expiration?: number) {
    await this.client.set(key, JSON.stringify(value))
    if (expiration) {
      await this.client.expire(key, expiration)
    }
  }

  async get(key: string) {
    const value = await this.client.get(key)
    return value ? JSON.parse(value) : null
  }

  async delete(key: string) {
    await this.client.del(key)
  }
}

const cacheService = new CacheService()
export default cacheService
