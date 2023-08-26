import { Module } from '@nestjs/common';
import { TourneyService } from './tourney.service';
import { TourneyController } from './tourney.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TourneyController],
  providers: [PrismaService, TourneyService]
})
export class TourneyModule { }
