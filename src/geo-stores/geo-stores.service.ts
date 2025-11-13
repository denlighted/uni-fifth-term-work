import {Injectable} from '@nestjs/common';
import axios from "axios";

@Injectable()
export class GeoStoresService {

    async getSupermarkets() {
        const query = `
[out:json][timeout:25];
(
  node["shop"="supermarket"]["brand"="АТБ-Маркет"](around:2000,50.4380,30.5219);
  way["shop"="supermarket"]["brand"="АТБ-Маркет"](around:2000,50.4380,30.5219);
  relation["shop"="supermarket"]["brand"="АТБ-Маркет"](around:2000,50.4380,30.5219);
);
out center;
`;
        const url = "https://overpass-api.de/api/interpreter";

        const { data } = await axios.post(url, `data=${encodeURIComponent(query)}`, {
            headers: { "Content-Type": "application/x-www-form-urlencoded",
                'User-Agent': 'MyTestApp/1.0 (https://example.com)'},
            timeout: 30000
        });

        const stores = (data.elements || []).map((el) => ({
            id: el.id,
            name: el.tags?.name || "Неизвестный супермаркет",
            brand: el.tags?.brand || null,
            address: `${el.tags?.["addr:street"] || ""} ${el.tags?.["addr:housenumber"] || ""}`.trim(),
            lat: el.lat || el.center?.lat,
            lon: el.lon || el.center?.lon,
        }));

        console.log("✅ Найдено супермаркетов:", stores.length);
        return stores;
    }



}
