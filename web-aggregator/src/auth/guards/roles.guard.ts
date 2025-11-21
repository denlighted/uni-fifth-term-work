import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import type {Request} from "express";
import {RoleEnum, User} from "@prisma/client";
import {ROLES_KEY} from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate{

    constructor(private readonly reflector : Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const rolesContext = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY,
            [context.getHandler(),
                context.getClass()]);

        if(!rolesContext){
            return true
        }

        const request = context.switchToHttp().getRequest() as Request &{ user?: User }
        const user = request.user as User;

        if(!rolesContext.includes(user.role)){
            throw new ForbiddenException({message:"You don't have enough permissions to perform this action."});
        }

        return true;
    }

}