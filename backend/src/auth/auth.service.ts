import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findFirst({
            where: { email, isTrashed: false },
            include: { role: true }
        });

        if (!user) return null;

        // Support both plain check for seed placeholder and bcrypt
        let isMatch = false;
        if (user.password === 'setup_password_hash_here') {
            isMatch = (pass === 'demo123');
        } else {
            isMatch = await bcrypt.compare(pass, user.password || '');
        }

        if (isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            name: user.name,
            roleId: user.roleId,
            roleName: user.role?.name,
            status: user.status
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: payload
        };
    }
}

