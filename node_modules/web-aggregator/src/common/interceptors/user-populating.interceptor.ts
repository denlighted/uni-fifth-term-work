import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {from, mergeMap, Observable, switchMap} from "rxjs";
import {RestUserService} from "../../auth/services/rest-user.service";

@Injectable()
export class UserPopulatingInterceptor implements NestInterceptor {
    constructor(private readonly restUserService: RestUserService) {
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            mergeMap((data) => from(this.addUserData(data))),
        );
    }

    private async addUserData(data: any) {
        if (Array.isArray(data)) {
            return Promise.all(
                data.map(async (review) => {
                    const user = await this.restUserService.getUserById(review.userId);

                    return {
                        ...(review.toJSON?.() ?? review), user:
                            {
                                firstName: user.firstName,
                                lastName: user.lastName,
                            }
                    };
                }),
            );
        } else {
            const user = await this.restUserService.getUserById(data.userId);
            return {
                ...(data.toJSON?.() ?? data), user:
                    {
                        firstName: user.firstName,
                        lastName: user.lastName,
                    }
            };
        }
    }
}