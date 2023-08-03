import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
const jwt = require('jsonwebtoken');

let payload = { id: "123" };


@Injectable()
export class AuthService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    async getUserToken(userCode: string) {
        const requestBody = new URLSearchParams({
            // grant_type: 'client_credentials',
            // client_id: process.env.FORTY_TWO_UID,
            // client_secret: process.env.FORTY_TWO_SECRET

            grant_type: 'authorization_code',
            client_id: process.env.FORTY_TWO_CLIENT_ID,
            client_secret: process.env.FORTY_TWO_CLIENT_SECRET,
            code: userCode,
            redirect_uri: "http://localhost:3000"
        });

        try {
            const request = await axios.post("https://api.intra.42.fr/oauth/token/", {
                grant_type: 'authorization_code',
                client_id: process.env.FORTY_TWO_CLIENT_ID,
                client_secret: process.env.FORTY_TWO_CLIENT_SECRET,
                code: userCode,
                redirect_uri: "http://localhost:3000"
            }, {
                headers: {
                    // "Content-Type": "application/json"
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            const data = request.data;
            const token = data.access_token;
            const tokenExpires = data.expires_in;
            return { success: true, access_token: token, expires_in: tokenExpires };
        }
        catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    async signin(code: string) {
        const personnal42Token = await this.getUserToken(code);
        if (personnal42Token.success === false)
            return { success: false, error: "getUserToken failure ici" };
        const request = await axios.get("https://api.intra.42.fr/v2/me", { headers: { Authorization: `Bearer ${personnal42Token.access_token}` } });
        let user = await this.prismaService.user.findUnique({ where: { name: request.data.login } });
        const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '5m' });
        if (!user) {
            user = await this.prismaService.user.create({
                data: {
                    name: request.data.login,
                    image: request.data.image.versions.small,
                    access_token: accessToken,
                },
            });
            return { success: true, username: user.name, access_token: accessToken };
        }
        user = await this.prismaService.user.update({
            where: { name: request.data.login },
            data: {
                image: request.data.image.versions.small,
                access_token: accessToken,
            },
        });
        return { success: true, username: user.name, access_token: accessToken };
    }

    async checkToken(username: string, accessToken: string) {
        let user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (user == null)
            return { success: false, error: 'User not found' };
        if (user.access_token == accessToken) {
            user = await this.prismaService.user.update({ where: { name: username }, data: { status: "online" }, });
            try {
                await this.jwtService.verify(accessToken, { secret: process.env.JWT_ACCESS_SECRET });
            }
            catch {
                const payload = { id: user.id };
                const newAccessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '5m' });
                user = await this.prismaService.user.update({ where: { name: username }, data: { access_token: newAccessToken } });
                setTimeout(async () => {
                    if (newAccessToken == user.access_token && user.status == "online")
                        await this.prismaService.user.update({ where: { id: payload.id }, data: { status: "offline" } });
                }, 300000);
                return { success: true, accessToken: accessToken };
            }
        }
        return { success: false, error: 'Invalid token' };
    }
}
