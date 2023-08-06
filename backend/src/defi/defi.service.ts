import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DefiService {
    constructor(private prismaService: PrismaService, private authService: AuthService) { }

    async getRoomNumber(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user)
            return { success: false, error: 'User not found' };
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2)
                return { success: false, error: 'User is not in a defi' };
            else
                return { success: true, roomNumber: defi2.id };
        }
        else
            return { success: true, roomNumber: defi.id };
    }

    async changeMode(username: any, newMode: any) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user)
            return { success: false, error: 'User not found' };
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
            if (!defi2)
                return { success: false, error: 'User is not in a defi' };
            else {
                await this.prismaService.defi.update({
                    where: { opponentId: id },
                    data: { isPublic: newMode },
                });
                return { success: true };
            }
        }
        else {
            await this.prismaService.defi.update({
                where: { creatorId: id },
                data: { isPublic: newMode },
            });
            return { success: true };
        }
    }

    async betPublicChallenge(username: string, challengeId: string, amount: number, winner: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user)
            return { success: false, error: 'User not found' };
        const userWinner = await this.prismaService.user.findUnique({ where: { name: winner } });
        if (!userWinner)
            return { success: false, error: 'Winner not found' };
        const challenge = await this.prismaService.challenge.findUnique({ where: { id: challengeId } });
        if (!challenge)
            return { success: false, error: 'Challenge not found' };
        if (user.id == challenge.creatorId || user.id == challenge.opponentId)
            return { success: false, error: 'User cannot bet on his own challenge' };
        if (user.balance < amount)
            return { success: false, error: 'Not enough money' };
        const userBets = await this.prismaService.usersBet.findMany({ where: { challengeId: challenge.id } });
        for (let i = 0; i < userBets.length; i++) { // If the user has already bet on this challenge, we increment his bet
            if (userBets[i].userId == user.id) {
                await this.prismaService.usersBet.update({
                    where: { id: userBets[i].id },
                    data: { amount: { increment: amount } },
                });
                await this.prismaService.user.update({ where: { id: user.id }, data: { balance: { decrement: amount } } })
                return { success: true };
            }
        }
        // If the user has not bet on this challenge, we create a new bet
        await this.prismaService.usersBet.create({
            data: {
                userId: user.id,
                challengeId: challenge.id,
                amount: amount,
                winnerId: userWinner.id,
            }
        });
        await this.prismaService.user.update({ where: { id: user.id }, data: { balance: { decrement: amount } } })
        return { success: true };
    }

    async splitBetToWinners(challengeId: string) {
        const challenge = await this.prismaService.challenge.findUnique({ where: { id: challengeId } });
        if (!challenge)
            return { success: false, error: 'Challenge not found' };
        const usersBets = await this.prismaService.usersBet.findMany({ where: { challengeId: challenge.id } });
        if (usersBets.length == 0)
            return { success: false, error: 'No bets found' };
        let winners = [];
        let losers = [];
        for (let i = 0; i < usersBets.length; i++) {
            if (usersBets[i].winnerId == challenge.creatorWinner) // en s'assurant d'envoyer dans cette fonction que s'il y a pas de litige entre creatorWinner et opponentWinner
                winners.push({ id: usersBets[i].userId, amount: usersBets[i].amount });
            else
                losers.push({ id: usersBets[i].userId, amount: usersBets[i].amount });
        }
        let winnerTotalBet = 0;
        let loserTotalBet = 0;
        for (let i = 0; i < winners.length; i++)
            winnerTotalBet += winners[i].amount;
        for (let i = 0; i < losers.length; i++)
            loserTotalBet += losers[i].amount;
        if (loserTotalBet == 0) {
            for (let i = 0; i < winners.length; i++)
                await this.prismaService.user.update({ where: { id: winners[i].id }, data: { balance: { increment: winners[i].amount } } })
            return { success: true }
        }
        else {
            for (let i = 0; i < winners.length; i++) {
                await this.prismaService.user.update({ where: { id: winners[i].id }, data: { balance: { increment: (winners[i].amount / winnerTotalBet) * (winnerTotalBet + loserTotalBet) } } })
            }
            return { success: true };
        }
    }

    async getAllPublicChallenges() {
        const publicChallenges = await this.prismaService.challenge.findMany({ where: { isPublic: true } })
        if (publicChallenges.length == 0)
            return { success: false, error: 'No public challenges found' };
        let publicChallengesInfos = [];
        for (let i = 0; i < publicChallenges.length; i++) {
            publicChallengesInfos.push({
                id: publicChallenges[i].id,
                creatorName: (await this.prismaService.user.findUnique({ where: { id: publicChallenges[i].creatorId } })).name,
                opponentName: (await this.prismaService.user.findUnique({ where: { id: publicChallenges[i].opponentId } })).name,
                creatorImage: (await this.prismaService.user.findUnique({ where: { id: publicChallenges[i].creatorId } })).image,
                opponentImage: (await this.prismaService.user.findUnique({ where: { id: publicChallenges[i].opponentId } })).image,
                creatorBid: publicChallenges[i].creatorBid,
                opponentBid: publicChallenges[i].opponentBid,
                gameSelected: publicChallenges[i].gameSelected,
                contractTerms: publicChallenges[i].contractTerms,
                timerPublic: publicChallenges[i].timerPublic, // Timer de fin, comparé dans le front avec Date.now() / 1000 (seconds)
            })
        }
        return { success: true, publicChallenges: publicChallengesInfos }
    }

    async userBetOnPublicChallenge(username: string, challengeId: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } })
        if (!user)
            return { success: false, error: 'User not found' }
        const challenge = await this.prismaService.challenge.findUnique({ where: { id: challengeId } })
        if (!challenge)
            return { success: false, error: 'Challenge not found' }
        const usersBet = await this.prismaService.usersBet.findMany({ where: { challengeId: challenge.id } })
        if (!usersBet)
            return { success: false, error: 'No bets found' }
        for (let i = 0; i < usersBet.length; i++) {
            if (usersBet[i].userId == user.id)
                return { success: true, userBet: usersBet[i].amount }
        }
        return { success: false, error: 'User has not bet on this challenge' }
    }

    async getOpponent(id: string) { // image name
        const user = await this.prismaService.user.findUnique({ where: { id: id } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        return { success: true, image: user.image, name: user.name };
    }

    async ongoing(username: string) {
        let ret = [];
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        const defi = await this.prismaService.defi.findUnique({ where: { creatorId: id } });
        if (!defi) {
            return { success: false, error: 'User is not in a defi' };
        }
        ret.push({ id: defi.id, opponentName: (await this.prismaService.user.findUnique({ where: { id: defi.opponentId } })).name, creatorName: (await this.prismaService.user.findUnique({ where: { id: defi.creatorId } })).name })
        const defi2 = await this.prismaService.defi.findUnique({ where: { opponentId: id } });
        if (!defi2) {
            return { success: true, defis: ret };
        }
        ret.push({ id: defi2.id, opponentName: (await this.prismaService.user.findUnique({ where: { id: defi2.opponentId } })).name, creatorName: (await this.prismaService.user.findUnique({ where: { id: defi2.creatorId } })).name })
        return { success: true, defis: ret };
    }

    async getImage(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        return { success: true, image: user.image };
    }

    async finish(username: string, challengeId: string, winner: string) {
        const challenge = await this.prismaService.challenge.findUnique({ where: { id: challengeId } });
        if (!challenge) {
            return { success: false, error: 'Challenge not found' };
        }
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const id = user.id;
        if (challenge.creatorId == id) {
            const challenge2 = await this.prismaService.challenge.update({ where: { id: challengeId }, data: { creatorWinner: winner, creatorAnswer: true } });
            if (challenge2.opponentAnswer == true) {
                // If both users have answered, we can finish the challenge
                if (challenge2.creatorWinner === challenge2.opponentWinner) {
                    let user = await this.prismaService.user.findUnique({ where: { id: challenge2.creatorId } });
                    if (challenge2.creatorWinner == user.name)
                        await this.prismaService.user.update({ where: { id: challenge2.creatorId }, data: { balance: { increment: challenge2.creatorBid + challenge2.opponentBid } } })
                    else {
                        await this.prismaService.user.update({ where: { id: challenge2.opponentId }, data: { balance: { increment: challenge2.creatorBid + challenge2.opponentBid } } })
                    }
                    if (challenge2.isPublic == true)
                        await this.splitBetToWinners(challengeId);
                    await this.prismaService.challenge.update({ where: { id: challengeId }, data: { status: "finished", isPublic: false } })
                    return { success: true }
                }
            }
        }
        else if (challenge.opponentId == id) {
            const challenge3 = await this.prismaService.challenge.update({ where: { id: challengeId }, data: { opponentWinner: winner, opponentAnswer: true } });
            if (challenge3.creatorAnswer == true) {
                // If both users have answered, we can finish the challenge
                if (challenge3.creatorWinner === challenge3.opponentWinner) {
                    let user = await this.prismaService.user.findUnique({ where: { id: challenge3.creatorId } });
                    if (challenge3.creatorWinner == user.name)
                        await this.prismaService.user.update({ where: { id: challenge3.creatorId }, data: { balance: { increment: challenge3.creatorBid + challenge3.opponentBid } } })
                    else {
                        await this.prismaService.user.update({ where: { id: challenge3.opponentId }, data: { balance: { increment: challenge3.creatorBid + challenge3.opponentBid } } })
                    }
                    if (challenge3.isPublic == true)
                        await this.splitBetToWinners(challengeId);
                    await this.prismaService.challenge.update({ where: { id: challengeId }, data: { status: "finished", isPublic: false } })
                    return { success: true }
                }
            }
        }
    }

    async getAllChallenges(username: string, accessToken: string) {
        let ret = await this.authService.checkToken(username, accessToken);
        if (ret.success == false)
            return { success: false, error: 'Token' };
        if (username == null) {
            return { success: false, error: 'User is null' };
        }
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
                status: "pending",
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
                id: challenges[i].id,
                creatorName: creator.name,
                opponentName: opponent.name,
                creatorBid: challenges[i].creatorBid,
                opponentBid: challenges[i].opponentBid,
                gameSelected: challenges[i].gameSelected,
                contractTerms: challenges[i].contractTerms,
                status: challenges[i].status,
                creatorAnswer: challenges[i].creatorAnswer,
                opponentAnswer: challenges[i].opponentAnswer,
            });
        }
        return { success: true, challenges: challengesInfos, accessToken: ret.accessToken };
    }

    async createChallenge(username: string, creatorOrOpponent: string) {
        let defi;
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (creatorOrOpponent == "creator")
            defi = await this.prismaService.defi.findUnique({ where: { creatorId: user.id } });
        else
            defi = await this.prismaService.defi.findUnique({ where: { opponentId: user.id } });
        let timer: number = ((Date.now() / 1000) + defi.timerPublic)
        await this.prismaService.challenge.create({
            data: {
                creatorId: defi.creatorId,
                opponentId: defi.opponentId,
                creatorBid: defi.creatorBid,
                opponentBid: defi.opponentBid,
                gameSelected: defi.gameSelected,
                contractTerms: defi.contractTerms,
                status: "pending",
                isPublic: defi.isPublic,
                timerPublic: timer,
            }
        })
        setTimeout(async () => {
            await this.prismaService.challenge.update({ where: { id: defi.id }, data: { isPublic: false } })
        }, defi.timerPublic * 1000)
        await this.prismaService.defi.delete({ where: { id: defi.id } });
    }

    async getInfos(username: string, accessToken?: string) {
        let ret = await this.authService.checkToken(username, accessToken);
        console.log("getInfos", ret)
        if (ret.success == false)
            return { success: false, error: 'Token' };
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
            const opponent = await this.prismaService.user.findUnique({ where: { id: defi2.creatorId } });
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
                balance: user.balance,
                image: user.image,
                opponentBalance: opponent.balance,
                opponentId: opponent.id,
                isPublic: defi2.isPublic,
            }
        }
        const opponent = await this.prismaService.user.findUnique({ where: { id: defi.opponentId } });
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
            balance: user.balance,
            opponentBalance: opponent.balance,
            opponentId: opponent.id,
            image: user.image,
            isPublic: defi.isPublic,
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
                    await this.prismaService.user.update({ where: { id: newDefi.creatorId }, data: { balance: { decrement: newDefi.creatorBid } } })
                    await this.prismaService.user.update({ where: { id: newDefi.opponentId }, data: { balance: { decrement: newDefi.opponentBid } } })
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
                await this.prismaService.user.update({ where: { id: newDefi.creatorId }, data: { balance: { decrement: newDefi.creatorBid } } })
                await this.prismaService.user.update({ where: { id: newDefi.opponentId }, data: { balance: { decrement: newDefi.opponentBid } } })
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
            if (defiTest.length > 0) {
                await this.prismaService.defi.delete({ where: { creatorId: creatorId } });
            }
            else if (defiTest2.length > 0) {
                await this.prismaService.defi.delete({ where: { creatorId: opponentId } });
            }
            else if (defiTest3.length > 0) {
                await this.prismaService.defi.delete({ where: { opponentId: creatorId } });
            }
            else if (defiTest4.length > 0) {
                await this.prismaService.defi.delete({ where: { opponentId: opponentId } });
            }
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
        return { success: true, defiId: defi.id };
    }


    async createDefiRequest(senderUsername: any, receiverUsername: any, fix?: boolean) {
        const sender = await this.prismaService.user.findUnique({ where: { name: senderUsername } });
        const receiver = await this.prismaService.user.findUnique({ where: { name: receiverUsername } });
        if (!sender || !receiver) {
            return { success: false, error: 'User not found' };
        }
        const defiRequestTest = await this.prismaService.defiRequest.findMany({ where: { senderUsername: senderUsername, receiverUsername: receiverUsername } });
        // const defiRequestTest2 = await this.prismaService.defiRequest.findMany({ where: { senderUsername: receiverUsername, receiverUsername: senderUsername } });
        if (defiRequestTest.length > 0) {// || defiRequestTest2.length > 0) {
            return { success: false, error: 'Defi request already exists' };
        }
        const defiRequest = await this.prismaService.defiRequest.create({ data: { senderUsername: senderUsername, receiverUsername: receiverUsername } });
        setTimeout(async () => {
            let defi = await this.prismaService.defiRequest.findUnique({ where: { id: defiRequest.id } });
            if (defi) {
                await this.prismaService.defiRequest.delete({ where: { id: defiRequest.id } });
            }
        }, 300000);
        if (!defiRequest) {
            return { success: false, error: 'Defi request not created' };
        }
        if (fix != undefined && fix == true) {
            // 
        }
        return { success: true };
    }


    async getAllDefiRequests(username: string) {
        const user = await this.prismaService.user.findUnique({ where: { name: username } });
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        const defiRequests = await this.prismaService.defiRequest.findMany({ where: { receiverUsername: { equals: username } } });
        if (!defiRequests) {
            return { success: false, error: 'No defi requests found' };
        }
        let defiRequestsInfos = [];
        for (let i = 0; i < defiRequests.length; i++) {
            defiRequestsInfos.push({ id: defiRequests[i].id, senderUsername: defiRequests[i].senderUsername, receiverUsername: defiRequests[i].receiverUsername })
        }
        return { success: true, defiRequests: defiRequestsInfos };
    }

    // todo all the new functions after defiId reworked design
}
