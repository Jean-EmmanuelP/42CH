import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    // Friends related functions

    async getClassment(username: string) {
        const user = await this.prismaService.user.findMany({
            select: { name: true },
            orderBy: [
                { balance: 'desc' },
                { name: 'asc' }
            ],
        })
        if (!user)
            return String(0);
        for (let i = 0; i < user.length; i++) {
            if (user[i].name == username)
                return String(i + 1);
        }
        return String(0);
    }
    async getFriends(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username }, select: { friends: true } })
        if (user == null)
            return { success: false, error: 'User not found' }
        if (user.friends.length == 0)
            return { success: false, error: 'No friends' }

        const friends = await this.prismaService.user.findMany({ where: { id: { in: user.friends } } })

        const friendsDataPromises = friends.map(async (friend) => ({
            username: friend.name,
            image: friend.image,
            balance: friend.balance,
            statusMessage: friend.statusMessage,
            classment: await this.getClassment(friend.name),
        }))

        const friendsData = await Promise.all(friendsDataPromises);

        return { success: true, friends: friendsData }
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
        if (user.friends.includes(friend.id) || friend.friends.includes(user.id)) {
            return { success: false, error: 'Already friends' }
        }
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

    async changeStatus(username: string, status: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null)
            return { success: false, error: 'User not found' }
        await this.prismaService.user.update({
            where: { name: username },
            data: { statusMessage: status }
        })
        return { success: true }
    }

    async getUserInfos(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (user == null) {
            return { success: false, error: 'User not found' }
        }
        // get the ranking of the user, based on the balance
        const users = await this.prismaService.user.findUnique({
            where: { name: username },
            select: { balance: true }
        })
        if (!users)
            return;
        const higherBalanceCount = await this.prismaService.user.count({
            where: {
                balance: {
                    gt: users.balance
                }
            }
        })
        let classment = higherBalanceCount + 1;

        return {
            success: true, user: {
                username: user.name,
                image: user.image,
                balance: user.balance,
                statusMessage: user.statusMessage,
                classment: classment,
            }
        }
    }

    async getOnlineUsers() {
        // const users = await this.prismaService.user.findMany({
        //     where: {
        //         status: "online",
        //     },
        // })
        const users = await this.prismaService.user.findMany({
            orderBy: [
                { balance: 'desc' },
                { name: 'asc' }
            ],
        })

        if (users.length == 0) {
            return { success: false, error: 'No users found' }
        }
        let onlineUsers = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].status == "online")
                onlineUsers.push({
                    username: users[i].name,
                    image: users[i].image,
                    balance: users[i].balance,
                    statusMessage: users[i].statusMessage,
                    classment: i + 1,
                })
        }
        if (onlineUsers.length == 0) {
            return { success: false, error: 'No online users found' }
        }
        return { success: true, onlineUsers: onlineUsers };
    }

    async getTopUsers() {
        const users = await this.prismaService.user.findMany({
            orderBy: [
                { balance: 'desc' },
                { name: 'asc' }
            ],
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
                classment: i + 1,
            })
        }
        return { success: true, topUsers: topUsers };
    }

    // function to get the ranking of the user, and the user above and below him
    async threeUsersRanking(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (!user)
            return { success: false, error: 'User not found' }
        const users = await this.prismaService.user.findMany({
            orderBy: [
                { balance: 'desc' },
                { name: 'asc' }
            ],
            select: { name: true, balance: true, image: true, statusMessage: true }
        })
        if (users.length == 0)
            return { success: false, error: 'No users found' }
        let usersRanking = [];
        if (users[0].name == username) {
            usersRanking.push({
                username: users[0].name,
                balance: users[0].balance,
                image: users[0].image,
                statusMessage: users[0].statusMessage,
                ranking: 1,
            })
            usersRanking.push({
                username: users[1].name,
                balance: users[1].balance,
                image: users[1].image,
                statusMessage: users[1].statusMessage,
                ranking: 2,
            })
            usersRanking.push({
                username: users[2].name,
                balance: users[2].balance,
                image: users[2].image,
                statusMessage: users[2].statusMessage,
                ranking: 3,
            })
            return { success: true, usersRanking: usersRanking }
        }
        else if (users[users.length - 1].name == username && users.length > 2) {
            usersRanking.push({
                username: users[users.length - 3].name,
                balance: users[users.length - 3].balance,
                image: users[users.length - 3].image,
                statusMessage: users[users.length - 3].statusMessage,
                ranking: users.length - 2,
            })
            usersRanking.push({
                username: users[users.length - 2].name,
                balance: users[users.length - 2].balance,
                image: users[users.length - 2].image,
                statusMessage: users[users.length - 2].statusMessage,
                ranking: users.length - 1,
            })
            usersRanking.push({
                username: users[users.length - 1].name,
                balance: users[users.length - 1].balance,
                image: users[users.length - 1].image,
                statusMessage: users[users.length - 1].statusMessage,
                ranking: users.length,
            })
            return { success: true, usersRanking: usersRanking }
        }
        for (let i = 0; i < users.length - 1; i++) {
            if (users[i + 1].name == username && i < users.length - 1) {
                usersRanking.push({
                    username: users[i].name,
                    balance: users[i].balance,
                    image: users[i].image,
                    statusMessage: users[i].statusMessage,
                    ranking: i + 1,
                })
                usersRanking.push({
                    username: users[i + 1].name,
                    balance: users[i + 1].balance,
                    image: users[i + 1].image,
                    statusMessage: users[i + 1].statusMessage,
                    ranking: i + 2,
                })
                usersRanking.push({
                    username: users[i + 2].name,
                    balance: users[i + 2].balance,
                    image: users[i + 2].image,
                    statusMessage: users[i + 2].statusMessage,
                    ranking: i + 3,
                })
                return { success: true, usersRanking: usersRanking }
            }
        }
        return { success: false, error: 'User not found' }
    }
}
