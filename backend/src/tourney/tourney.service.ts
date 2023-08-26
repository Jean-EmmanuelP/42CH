import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TourneyService {
    constructor(private prismaService: PrismaService) { }


    async startTourney(adminUsername: string, tourneyTitle: string) {
        // Check if admin exists and is admin
        const admin = await this.prismaService.user.findUnique({ where: { name: adminUsername } });
        if (!admin || (admin.name != process.env.ADMIN1 && admin.name != process.env.ADMIN2))
            return { success: false, error: 'You are not admin' }

        // Check if tourney exists and is not started
        const tourney = await this.prismaService.tourney.findUnique({ where: { title: tourneyTitle } });
        if (!tourney)
            return { success: false, error: 'Could not find tourney' }
        if (tourney.started)
            return { success: false, error: 'Tourney already started' }

        // Randomize team with the Fisher-Yates shuffle
        const teams = tourney.participantsUsernames;
        for (let i = teams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [teams[i], teams[j]] = [teams[j], teams[i]];
        }

        // Update participants
        const updatedTourney = await this.prismaService.tourney.update({
            where: { title: tourneyTitle },
            data: { participantsUsernames: { set: teams }, started: true }
        });
        if (!updatedTourney)
            return { success: false, error: 'Could not start tourney' }

        // Create of the matches of the first round
        let j = 0;
        for (let i = 0; i < teams.length; i += 2) {
            if (i != teams.length - 1) {
                const match = await this.prismaService.matches.create({
                    data: {
                        tourneyId: tourney.id,
                        firstTeam: teams[i],
                        secondTeam: teams[i + 1],
                        winner: 'none',
                        rowPosition: j,
                        column: 0,
                    }
                });
                if (!match)
                    return { success: false, error: 'Could not create match' }
                // Add match to the tourney
                const updatedTourney = await this.prismaService.tourney.update({
                    where: { title: tourneyTitle },
                    data: { matches: { connect: { id: match.id } } }
                });
                if (!updatedTourney)
                    return { success: false, error: 'Could not add match to tourney' }
            }
            else {
                const match = await this.prismaService.matches.create({
                    data: {
                        tourneyId: tourney.id,
                        firstTeam: teams[i],
                        secondTeam: 'none',
                        winner: 'none',
                        rowPosition: j,
                        column: 0,
                    }
                });
                if (!match)
                    return { success: false, error: 'Could not create match' }
                // Add match to the tourney
                const updatedTourney = await this.prismaService.tourney.update({
                    where: { title: tourneyTitle },
                    data: { matches: { connect: { id: match.id } } }
                });
                if (!updatedTourney)
                    return { success: false, error: 'Could not add match to tourney' }
            }
            j++;
        }
    }


    async addTeam(firstMember: string, secondMember: string, tourneyTitle: string) {
        // Check if both members exist
        const firstMemberExists = await this.prismaService.user.findUnique({ where: { name: firstMember } });
        const secondMemberExists = await this.prismaService.user.findUnique({ where: { name: secondMember } });
        if (!firstMemberExists || !secondMemberExists)
            return { success: false, error: 'Could not find member' }

        // Check if tourney exists
        const tourney = await this.prismaService.tourney.findUnique({ where: { title: tourneyTitle } });
        if (!tourney)
            return { success: false, error: 'Could not find tourney' }

        // Check if team already exists
        const teams = tourney.participantsUsernames;
        const team = firstMember + ' & ' + secondMember;
        const teamReverse = secondMember + ' & ' + firstMember;
        if (teams.length != 0 && (teams.includes(team) || teams.includes(teamReverse)))
            return { success: false, error: 'Team already exists' }

        // Add team to tourney
        const updatedTourney = await this.prismaService.tourney.update({
            where: { title: tourneyTitle },
            data: { participantsUsernames: { push: team } }
        });
        if (!updatedTourney)
            return { success: false, error: 'Could not add team' }
        return { success: true }
    }


    async createTourney(title: string, description: string) {
        const tourney = await this.prismaService.tourney.create({ data: { title: title, description: description } });
        if (!tourney)
            return { success: false, error: 'Could not create tourney' }
        return { success: true }
    }
}
