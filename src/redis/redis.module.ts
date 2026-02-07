import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { REDIS_CLIENT } from './redis.constants';

class InMemoryRedisClient {
    private readonly store = new Map<string, string>();

    async connect(): Promise<void> {
        return;
    }

    async get(key: string): Promise<string | null> {
        return this.store.get(key) ?? null;
    }

    async set(key: string, value: string): Promise<void> {
        this.store.set(key, value);
    }

    async quit(): Promise<void> {
        this.store.clear();
    }
}

@Module({
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: async () => {
                const redisUrl = process.env.REDIS_URL;
                if (!redisUrl) {
                    console.warn('REDIS_URL is not set. Using in-memory Redis client.');
                    return new InMemoryRedisClient();
                }

                const client = createClient({ url: redisUrl });
                try {
                    await client.connect();
                    return client;
                } catch (error) {
                    console.warn('Redis connection failed. Falling back to in-memory Redis client.', error);
                    return new InMemoryRedisClient();
                }
            },
        },
        RedisService,
    ],
    exports: [REDIS_CLIENT],
    controllers: [RedisController],
})
export class RedisModule { }
