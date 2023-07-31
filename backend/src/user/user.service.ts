import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    // Friends related functions

    async getFriends(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        if (user.friends.length == 0)
            return { success: false, error: 'No friends' }
        let friends = [];
        for (let i = 0; i < user.friends.length; i++) {
            const friend = await this.prismaService.user.findUnique({ where: { id: user.friends[i] } })
            friends.push({
                username: friend.name,
                image: friend.image,
                balance: friend.balance,
            })
        }
        return { success: true, friends: friends }
    }

    async getFriendRequests(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        if (user.friendsRequests.length == 0)
            return { success: false, error: 'No friend requests' }
        let friendRequests = [];
        for (let i = 0; i < user.friendsRequests.length; i++) {
            const friend = await this.prismaService.user.findUnique({ where: { id: user.friendsRequests[i] } })
            friendRequests.push({
                username: friend.name,
                image: friend.image,
                balance: friend.balance,
            })
        }
        return { success: true, friendRequests: friendRequests }
    }

    async addFriend(username: string, friendUsername: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        const friend = await this.prismaService.user.findUnique({ where: { name: friendUsername } })
        if (friend == null)
            return { success: false, error: 'Friend not found' }
        if (user.friends.includes(friend.id) || friend.friends.includes(user.id))
            return { success: false, error: 'Already friends' }
        else if (user.friendsRequests.includes(friend.id) || friend.friendsRequests.includes(user.id))
            return { success: false, error: 'Already sent a friend request' }
        else {
            await this.prismaService.user.update({
                where: { name: friendUsername },
                data: { friendsRequests: { push: user.id } }
            })
            return { success: true }
        }
    }

    async acceptFriend(username: string, toAcceptUsername: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        const toAccept = await this.prismaService.user.findUnique({ where: { name: toAcceptUsername } })
        if (toAccept == null)
            return { success: false, error: 'Friend not found' }
        if (user.friends.includes(toAccept.id) || toAccept.friends.includes(user.id))
            return { success: false, error: 'Already friends' }
        else if (!user.friendsRequests.includes(toAccept.id))
            return { success: false, error: 'No friend request found' }
        else {
            await this.prismaService.user.update({
                where: { name: username },
                data: {
                    friends: { push: toAccept.id },
                    friendsRequests: { set: user.friendsRequests.filter(id => id != toAccept.id) }
                }
            })
            await this.prismaService.user.update({
                where: { name: toAcceptUsername },
                data: { friends: { push: user.id } }
            })
            return { success: true }
        }
    }

    async declineFriend(username: string, toDeclineUsername: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        const toDecline = await this.prismaService.user.findUnique({ where: { name: toDeclineUsername } })
        if (toDecline == null)
            return { success: false, error: 'Friend not found' }
        if (user.friends.includes(toDecline.id) || toDecline.friends.includes(user.id))
            return { success: false, error: 'Already friends' }
        else if (!user.friendsRequests.includes(toDecline.id))
            return { success: false, error: 'No friend request found' }
        else {
            await this.prismaService.user.update({
                where: { name: username },
                data: { friendsRequests: { set: user.friendsRequests.filter(id => id != toDecline.id) } }
            })
            return { success: true }
        }
    }

    async deleteFriend(username: string, toDeleteUsername: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        const toDelete = await this.prismaService.user.findUnique({ where: { name: toDeleteUsername } })
        if (toDelete == null)
            return { success: false, error: 'Friend not found' }
        if (!user.friends.includes(toDelete.id) || !toDelete.friends.includes(user.id))
            return { success: false, error: 'Not friends' }
        else {
            await this.prismaService.user.update({
                where: { name: username },
                data: { friends: { set: user.friends.filter(id => id != toDelete.id) } }
            })
            await this.prismaService.user.update({
                where: { name: toDeleteUsername },
                data: { friends: { set: toDelete.friends.filter(id => id != user.id) } }
            })
            return { success: true }
        }
    }

    // User related functions

    async getUserInfos(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null) {
            return { success: false, error: 'User not found' }
        }
        //todo envoyer un historique?
        return {
            success: true, user: {
                username: user.name,
                image: user.image,
                balance: user.balance,
                statusMessage: user.statusMessage,
            }
        }
    }

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
