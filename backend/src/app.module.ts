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

@Module({
  imports: [PrismaModule, DefiModule, EventsModule],
  controllers: [AppController, DefiController],
  providers: [AppService, DefiGateway, DefiService, PrismaService],
})
export class AppModule { }
