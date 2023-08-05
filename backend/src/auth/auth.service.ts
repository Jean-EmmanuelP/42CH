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
            redirect_uri: process.env.NEXT_PUBLIC_BASE_URL
        });

        try {
            const request = await axios.post("https://api.intra.42.fr/oauth/token/", {
                grant_type: 'authorization_code',
                client_id: process.env.FORTY_TWO_CLIENT_ID,
                client_secret: process.env.FORTY_TWO_CLIENT_SECRET,
                code: userCode,
                redirect_uri: process.env.NEXT_PUBLIC_BASE_URL
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
        if (!user) {
            user = await this.prismaService.user.create({
                data: {
                    name: request.data.login,
                    image: request.data.image.versions.small,
                },
            });
            const accessToken = this.jwtService.sign({ id: user.id }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' });
            user = await this.prismaService.user.update({
                where: { name: request.data.login },
                data: {
                    access_token: accessToken,
                },
            });
            return { success: true, username: user.name, access_token: accessToken };
        }
        const accessToken = this.jwtService.sign({ id: user.id }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' });
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
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }

        try {
            // decode the token and get its expiration date
            const decodedToken: any = this.jwtService.decode(accessToken);
            const expirationDate = new Date(decodedToken.exp * 1000);  // convert from UNIX to JS date

            // if the token is expired, return an error
            if (expirationDate < new Date()) {
                return { success: false, error: "Token" };
            }

            // if the token matches the database and it's not expired, refresh it
            if (user.access_token === accessToken) {
                const newAccessToken = this.jwtService.sign({ id: user.id }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' }); // time before users has to reconnect
                await this.prismaService.user.update({ where: { name: username }, data: { access_token: newAccessToken, status: 'online' } });
                setTimeout(async () => {
                    const updatedUser = await this.prismaService.user.findUnique({ where: { name: username } });
                    if (updatedUser?.access_token === newAccessToken && updatedUser.status === 'online') {
                        await this.prismaService.user.update({ where: { id: user.id }, data: { status: 'offline' } });
                    }
                }, 60000); // time before user is considered offline

                return { success: true, accessToken: newAccessToken };
            }

        } catch {
            return { success: false, error: "Token" };
        }

        let user20 = await this.prismaService.user.update({ where: { name: username }, data: { status: 'online' } });

        return { success: true, accessToken: user20.access_token };
    }
}
