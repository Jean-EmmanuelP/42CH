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
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, DefiModule, EventsModule, UserModule, AuthModule, AdminModule],
  controllers: [AppController, DefiController, AuthController, AdminController],
  providers: [AppService, DefiGateway, DefiService, PrismaService, UserService, AuthService, AdminService],
})
export class AppModule { }
