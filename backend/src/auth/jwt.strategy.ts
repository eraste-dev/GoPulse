
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        // Note: We use process.env directly or ConfigService. 
        // Assuming NEXTAUTH_SECRET is available in environment
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.NEXTAUTH_SECRET || 'supersecretkey123',
        });
    }

    async validate(payload: any) {
        // This payload is the decoded JWT from NextAuth
        // It usually contains { name, email, picture, sub, iat, exp, ... }
        if (!payload) {
            throw new UnauthorizedException();
        }
        return { userId: payload.sub, email: payload.email, name: payload.name };
    }
}
