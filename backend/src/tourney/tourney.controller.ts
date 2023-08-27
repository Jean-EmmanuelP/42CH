import { Body, Controller, Get, Post } from '@nestjs/common';
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

    @Post('get_tourney')
    async getTourney(@Body() data: { tourneyTitle: string }) {
        return this.tourneyService.getTourney(data.tourneyTitle);
    }

    @Post('winner')
    // firstTeam and secondTeam are formated like that 'firstMember & secondMember'
    async winner(@Body() data: { tourneyTitle: string, firstTeam: string, secondTeam: string, winner: string }) {
        return this.tourneyService.setWinner(data.tourneyTitle, data.firstTeam, data.secondTeam, data.winner);
    }

    @Get('get_ongoing')
    async getOngoingTourneys() {
        return this.tourneyService.getOngoingTourneys();
    }

    @Get('not_ongoing')
    async getNotOngoingTourneys() {
        return this.tourneyService.getNotOngoingTourneys();
    }

    @Post('randomize')
    async randomize(@Body() data: { tourneyTitle: string }) {
        return this.tourneyService.randomize(data.tourneyTitle);
    }

    @Post('change_team')
    async changeTeam(@Body() data: { adminUsername: string, tourneyTitle: string, oldTeam: string, newTeam: string }) {
        return this.tourneyService.changeTeam(data.adminUsername, data.tourneyTitle, data.oldTeam, data.newTeam);
    }
}
