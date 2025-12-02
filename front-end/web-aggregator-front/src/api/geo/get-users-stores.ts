import api from "../axios";

export function getUsersStores() {
    return api.get(`geo-stores/stores`);
}