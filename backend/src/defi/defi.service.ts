import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DefiService {
    constructor(private prismaService: PrismaService) { }

    async getAllChallenges(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const challenges = await this.prismaService.challenge.findMany({
            where: {
                OR: [
                    { creatorId: id },
                    { opponentId: id },
                ],
            },
        });
        if (!challenges) {
            return { success: false, error: 'No challenges found', challenges: null };
        }
        let challengesInfos = [];
        for (let i = 0; i < challenges.length; i++) {
            let creator = await this.prismaService.user.findUnique({ where: { id: challenges[i].creatorId } });
            let opponent = await this.prismaService.user.findUnique({ where: { id: challenges[i].opponentId } });
            challengesInfos.push({
                creatorName: creator.name,
                opponentName: opponent.name,
                creatorBid: challenges[i].creatorBid,
                opponentBid: challenges[i].opponentBid,
                gameSelected: challenges[i].gameSelected,
                contractTerms: challenges[i].contractTerms,
                status: challenges[i].status,
            });
        }
        return { success: true, challenges: challengesInfos };
    }

    async createChallenge(username: string, creatorOrOpponent: string) {
        let defi;
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (creatorOrOpponent == "creator")
            defi = await this.prismaService.defi.findUnique({ where: { creatorId: user.id } });
        else
            defi = await this.prismaService.defi.findUnique({ where: { opponentId: user.id } });
        await this.prismaService.challenge.create({
            data: {
                creatorId: defi.creatorId,
                opponentId: defi.opponentId,
                creatorBid: defi.creatorBid,
                opponentBid: defi.opponentBid,
                gameSelected: defi.gameSelected,
                contractTerms: defi.contractTerms,
                status: "pending",
            }
        })
        await this.prismaService.defi.delete({ where: { id: defi.id } });
    }

    async getInfos(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2) {
                return { success: false, error: 'User is not in a defi' };
            }
            return {
                success: true,
                userBet: defi2.opponentBid,
                opponentBet: defi2.creatorBid,
                honorBet: defi2.opponentHonor,
                opponentHonorBet: defi2.creatorHonor,
                userAccepted: defi2.opponentAccepted,
                opponentAccepted: defi2.creatorAccepted,
                mutualContract: defi2.contractTerms,
                selectedGame: defi2.gameSelected,
            }
        }
        return {
            success: true,
            userBet: defi.creatorBid,
            opponentBet: defi.opponentBid,
            honorBet: defi.creatorHonor,
            opponentHonorBet: defi.opponentHonor,
            userAccepted: defi.creatorAccepted,
            opponentAccepted: defi.opponentAccepted,
            mutualContract: defi.contractTerms,
            selectedGame: defi.gameSelected,
        }
    }

    async changeAccept(username: any, newAccept: boolean) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found', challengeAccepted: false };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2) {
                return { success: false, error: 'User is not in a defi', challengeAccepted: false };
            }
            else {
                const newDefi = await this.prismaService.defi.update({
                    where: { opponentId: id },
                    data: { opponentAccepted: newAccept },
                });
                if (newDefi.creatorAccepted == true && newDefi.opponentAccepted == true) {
                    this.createChallenge(username, "opponent");
                    return { success: true, challengeAccepted: true }
                }
                return { success: true, challengeAccepted: false };
            }
        }
        else {
            const newDefi = await this.prismaService.defi.update({
                where: { creatorId: id },
                data: { creatorAccepted: newAccept },
            });
            if (newDefi.creatorAccepted == true && newDefi.opponentAccepted == true) {
                this.createChallenge(username, "creator");
                return { success: true, challengeAccepted: true }
            }
            return { success: true, challengeAccepted: false };
        }
    }

    async changeGame(username: any, newGame: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2) {
                return { success: false, error: 'User is not in a defi' };
            }
            else {
                await this.prismaService.defi.update({
                    where: { opponentId: id },
                    data: { gameSelected: newGame },
                });
                return { success: true };
            }
        }
        else {
            await this.prismaService.defi.update({
                where: { creatorId: id },
                data: { gameSelected: newGame },
            });
            return { success: true };
        }
    }

    async changeBet(username: any, newBet: any) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2) {
                return { success: false, error: 'User is not in a defi' };
            }
            else {
                await this.prismaService.defi.update({
                    where: { opponentId: id },
                    data: { opponentBid: newBet },
                });
                return { success: true };
            }
        }
        else {
            await this.prismaService.defi.update({
                where: { creatorId: id },
                data: { creatorBid: newBet },
            });
            return { success: true };
        }
    }

    async changeHonorBet(username: any, newHonorBet: boolean) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2) {
                return { success: false, error: 'User is not in a defi' };
            }
            else {
                await this.prismaService.defi.update({
                    where: { opponentId: id },
                    data: { opponentHonor: newHonorBet },
                });
                return { success: true };
            }
        }
        else {
            await this.prismaService.defi.update({
                where: { creatorId: id },
                data: { creatorHonor: newHonorBet },
            });
            return { success: true };
        }
    }


    async changeContract(username: any, newContract: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2) {
                return { success: false, error: 'User is not in a defi' };
            }
            else {
                await this.prismaService.defi.update({
                    where: { opponentId: id },
                    data: { contractTerms: newContract },
                });
                return { success: true };
            }
        }
        else {
            await this.prismaService.defi.update({
                where: { creatorId: id },
                data: { contractTerms: newContract },
            });
            return { success: true };
        }
    }

    async createDefi(creatorUsername: string, opponentUsername: string) {
        console.log("in create defi")
        const user1 = await this.prismaService.user.findUnique({ where: { name: creatorUsername, } });
        const user2 = await this.prismaService.user.findUnique({ where: { name: opponentUsername, } });
        if (!user1 || !user2) {
            return { success: false, error: 'User not found' };
        }
        const creatorId = user1.id;
        const opponentId = user2.id;
        // We check if the defi already exists
        // So the user cannot have 2 defis at the same time with the same opponent
        // But will be deleted and moved to Challenge if they agree
        const defiTest = await this.prismaService.defi.findMany({ where: { creatorId: creatorId } });
        const defiTest2 = await this.prismaService.defi.findMany({ where: { creatorId: opponentId } });
        const defiTest3 = await this.prismaService.defi.findMany({ where: { opponentId: creatorId } });
        const defiTest4 = await this.prismaService.defi.findMany({ where: { opponentId: opponentId } });
        if (defiTest.length > 0 || defiTest2.length > 0 || defiTest3.length > 0 || defiTest4.length > 0) {
            return { success: false, error: 'User already in a defi' };
        }
        const defi = await this.prismaService.defi.create({
            data: {
                creatorId: creatorId,
                opponentId: opponentId,
                creatorHonor: false,
                opponentHonor: false,
                creatorBid: 0,
                opponentBid: 0,
                gameSelected: '',
                contractTerms: '',
            },
        });
        console.log("defi created")
        return { success: true, defiId: defi.id };
    }
}
