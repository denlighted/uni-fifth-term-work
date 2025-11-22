import {ResetPasswordRequest} from "@project/shared";
import api from "../axios";

export function resetPassword(token:string,data:ResetPasswordRequest) {
   return  api.patch(`auth/reset-password?token=${token}`,data)
}