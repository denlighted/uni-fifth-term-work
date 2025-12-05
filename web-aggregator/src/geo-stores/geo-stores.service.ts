import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import axios from "axios";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../prisma/prisma.service";
import {StoreInfoInterface} from "./interfaces/store-info.interface";

@Injectable()
export class GeoStoresService {

    private readonly RADIUS: number;
    private readonly URL:string;

    constructor(private readonly configService: ConfigService,
                private readonly prismaService: PrismaService,) {
        this.RADIUS = configService.getOrThrow<number>("SEARCH_RADIUS")
        this.URL = configService.getOrThrow<string>("OVERPASS_API_URL")

    }


    private async getSupermarketsByBrandAndGeo(brand: string, userId:string): Promise<StoreInfoInterface[]> {



        const user = await this.prismaService.user.findUnique({where: {id: userId, isActive:true}});
        

        if(!user){
            throw new NotFoundException("User has no been found");
        }

        if(!user.address){
            throw new BadRequestException("User has not specified address yet");
        }

        const geo =  await this.geocodeAddress(user.address);

        if(!geo){
            throw new BadRequestException("Unable to geocode user address");
        }

        const{lat,lon} = geo;




        const query = `
        [out:json][timeout:25];
        (
          node["shop"="supermarket"]["brand"="${brand}"](around:${this.RADIUS},${lat}, ${lon});
          way["shop"="supermarket"]["brand"="${brand}"](around:${this.RADIUS},${lat}, ${lon});
          relation["shop"="supermarket"]["brand"="${brand}"](around:${this.RADIUS},${lat}, ${lon});
        );
        out center;
    `;

        try {
            const {data} = await axios.post(this.URL, `data=${encodeURIComponent(query)}`, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": "GeoStoresService/1.0",
                    "Accept-Encoding": "gzip"
                },
                timeout: 30000
            });



            const storeInfoPromises = (data.elements || []).map(async (el) => {
                const address = await this.getAddressFromCoordinates(el.lat, el.lon); // Получаем адрес
                const distance = this.calculateDistance(lat, lon, el.lat, el.lon); // Вычисляем дистанцию
                return {
                    id: el.id,
                    name: el.tags?.name || "Unknown market",
                    brand: el.tags?.brand || brand,
                    address: address,
                    lat: el.lat || el.center?.lat,
                    lon: el.lon || el.center?.lon,
                    homeLat: lat,
                    homeLon: lon,
                    distance: distance
                };
            });

            // Ждем выполнения всех промисов
            return await Promise.all(storeInfoPromises);
        } catch (err) {
            console.error(`[Overpass API] Error fetching ${brand}:`, err.message);
            return [];
        }
    }

    async getAddressFromCoordinates(lat: number, lon: number): Promise<string> {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
                params: {
                    lat: lat,
                    lon: lon,
                    format: 'json',
                    addressdetails: 1  // Обратите внимание на этот параметр
                }
            });

            // Проверяем наличие данных в ответе
            if (response.data && response.data.address) {
                // Возвращаем полный адрес, включая дом
                const address = response.data.address;
                const formattedAddress = `${address.road || ''} ${address.house_number || ''}`;
                return formattedAddress.trim() || 'Unknown address';
            }
            return 'Address not found';
        } catch (error) {
            console.error("Error fetching address:", error);
            return 'Error fetching address';
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number):number{
        const R = 6371; // Радиус Земли в километрах
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Расстояние в километрах
    }

    async getSupermarketsGeo(userId:string):Promise<StoreInfoInterface[]> {
        const foraStores = await this.getSupermarketsByBrandAndGeo('Фора',userId);
        const atbStores = await this.getSupermarketsByBrandAndGeo('АТБ-Маркет',userId);

        return foraStores.concat(atbStores)
    }

     private async geocodeAddress(address:string){
         const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;

         const { data } = await axios.get(url, {
             params: {
                 access_token: this.configService.getOrThrow("MAPBOX_PUBLIC_TOKEN"),
                 limit: 1,
                 language: "uk"
             }
         });

         if (!data.features.length) return null;

         const f = data.features[0];

         return {
             lat: f.center[1],
             lon: f.center[0],
             displayName: f.place_name,
         };

    }

}
