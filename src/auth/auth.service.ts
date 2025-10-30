import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {LoginRequest, RegisterRequest} from "./dto";
import {hash, verify} from "argon2";
import {isDev} from "../../utils/is-dev.utils";
import type {Response, Request} from 'express'
import {RoleEnum, TokenType} from "./enums";
import ms from "ms";
import type {StringValue} from 'ms';
import {JwtPayload} from "./interfaces";
import {AppService} from "../app.service";
import {MailService} from "../mail/mail.service";
import {ForgotPasswordRequest} from "./dto/forgot-password.dto";
import * as crypto from "node:crypto";
import * as bcrypt from 'bcrypt'
import {ResetPasswordRequest} from "./dto/reset-password.dto";
import {GooglePayload} from "./interfaces/google-oatuh.interface.jwt";
import {UpdateRoleRequest} from "./dto/change-role.dto";


@Injectable()
export class AuthService {

    private readonly JWT_ACCESS_TOKEN_TTL: string;
    private readonly JWT_REFRESH_TOKEN_TTL: string;

    private readonly COOKIE_DOMAIN: string;

    constructor(private readonly prismaService: PrismaService,
                private readonly configService: ConfigService,
                private jwtService: JwtService,
                private readonly mailService: MailService,
    ) {
        this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL');
        this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
    }

    async register(res: Response, dto: RegisterRequest) {
        const {email, password, firstName, lastName, phoneNumber} = dto;

        const role = RoleEnum.USER;


        const existUser = await this.prismaService.user.findUnique({where: {email}});

        if (existUser) {
            throw new ConflictException('User already exists');
        }
        const user = await this.prismaService.user.create({
            data: {
                email,
                passwordHash: await hash(password),
                firstName,
                lastName,
                phoneNumber,
                role
            },
        });

        return this.auth(res, user.id, email, role);
    }


    async googleAuth(res: Response, profile: GooglePayload) {
        const {provider, providerId, email, givenName, familyName, picture} = profile;

        let user = await this.prismaService.user.findFirst({where: {provider, providerId}});

        if (!user && email) {
            user = await this.prismaService.user.findUnique({where: {email}});

            if (user) {
                user = await this.prismaService.user.update({
                    where: {id: user.id},
                    data: {provider, providerId, pictureUrl: picture},
                });
            }
        }

        if (!user) {
            user = await this.prismaService.user.create({
                data: {
                    email,
                    firstName: givenName,
                    lastName: familyName,
                    passwordHash: '',
                    role: RoleEnum.USER,
                    provider,
                    providerId,
                    pictureUrl: picture,
                },
            });
        }

        return this.auth(res, user.id, user.email, user.role as RoleEnum);

    }


    async login(res: Response, dto: LoginRequest) {
        const {email, password} = dto;

        const user = await this.prismaService.user.findUnique({
            where: {email},
            select: {id: true, passwordHash: true, email: true, role: true},
        });


        if (!user) {
            throw new NotFoundException('User does not exist');
        }

        const isValidPassword = await verify(user.passwordHash, password);

        if (!isValidPassword) {
            throw new NotFoundException('Invalid credentials');
        }

        return this.auth(res, user.id, user.email, user.role as RoleEnum)
    }


    async refresh(req: Request, res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        console.log(refreshToken);

        if (!refreshToken) {
            throw new UnauthorizedException('Not valid refreshToken');
        }
        const payLoad: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

        if (payLoad) {
            const user = await this.prismaService.user.findUnique({
                where: {id: payLoad.id},
                select: {
                    id: true,
                    email: true,
                    role: true
                }
            });

            if (!user) {
                throw new NotFoundException("User has not been found");
            }

            return this.auth(res, user.id, user.email, user.role as RoleEnum);
        }
    }


    async validate(id: string) {
        const user = this.prismaService.user.findUnique({where: {id}});
        if (!user) {
            throw new NotFoundException("User has not found");
        }

        return user;
    }

    private async auth(res: Response, id: string, email: string, role: RoleEnum) {
        const {accessToken, refreshToken} = await this.generateTokens(id, email, role);

        this.setCookie(res, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

        return {accessToken};
    }

    async logout(res: Response) {
        this.setCookie(res, 'refresh_token', new Date(0))
        return true;
    }

    private async generateTokens(sub: string, email: string, role: RoleEnum) {
        const payLoad: JwtPayload = {sub, email, role};

        const accessToken = this.jwtService.sign(payLoad, {
            expiresIn: ms(this.JWT_ACCESS_TOKEN_TTL as StringValue) / 1000,
        });

        const refreshToken = this.jwtService.sign({...payLoad, type: TokenType.REFRESH},
            {expiresIn: ms(this.JWT_REFRESH_TOKEN_TTL as StringValue) / 1000},
        );

        await this.prismaService.token.create({
            data: {
                userId: sub,
                tokenHash: await hash(refreshToken),
                type: TokenType.REFRESH,
                expiresAt: new Date(
                    Date.now() + (ms(this.JWT_REFRESH_TOKEN_TTL as StringValue) ?? 0),
                ),
            },
        });

        return {accessToken, refreshToken};
    }

    private setCookie(res: Response, value: string, expires: Date) {
        res.cookie('refresh_token', value, {
            httpOnly: true,
            expires,
            secure: !isDev(this.configService),
            sameSite: isDev(this.configService) ? 'lax' : 'none',
        });
    }

    private async createPasswordResetToken() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        return {resetToken, tokenHash, expiresAt};

    }

    async forgotPassword(req: Request, dto: ForgotPasswordRequest) {
        const {email} = dto;

        const user = await this.prismaService.user.findUnique({where: {email}});
        if (!user) {
            return {message: 'If this email exists, a password reset link has been sent.'};
        }
        const {resetToken, tokenHash, expiresAt} = await this.createPasswordResetToken();

        await this.prismaService.token.create({
            data: {
                userId: user.id,
                tokenHash: tokenHash,
                type: TokenType.PASSWORD_RESET,
                expiresAt
            }
        });
        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${resetToken}`;


        await this.mailService.sendMail(
            email,
            'Reset your password',
            `Click to reset your password: ${resetUrl}`,
            `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`
        );

        return true;
    }

    async resetPassword(resetToken: string, dto: ResetPasswordRequest) {
        const hashedToken = crypto.createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const token = await this.prismaService.token.findFirst({
            where: {tokenHash: hashedToken, expiresAt: {gt: new Date()}},
        });

        if (!token || token.expiresAt < new Date()) {
            return {message: 'Token is invalid or has expired'};
        }

        const {password} = dto;

        const hashedPassword = await hash(password)

        await this.prismaService.user.update({
            where: {id: token.userId},
            data: {passwordHash: hashedPassword},
        });

        await this.prismaService.token.delete({where: {id: token.id}});

        return {message: 'Password successfully updated'};
    }

    async getPrivilage(dto:UpdateRoleRequest) {
        const { id, email } = dto;

        const user =
            (email && (await this.prismaService.user.findUnique({ where: { email } }))) ||
            (id && (await this.prismaService.user.findUnique({ where: { id } })));

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return this.prismaService.user.update({
            where: { id: user.id },
            data: { role: RoleEnum.ADMIN },
        });
    }
}

