import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Module({
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: async () => {
                const client = createClient({ url: 'redis://localhost:6379' });
                await client.connect();
                return client;
            },
        },
        RedisService,
    ],
    exports: [REDIS_CLIENT],
    controllers: [RedisController],
})
export class RedisModule { }
