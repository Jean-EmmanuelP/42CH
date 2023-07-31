import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DefiService } from './defi.service';

@Controller('defi')
export class DefiController {
    constructor(private prismaService: PrismaService, private defiService: DefiService) { }

    @Post('create')
    async createDefi(@Body() data: { creatorUsername: string, opponentUsername: string }) {
        return await this.defiService.createDefi(data.creatorUsername, data.opponentUsername);
    }

    @Post('get_infos')
    async getInfos(@Body() data: { username: string }) {
        return await this.defiService.getInfos(data.username);
    }

    @Post('get_all_challenges')
    async getAllChallenges(@Body() data: { username: string }) {
        return await this.defiService.getAllChallenges(data.username);
    }

    @Post('finish')
    async finish(@Body() data: { username: string, challengeId: string, winner: string }) {
        return await this.defiService.finish(data.username, data.challengeId, data.winner);
    }

    @Post('get_all_defi_requests')
    async getAllDefiRequests(@Body() data: { username: string }) {
        return await this.defiService.getAllDefiRequests(data.username);
    }

    @Get('get_all_public_challenges')
    async getAllPublicChallenges() {
        return await this.defiService.getAllPublicChallenges();
    }

    @Post('delete_defi_request')
    async deleteDefiRequest(@Body() data: { id: string }) {
        const defi = await this.prismaService.defiRequest.findFirst({ where: { id: data.id } })
        if (defi == null) {
            return { success: false, error: 'Defi not found' }
        }
        await this.prismaService.defiRequest.delete({ where: { id: data.id } })
        return { success: true }
    }

    @Post('get_image')
    async getImage(@Body() data: { username: string }) {
        return await this.defiService.getImage(data.username);
    }

    @Post('get_opponent')
    async getOpponent(@Body() data: { id: string }) {
        return await this.defiService.getOpponent(data.id);
    }

    @Post('ongoing')
    async ongoing(@Body() data: { username: string }) {
        return await this.defiService.ongoing(data.username);
    }
}
