import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService) { }

    async getUserToken(userCode: string) {
        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.FORTY_TWO_CLIENT_ID,
            client_secret: process.env.FORTY_TWO_CLIENT_SECRET,
            code: userCode,
            redirect_uri: "http://localhost:3000/"
        });

        try {
            const request = await axios.post("https://api.intra.42.fr/oauth/token", requestBody.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            const data = request.data;
            const token = data.access_token;
            const tokenExpires = data.expires_in;
            return { success: true, access_token: token, expires_in: tokenExpires };
        }
        catch {
            return { success: false };
        }
    }

    async signin(code: string) {
        const personnal42Token = await this.getUserToken(code);
        if (personnal42Token.success === false)
            return { success: false, error: "getUserToken failure" };
        const request = await axios.get("https://api.intra.42.fr/v2/me", { headers: { Authorization: `Bearer ${personnal42Token.access_token}` } });
        let user = await this.prismaService.user.findUnique({ where: { name: request.data.login } });
        if (!user) {
            user = await this.prismaService.user.create({
                data: {
                    name: request.data.login,
                    image: request.data.image.versions.small,
                },
            });
            return { success: true, username: user.name };
        }
        return { success: true, username: user.name };
    }
}
