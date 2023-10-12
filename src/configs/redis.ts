import Redis from 'ioredis';

class RedisClient {
  private redis: any;

  constructor() {
    const redisConfig = {
      host: 'localhost',
      port: 6379,
    };

    this.redis = new Redis(redisConfig);
  }

  set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }
    return this.redis.set(key, value);
  }

  get(key: string) {
    return this.redis.get(key);
  }

  delete(key: string) {
    return this.redis.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
