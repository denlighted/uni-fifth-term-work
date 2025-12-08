import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {User} from "@prisma/client";


@Injectable()
export class RestUserService {
    constructor(private readonly prismaService: PrismaService) {
    }

    async getAllUsers(): Promise<User[]> {
        return await this.prismaService.user.findMany({where:{isActive:true}});
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.prismaService.user.findUnique({where: { id, isActive: true }});

        if(!user){
            throw new NotFoundException("The user has not found");
        }
        return user;
    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.prismaService.user.findUnique({where: {id}});

        if(!user){
            throw new NotFoundException("The user has not found");
        }
        await this.prismaService.user.delete({where: {id}});
    }
}