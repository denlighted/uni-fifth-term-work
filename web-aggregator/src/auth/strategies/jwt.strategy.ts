import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {AuthService} from "../services/auth.service";
import {ConfigService} from "@nestjs/config";
import { ExtractJwt, Strategy } from 'passport-jwt';
import {JwtPayload} from "../interfaces";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService,
                private readonly configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey:configService.getOrThrow<string>("JWT_SECRET"),
            algorithm:["HS256"],

        });
    }

    async validate(payload:JwtPayload) {
        return await this.authService.validate(payload.sub);
    }

}