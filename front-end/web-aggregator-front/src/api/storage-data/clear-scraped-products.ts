import api from "../axios";

export function clearScrapedProducts(){
    return api.delete("/scraper/clean-collection")
}