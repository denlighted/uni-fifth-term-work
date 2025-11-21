import {RoleEnum} from "../enums";

export interface JwtPayload {
    sub: string;
    email: string;
    role?: RoleEnum;
    iat?: number;
    exp?: number;
}