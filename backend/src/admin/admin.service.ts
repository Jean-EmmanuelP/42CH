import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const admins = [process.env.admin1, process.env.admin2]

@Injectable()
export class AdminService {
    constructor(private prismaService: PrismaService) { }

    async changeBalance(admin: string, user: string, amount: number) {
        if (admins.includes(admin))
            return { success: false, error: "QUEST CE QUE TU FAIS LA" }

        const userChange = await this.prismaService.user.findUnique({ where: { name: user }, })

        if (!userChange)
            return { success: false, error: "User not found" }

        await this.prismaService.user.update({ where: { name: user }, data: { balance: amount } })
        return { success: true, message: `Balance of user ${user} changed by ${amount}` }
    };
}
