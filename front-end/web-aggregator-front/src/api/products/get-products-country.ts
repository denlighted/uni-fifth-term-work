import api from "../axios";

export function getUniqueCountries(){
    return api.get("/products/unique-countries")
}