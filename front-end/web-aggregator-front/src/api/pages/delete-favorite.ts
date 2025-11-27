import {FavoritesRequest} from "@project/shared/dist/pages/favorites-request";
import api from "../axios";

export function deleteOrAddToFavorite(data:FavoritesRequest){
    return api.post('/favorites/toggle',data)
}