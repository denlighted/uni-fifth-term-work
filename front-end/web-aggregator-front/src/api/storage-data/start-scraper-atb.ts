import api from "../axios";

export function startScraperAtb() {
    return api.post("/scraper/all/atb-products")
}