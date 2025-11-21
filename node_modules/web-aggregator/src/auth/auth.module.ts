import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PassportModule} from "@nestjs/passport";
import {getJwtConfig} from "./config";
import {GoogleStrategy, JwtStrategy} from "./strategies";
import {MailModule} from "../mail/mail.module";
import {MorganMiddleware} from "@nest-middlewares/morgan";
import {RestUserService} from "./services/rest-user.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,GoogleStrategy,RestUserService],
  imports:[PrismaModule,MailModule,JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: getJwtConfig,
    inject: [ConfigService],
  }),
    PassportModule,],
  exports:[RestUserService]
})
export class AuthModule{}
