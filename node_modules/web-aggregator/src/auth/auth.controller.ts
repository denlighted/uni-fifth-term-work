import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    Param, UseInterceptors
} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import type {Response, Request} from 'express';
import {ChangePasswordRequest, LoginRequest, RegisterRequest, UpdateProfileRequest} from "./dto";
import {Authorized} from "./decorators";
import {Authorization} from "./decorators";
import {ForgotPasswordRequest} from "./dto";
import {ResetPasswordRequest} from "./dto";
import {AuthGuard} from "@nestjs/passport";
import {GooglePayload} from "./interfaces/google-oatuh.interface.jwt";
import {RoleEnum} from "./enums";
import  type {UpdateRoleRequest} from "./dto";
import {RestUserService} from "./services/rest-user.service";
import {ConfigService} from "@nestjs/config";
import {UserPopulatingInterceptor} from "../common/interceptors/user-populating.interceptor";
import {UserInfoInterceptor} from "../common/interceptors/user-population-by-id.interceptor";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
                private readonly restUserService: RestUserService,
                private readonly configService: ConfigService,) {
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
    @UseInterceptors(UserInfoInterceptor)
    async me(@Authorized('id') id: string,) {
        return {id};
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    async forgotPassword(@Req() req: Request, @Body() dto: ForgotPasswordRequest) {
        return this.authService.forgotPassword(req, dto)
    }

    @Patch('reset-password')
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

    @Patch('change-password')
    @HttpCode(HttpStatus.OK)
    @Authorization()
    async changePassword(@Req() req:Request,@Body() dto: ChangePasswordRequest) {
        return this.authService.changePassword(req,dto);
    }

    @Patch("change-profile")
    @HttpCode(HttpStatus.OK)
    @Authorization()
    async changeProfile(@Req() req:Request, @Body()dto: UpdateProfileRequest) {
        return this.authService.changeMe(req,dto);
    }

    @Delete("delete-me")
    @HttpCode(HttpStatus.OK)
    @Authorization()
    async deleteMe(@Req()req:Request, @Res({passthrough:true})res:Response){
        return this.authService.deleteMe(req,res);
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
        await this.authService.googleAuth(res, req.user as GooglePayload);
        return res.redirect(this.configService.getOrThrow("FRONTEND_HOST"));
    }

    ////////////////////////////////////////////

    @Get('user/:id')
    @Authorization()
    @HttpCode(HttpStatus.OK)
    async getUserById(@Param('id') id: string){
        return this.restUserService.getUserById(id)
    }

}






