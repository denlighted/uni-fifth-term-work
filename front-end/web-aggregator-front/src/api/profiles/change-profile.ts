import {ChangeProfileRequest} from "@project/shared/dist/profile/change-profile-request";
import api from "../axios";

export function changeProfile(data:ChangeProfileRequest){
    return api.patch('/auth/change-profile',data,{
        headers: {
            'Content-Type': 'application/json'
        }
    })
}