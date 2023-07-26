import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DefiService } from './defi.service';

@Controller('defi')
export class DefiController {
    constructor(private prismaServce: PrismaService, private defiService: DefiService) { }

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
}
