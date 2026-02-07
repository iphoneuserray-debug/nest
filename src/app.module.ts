import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { RelationsModule } from './relations/relations.module';
import { AccountsModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { SeedModule } from './seed/seed.module';
import { REDIS_CLIENT, RedisModule } from './redis/redis.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
    imports: [UsersModule, CompaniesModule, RelationsModule, AccountsModule, SeedModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            database: 'user_db',
            entities: [User],
            synchronize: true,
            autoLoadEntities: true,
        }),
        CacheModule.registerAsync({
            imports: [RedisModule],
            inject: [REDIS_CLIENT],
            useFactory: async () => {
                return {
                    ttl: 60,
                    max: 5000,
                    store: new Keyv({
                        store: new KeyvRedis('redis://localhost:6379'),
                    }),
                };
            },
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule { }
