import api from "./axios";
import type { RegisterRequest } from "@project/shared";

export function registerUser(data:RegisterRequest){
    return api.post('auth/register', data)
}
