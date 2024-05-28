import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisRepository {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    });
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, expire?: Date): Promise<void> {
    await this.redisClient.set(key, value);
    if (expire) {
      await this.redisClient.expireat(key, expire.getTime());
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async setLock(key: string, ttl: number): Promise<boolean> {
    const result = await this.redisClient.set(key, '1', 'EX', ttl * 60, 'NX');
    return result === 'OK';
  }
}
