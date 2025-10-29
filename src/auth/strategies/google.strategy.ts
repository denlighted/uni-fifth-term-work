import {PassportStrategy} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {Strategy, VerifyCallback} from "passport-google-oauth20";
import {Injectable} from "@nestjs/common";

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy,'google'){
    constructor(private readonly configService:ConfigService) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: "http://localhost:3000/api/auth/google/callback",
            scope: ["profile","email"],
        } as any);
    }

    async validate(
        accessToken:string,
        refreshToken:string,
        profile:any,
        done:VerifyCallback,):Promise<any>{
        const {id, name, emails, photos} = profile

        const user = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
        };

        done(null, user);
    }
}