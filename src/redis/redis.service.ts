import { Injectable, Inject } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { REDIS_CLIENT } from './redis.constants';

type RedisClientLike = Pick<RedisClientType, 'get' | 'set'>;

@Injectable()
export class RedisService {
    constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisClientLike) { }

    async setValue(key: string, value: string): Promise<void> {
        await this.redisClient.set(key, value);
    }

    async getValue(key: string): Promise<string | null> {
        return await this.redisClient.get(key);
    }
}