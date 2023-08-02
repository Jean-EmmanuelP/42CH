import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DefiService } from './defi.service';

@Controller('defi')
export class DefiController {
    constructor(private prismaService: PrismaService, private defiService: DefiService) { }

    @Post('create')
    async createDefi(@Body() data: { creatorUsername: string, opponentUsername: string }) {
        if (data == undefined || !data.creatorUsername || !data.opponentUsername) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.createDefi(data.creatorUsername, data.opponentUsername);
    }

    @Post('get_infos') // already implemented
    async getInfos(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.getInfos(data.username);
    }

    @Post('get_all_challenges') // figma done
    async getAllChallenges(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.getAllChallenges(data.username);
    }

    @Post('finish') // already implemented
    async finish(@Body() data: { username: string, challengeId: string, winner: string }) {
        if (data == undefined || !data.username || !data.challengeId || !data.winner) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.finish(data.username, data.challengeId, data.winner);
    }

    @Post('get_all_defi_requests') // already implemented
    async getAllDefiRequests(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.getAllDefiRequests(data.username);
    }

    @Get('get_all_public_challenges') // figma done
    async getAllPublicChallenges() {
        return await this.defiService.getAllPublicChallenges();
    }

    @Post('delete_defi_request') // already implemented
    async deleteDefiRequest(@Body() data: { id: string }) {
        if (data == undefined || !data.id) {
            return { success: false, error: 'Invalid input' };
        }
        const defi = await this.prismaService.defiRequest.findFirst({ where: { id: data.id } })
        if (defi == null) {
            return { success: false, error: 'Defi not found' }
        }
        await this.prismaService.defiRequest.delete({ where: { id: data.id } })
        return { success: true }
    }

    @Post('get_image')
    async getImage(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.getImage(data.username);
    }

    @Post('get_opponent')
    async getOpponent(@Body() data: { id: string }) {
        if (data == undefined || !data.id) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.getOpponent(data.id);
    }

    @Post('ongoing')
    async ongoing(@Body() data: { username: string }) {
        if (data == undefined || !data.username) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.ongoing(data.username);
    }

    @Post('bet_public_challenge') // figma done
    async betPublicChallenge(@Body() data: { username: string, challengeId: string, amount: number, winner: string }) {
        if (data == undefined || !data.username || !data.challengeId || !data.amount || !data.winner) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.betPublicChallenge(data.username, data.challengeId, data.amount, data.winner);
    }

    @Post('user_bet_on_public_challenge') // figma done
    async userBetOnPublicChallenge(@Body() data: { username: string, challengeId: string }) {
        if (data == undefined || !data.username || !data.challengeId) {
            return { success: false, error: 'Invalid input' };
        }
        return await this.defiService.userBetOnPublicChallenge(data.username, data.challengeId);
    }
}