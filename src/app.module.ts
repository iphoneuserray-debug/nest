import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { RelationsModule } from './relations/relations.module';
import { AccountsModule } from './accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { SeedModule } from './seed/seed.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';
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
            useFactory: async () => {
                const redisUrl = "redis://localhost:6379";
                if (!redisUrl) {
                    throw new Error('REDIS_URL is not set. Redis cache is required.');
                }
                return {
                    ttl: 6000,
                    max: 5000,
                    store: new Keyv({
                        store: new KeyvRedis(redisUrl),
                    }),
                };
            },
            isGlobal: true,
        }),
        AuthModule,
    ],
})
export class AppModule { }
