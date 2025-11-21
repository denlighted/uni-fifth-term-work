import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export function PasswordMatches(validationOption?:ValidationOptions){
    return (object:any,propertyName:string) => {
        registerDecorator({
            name:"PasswordMatches",
            target:object.constructor,
            propertyName,
            options:validationOption,
            validator:{
                validate(value :any , args?: ValidationArguments) {
                    const object = args!.object as any // we can get another vars of DTO from our args object, like here we operate with password. On other hand, with value we operate our current value
                    return object.password && object.passwordConfirm && object.password === object.passwordConfirm;

                },
                defaultMessage(args?: ValidationArguments): string {
                    return "Passwords do not match !"
                }
            }
        })
    }
}