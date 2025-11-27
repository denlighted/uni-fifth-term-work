import api from "../axios";

export function favoriteProducts() {

    return api.get('favorites/list')
}