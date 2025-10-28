import {Injectable, InternalServerErrorException} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class MailService {
    private readonly transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host:configService.getOrThrow<string>("EMAIL_HOST"),
            port:configService.getOrThrow<number>("EMAIL_PORT"),
            auth:{
                user:configService.getOrThrow<string>("EMAIL_USERNAME"),
                pass:configService.getOrThrow<string>("EMAIL_PASSWORD"),
            }
        });

        console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
        console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    }



    async sendMail(to:string, subject:string, text:string, html?:string) {
        try {
            await this.transporter.sendMail({
                from:`"Denys Harkovenko" ${this.configService.getOrThrow<string>("MAIL_FROM")}`,
                to,
                subject,
                text,
                html
            });

        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException("Failed to send message");
        }


    }

}
