import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefiController } from './defi/defi.controller';
import { DefiGateway } from './defi/defi.gateway';
import { DefiService } from './defi/defi.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { DefiModule } from './defi/defi.module';
import { EventsModule } from './events/events.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, DefiModule, EventsModule, UserModule],
  controllers: [AppController, DefiController],
  providers: [AppService, DefiGateway, DefiService, PrismaService, UserService],
})
export class AppModule { }
