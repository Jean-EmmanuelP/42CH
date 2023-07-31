import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('get_top_users')
    async getTopUsers() {
        return this.userService.getTopUsers();
    }

    @Get('get_online_users')
    async getOnlineUsers() {
        return this.userService.getOnlineUsers();
    }
}
