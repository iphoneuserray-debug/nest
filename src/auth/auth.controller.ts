import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from '../public';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: Record<string, string>,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.signIn(signInDto.email, signInDto.password);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        return result;
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async signUp(
        @Body() signUpDto: Record<string, string>,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.signUp(signUpDto.email, signUpDto.password);
        res.cookie('access_token', result.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
        return result;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        const { sub, email, role } = req.user ?? {};
        return { id: sub, email, role };
    }
}
