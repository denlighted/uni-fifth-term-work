import api from "../axios";

export function startScraperFora() {
    return api.post("/scraper/all/fora-products")
}