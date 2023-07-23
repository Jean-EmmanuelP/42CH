import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DefiController } from './defi/defi.controller';
import { DefiGateway } from './defi/defi.gateway';
import { DefiService } from './defi/defi.service';

@Module({
  imports: [],
  controllers: [AppController, DefiController],
  providers: [AppService, DefiGateway, DefiService],
})
export class AppModule {}
