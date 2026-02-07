import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountsService } from '../accounts/accounts.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private accountsService: AccountsService,
        private usersService: UsersService,
        private jwtServices: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        const account = await this.accountsService.findOne(email);
        const user = await this.usersService.findByEmail(email);
        if (account?.password !== password) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user?.id, email: email, role: user?.role }
        return {
            access_token: await this.jwtServices.signAsync(payload),
        };
    }

    async signUp(email: string, passward: string): Promise<{ access_token: string }> {
        const account = await this.accountsService.create({ email: email, password: passward });
        const user = await this.usersService.findByEmail(email);
        const payload = { sub: user?.id, email: email, role: user?.role }
        return {
            access_token: await this.jwtServices.signAsync(payload),
        };
    }
}
