import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Post('change_balance')
    async changeBalance(@Body() body: { admin: string, user: string, amount: number }) {
        return await this.adminService.changeBalance(body.admin, body.user, body.amount);
    }
}
