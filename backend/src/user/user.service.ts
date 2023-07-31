import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    getUserInfos(username: string) {
        throw new Error('Method not implemented.');
    }
    constructor(private prismaService: PrismaService) { }

    async getOnlineUsers() {
        const users = await this.prismaService.user.findMany({
            where: {
                status: "online",
            }
        })
        if (users.length == 0) {
            return { success: false, error: 'No users found' }
        }
        let onlineUsers = [];
        for (let i = 0; i < users.length; i++) {
            onlineUsers.push({
                username: users[i].name,
                image: users[i].image,
                balance: users[i].balance,
                statusMessage: users[i].statusMessage,
                // todo send the place of the user in the ranking
                // classment:
            })
        }
        return { success: true, onlineUsers: onlineUsers };
    }

    async getTopUsers() {
        const users = await this.prismaService.user.findMany({
            orderBy: {
                balance: 'desc'
            },
            take: 3
        })
        if (users.length == 0) {
            return { success: false, error: 'No users found' }
        }
        let topUsers = [];
        for (let i = 0; i < users.length; i++) {
            topUsers.push({
                username: users[i].name,
                balance: users[i].balance,
                image: users[i].image,
                // todo système de l'évolution (de tel place à tel place)
                // savoir sur combien de temps on se base pour l'évolution
            })
        }
        return { success: true, topUsers: topUsers };
    }


}
