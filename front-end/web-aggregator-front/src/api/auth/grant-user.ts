import {UpgradeUserRequest} from "@project/shared/dist/auth/grant-user-request";
import api from "../axios";

export function grandUser(data:UpgradeUserRequest){
    return api.patch("/auth/upgrade-role",data)
}