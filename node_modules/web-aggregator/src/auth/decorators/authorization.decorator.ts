import {applyDecorators, UseGuards} from "@nestjs/common";
import {JwtGuard} from "../guards";
import {RoleEnum} from "@prisma/client";
import {Roles} from "./roles.decorator";
import {RolesGuard} from "../guards";

export function Authorization(...roles:RoleEnum[]){
    if(roles.length > 0){
        return applyDecorators(Roles(...roles), UseGuards(JwtGuard,RolesGuard))
    }
    return applyDecorators(UseGuards(JwtGuard));
}