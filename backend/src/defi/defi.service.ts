import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DefiService {
    constructor(private prismaService: PrismaService) { }


    async createDefi(room: any, username: any, opponentUsername: any) {
        const user = await this.prismaService.user.findUnique({
            where: {
                name: username,
            },
        });
        const opponentUser = await this.prismaService.user.findUnique({
            where: {
                name: opponentUsername,
            },
        });

        const findDefi = await this.prismaService.defi.findMany({
            where: {
                creatorId: user.id,
                opponentId: opponentUser.id,
            },
        });
        if (!findDefi) {
            const defi = await this.prismaService.defi.create({
                data: {
                    creatorId: opponentUser.id,
                    opponentId: user.id,
                    creatorHonor: false,
                    opponentHonor: false,
                    creatorBid: 0,
                    opponentBid: 0,
                    gameSelected: '',
                    contractTerms: '',
                },
            });
        }
        else
            console.log("Defi already exists");
    }
}
