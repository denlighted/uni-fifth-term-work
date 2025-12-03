import {FavoritesRequest} from "@project/shared/dist/pages/favorites-request";
import api from "../axios";

export function deleteOrAddToCart(data:FavoritesRequest){
    return api.post('/best-cart/toggle',data)
}