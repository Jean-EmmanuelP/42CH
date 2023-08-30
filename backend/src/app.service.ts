import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor() { }

  async clearServer() {
    const tmp = new PrismaService();
    await tmp.defiRequest.deleteMany();
    await tmp.defi.deleteMany();
    await tmp.$disconnect();

    // set balance of every player above 20000 and below 4000 to 10000
    const players = await tmp.user.findMany();
    for (const player of players) {
      if (player.balance > 4000 && player.balance < 20000) {
        await tmp.user.update({
          where: {
            name: player.name
          },
          data: {
            balance: 10000
          }
        });
      }
    }
  }
}
