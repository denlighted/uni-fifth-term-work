import {ForgotPasswordRequest} from "@project/shared";
import api from "../axios";

export function forgotPassword(data:ForgotPasswordRequest) {
    return  api.post("auth/forgot-password", data, { withCredentials: true });
}