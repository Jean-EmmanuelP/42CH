import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DefiService {
    constructor(private prismaService: PrismaService) { }

    async changeBet(username: any, newBet: any) {
        const defi = await this.prismaService.defi.findMany({ where: { creatorId: username } });
        if (defi.length == 0) {
            const defi2 = await this.prismaService.defi.findMany({ where: { opponentId: username } });
            if (defi2.length == 0) {
                return { success: false, error: 'User is not in a defi' };
            }
            else {
                await this.prismaService.defi.update({
                    where: { opponentId: username },
                    data: { opponentBid: newBet },
                });
                console.log(defi2)
                return { success: true };
            }
        }
        else {
            await this.prismaService.defi.update({
                where: { creatorId: username },
                data: { creatorBid: newBet },
            });
            console.log(defi)
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
        return { success: true, defiId: defi.id };
    }
}
