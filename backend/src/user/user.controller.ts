import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('classement/:id')
    async getRanking(@Param('id') id: string) {
        return await this.userService.getRanking(id);
    }

    @Post('three_users_ranking')
    async threeUsersRanking(@Body() data: { username: string }) {
        if (data == undefined || data.username == undefined) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.threeUsersRanking(data.username);
    }

    @Get('get_top_users')
    async getTopUsers() {
        return await this.userService.getTopUsers();
    }

    @Get('get_online_users')
    async getOnlineUsers() {
        return await this.userService.getOnlineUsers();
    }

    @Post('get_user_infos')
    async getUserInfos(@Body() data: { username: string }) {
        if (data == undefined || data.username == undefined) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.getUserInfos(data.username);
    }

    @Post('add_friend')
    async addFriend(@Body() data: { username: string, friendUsername: string }) {
        if (data == undefined || !data.username || !data.friendUsername) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.addFriend(data.username, data.friendUsername);
    }

    @Post('accept_friend')
    async acceptFriend(@Body() data: { username: string, toAcceptUsername: string }) {
        if (data == undefined || !data.username || !data.toAcceptUsername) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.acceptFriend(data.username, data.toAcceptUsername);
    }

    @Post('decline_friend')
    async declineFriend(@Body() data: { username: string, toDeclineUsername: string }) {
        if (data == undefined || !data.username || !data.toDeclineUsername) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.declineFriend(data.username, data.toDeclineUsername);
    }

    @Post('delete_friend')
    async deleteFriend(@Body() data: { username: string, toDeleteUsername: string }) {
        if (data == undefined || !data.username || !data.toDeleteUsername) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.deleteFriend(data.username, data.toDeleteUsername);
    }

    @Post('get_friend_requests')
    async getFriendRequests(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.getFriendRequests(data.username);
    }

    @Post('get_friends')
    async getFriends(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.userService.getFriends(data.username);
    }

    @Post('change_status')
    async changeStatus(@Body() data: { username: string, status: string }) {
        if (data == undefined || !data.username || !data.status)
            return { success: false, error: 'Invalid input' };
        return await this.userService.changeStatus(data.username, data.status);
    }
}