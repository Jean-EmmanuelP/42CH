import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private prismaService: PrismaService, private authService: AuthService) { }

    @Post('signin')
    async signin(@Body() data: { code: string }) {
        return await this.authService.signin(data.code);
    }

    @Get('redirect_fortytwo')
    async redirect_fortytwo() {
        const queryParams = new URLSearchParams({
            client_id: process.env.FORTY_TWO_CLIENT_ID,
            redirect_uri: "http://localhost:3000",
        });

        return (`https://api.intra.42.fr/oauth/authorize?response_type=code&` + queryParams.toString())
    }
}
