import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
    constructor(private readonly redisService: RedisService) { }

    @Post('set')
    async setKey(@Body('key') key: string, @Body('value') value: string) {
        await this.redisService.setValue(key, value);
        return 'Key set successfully';
    }

    @Get('get/:key')
    async getKey(@Param('key') key: string) {
        const value = await this.redisService.getValue(key);
        return value ? { key, value } : { message: 'Key not found' };
    }
}
