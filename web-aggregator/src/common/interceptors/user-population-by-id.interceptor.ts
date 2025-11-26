import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {from, mergeMap, Observable, switchMap} from "rxjs";
import {RestUserService} from "../../auth/services/rest-user.service";

@Injectable()
export class UserInfoInterceptor  implements NestInterceptor {
    constructor(private readonly restUserService: RestUserService) {
    }

     intercept(context: ExecutionContext, next: CallHandler<any>):Observable<any> {
        return next.handle().pipe(
            mergeMap(async (data) =>{
                const user = await this.restUserService.getUserById(data.id)
                return {
                    id: data.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    pictureUrl:user.pictureUrl,
                    address:user.address,
                    phoneNumber:user.phoneNumber
                };
            }),
        );
    }

}