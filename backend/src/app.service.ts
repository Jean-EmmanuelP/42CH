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
  }
}
