import { CallHandler, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
    constructor(
        @Inject(CACHE_MANAGER) cacheManager: Cache,
        reflector: Reflector,
    ) {
        super(cacheManager, reflector);
    }

    async intercept(context: ExecutionContext, next: CallHandler) {
        const key = this.trackBy(context);
        if (!key) {
            return super.intercept(context, next);
        }

        const cached = await this.cacheManager.get(key);
        console.log('[Cache]', cached ? 'HIT' : 'MISS', key);
        const response = context.switchToHttp().getResponse();
        if (response?.setHeader) {
            response.setHeader('X-Cache', cached ? 'HIT' : 'MISS');
        }

        return super.intercept(context, next);
    }
}
