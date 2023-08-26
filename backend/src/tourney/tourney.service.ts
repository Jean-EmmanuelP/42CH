import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TourneyService {
    constructor(private prismaService: PrismaService) { }

    async setWinner(tourneyTitle: string, firstTeam: string, secondTeam: string, winner: string) {
        // Check if tourney exists
        const tourney = await this.prismaService.tourney.findUnique({ where: { title: tourneyTitle } });
        if (!tourney)
            return { success: false, error: 'Could not find tourney' }

        let column = tourney.column

        // Given the length of participantsUsernames, calculate the number of rounds
        // const participantsUsernames = tourney.participantsUsernames;
        // const numberOfRounds = Math.ceil(Math.log2(participantsUsernames.length));

        // Check if match exists
        const match = await this.prismaService.matches.findFirst({
            where: {
                tourneyId: tourney.id,
                firstTeam: firstTeam,
                secondTeam: secondTeam,
                winner: 'none',
                column: column,
            }
        });
        if (!match)
            return { success: false, error: 'Could not find match' }

        // Update match
        const updatedMatch = await this.prismaService.matches.update({
            where: { id: match.id },
            data: { winner: winner }
        });
        if (!updatedMatch)
            return { success: false, error: 'Could not update match' }

        // Calculate newRowPosition like if rowPosition is 0 or 1 then 0, if 2 or 3 then 1, if 4 or 5 then 2, etc...
        const newRowPosition = Math.floor(match.rowPosition / 2);

        const nextMatch = await this.prismaService.matches.findFirst({
            where: {
                tourneyId: tourney.id,
                rowPosition: newRowPosition,
                column: column + 1,
            }
        });
        if (!nextMatch) {
            if (winner == firstTeam) {
                const createMatch = await this.prismaService.matches.create({
                    data: {
                        tourneyId: tourney.id,
                        firstTeam: firstTeam,
                        secondTeam: 'none',
                        winner: 'none',
                        rowPosition: newRowPosition,
                        column: column + 1,
                    }
                });
            }
            else {
                const createMatch = await this.prismaService.matches.create({
                    data: {
                        tourneyId: tourney.id,
                        firstTeam: secondTeam,
                        secondTeam: 'none',
                        winner: 'none',
                        rowPosition: newRowPosition,
                        column: column + 1,
                    }
                });
            }
        }
        else if (nextMatch.firstTeam == 'none') {
            const updatedMatch = await this.prismaService.matches.update({
                where: { id: nextMatch.id },
                data: { firstTeam: winner }
            });
        }
        else if (nextMatch.secondTeam == 'none') {
            const updatedMatch = await this.prismaService.matches.update({
                where: { id: nextMatch.id },
                data: { secondTeam: winner }
            });
        }

        // If every match of the column is finished column++
        const matches = await this.prismaService.matches.findMany({
            where: {
                column: column,
            }
        })
        let allMatchesFinished = true;
        for (let i = 0; i < matches.length; i++) {
            if (matches[i].winner == 'none')
                allMatchesFinished = false;
        }
        if (allMatchesFinished)
            await this.prismaService.tourney.update({ where: { title: tourneyTitle }, data: { column: column + 1 } });

        return { success: true }
    }

    async getTourney(tourneyTitle: string) {
        // Check if tourney exists
        const tourney = await this.prismaService.tourney.findUnique({ where: { title: tourneyTitle } });
        if (!tourney)
            return { success: false, error: 'Could not find tourney' }

        // Get matches ordered by column from 0 to n then rowPosition from 0 to n
        const matches = await this.prismaService.matches.findMany({
            where: { tourneyId: tourney.id },
            orderBy: [{ column: 'asc' }, { rowPosition: 'asc' }]
        });
        if (!matches)
            return { success: false, error: 'Could not find matches' }

        let retTourney = [];
        for (let i = 0; i < matches.length; i++) {
            retTourney.push({
                firstTeam: matches[i].firstTeam,
                secondTeam: matches[i].secondTeam,
                winner: matches[i].winner,
                rowPosition: matches[i].rowPosition,
                column: matches[i].column,
            })
        }
        return { success: true, tourney: retTourney }
    }


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
                        winner: teams[i],
                        rowPosition: j,
                        column: 0,
                    }
                });
                if (!match)
                    return { success: false, error: 'Could not create match' }
                // Add new match to the next column with the winner of the previous match
                const match2 = await this.prismaService.matches.create({
                    data: {
                        tourneyId: tourney.id,
                        firstTeam: teams[i],
                        secondTeam: 'none',
                        winner: 'none',
                        rowPosition: j, // todo pas ça
                        column: 1,
                    }
                });
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
