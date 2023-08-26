import { Body, Controller, Post } from '@nestjs/common';
import { TourneyService } from './tourney.service';

@Controller('tourney')
export class TourneyController {
    constructor(private tourneyService: TourneyService) { }

    @Post('create')
    async createTourney(@Body() data: { title: string, description: string }) {
        return this.tourneyService.createTourney(data.title, data.description);
    }

    @Post('add_team')
    async addTeam(@Body() data: { firstMember: string, secondMember: string, tourneyTitle: string }) {
        return this.tourneyService.addTeam(data.firstMember, data.secondMember, data.tourneyTitle);
    }

    @Post('start_tourney')
    async startTourney(@Body() data: { adminUsername: string, tourneyTitle: string }) {
        return this.tourneyService.startTourney(data.adminUsername, data.tourneyTitle);
    }
}
