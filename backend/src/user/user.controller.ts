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
}
