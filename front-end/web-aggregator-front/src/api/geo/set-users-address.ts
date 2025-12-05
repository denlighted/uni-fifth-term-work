import {GeoResponse} from "@project/shared/dist/geo/user-geo-response";
import api from "../axios";

export function setUsersAddress(data:GeoResponse){
    return api.patch(`/geo-stores/users-address`,data)
}