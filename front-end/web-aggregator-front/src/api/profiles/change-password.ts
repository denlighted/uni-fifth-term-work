import {ChangePasswordFormRequest} from "@project/shared/dist/profile/changee-password-form-request";
import api from "../axios";

export function changePassword(data:ChangePasswordFormRequest) {
    return api.patch('/auth/change-password',data);
}