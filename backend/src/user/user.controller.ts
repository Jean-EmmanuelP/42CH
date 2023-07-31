import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('get_top_users')
    async getTopUsers() {
        return await this.userService.getTopUsers();
    }

    @Get('get_online_users')
    async getOnlineUsers() {
        return await this.userService.getOnlineUsers();
    }

    @Post('get_user_infos')
    async getUserInfos(data: { username: string }) {
        return await this.userService.getUserInfos(data.username);
    }

    @Post('add_friend')
    async addFriend(data: { username: string, friendUsername: string }) {
        return await this.userService.addFriend(data.username, data.friendUsername);
    }

    @Post('accept_friend')
    async acceptFriend(data: { username: string, toAcceptUsername: string }) {
        return await this.userService.acceptFriend(data.username, data.toAcceptUsername);
    }

    @Post('decline_friend')
    async declineFriend(data: { username: string, toDeclineUsername: string }) {
        return await this.userService.declineFriend(data.username, data.toDeclineUsername);
    }

    @Post('delete_friend')
    async deleteFriend(data: { username: string, toDeleteUsername: string }) {
        return await this.userService.deleteFriend(data.username, data.toDeleteUsername);
    }

    @Post('get_friend_requests')
    async getFriendRequests(data: { username: string }) {
        return await this.userService.getFriendRequests(data.username);
    }

    @Post('get_friends')
    async getFriends(data: { username: string }) {
        return await this.userService.getFriends(data.username);
    }
}
