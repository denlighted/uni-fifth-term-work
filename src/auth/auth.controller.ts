import {Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import type {Response, Request} from 'express';
import {LoginRequest, RegisterRequest} from "./dto";
import {Authorized} from "./decorators";
import {Authorization} from "./decorators";
import {ForgotPasswordRequest} from "./dto/forgot-password.dto";
import {ResetPasswordRequest} from "./dto/reset-password.dto";
import {AuthGuard} from "@nestjs/passport";
import {GooglePayload} from "./interfaces/google-oatuh.interface.jwt";
import {RoleEnum} from "./enums";
import {UpdateRoleRequest} from "./dto/change-role.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }


    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Res({passthrough: true}) res: Response, @Body() dto: RegisterRequest) {
        return await this.authService.register(res, dto)
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Res({passthrough: true}) res: Response, @Body() dto: LoginRequest) {
        return await this.authService.login(res, dto)
    }

    @Post("refresh")
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: Request, @Res({passthrough: true}) res: Response) {
        return await this.authService.refresh(req, res)
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    async logout(@Res({passthrough: true}) res: Response) {
        return await this.authService.logout(res);
    }

    @Authorization()
    @Get("@me")
    @HttpCode(HttpStatus.OK)
    async me(@Authorized('id') id: string,) {
        return {id};
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Req() req: Request, @Body() dto: ForgotPasswordRequest) {
        return this.authService.forgotPassword(req, dto)
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Query('token') token: string, @Body() dto: ResetPasswordRequest) {
        return this.authService.resetPassword(token, dto);
    }

    @Patch('upgrade-role')
    @HttpCode(HttpStatus.OK)
    @Authorization(RoleEnum.ADMIN)
    async makeAdmin(@Body() dto: UpdateRoleRequest) {
        return this.authService.getPrivilage(dto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @HttpCode(HttpStatus.OK)
    async googleAuth(){

    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @HttpCode(HttpStatus.OK)
    async googleAuthCallback(@Req() req:Request, @Res({passthrough:true}) res:Response){
        return this.authService.googleAuth(res, req.user as GooglePayload);
    }

}






