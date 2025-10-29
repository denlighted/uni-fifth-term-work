import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {getJwtConfig} from "./config";
import {GoogleStrategy, JwtStrategy} from "./strategies";
import {MailModule} from "../mail/mail.module";

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,GoogleStrategy],
  imports:[PrismaModule,MailModule,JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: getJwtConfig,
    inject: [ConfigService],
  }),
    PassportModule,],
})
export class AuthModule {}{}
