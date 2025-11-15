import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import axios from "axios";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../prisma/prisma.service";
import {User} from "@prisma/client";
import {Request, Response} from "express";
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

    private async getSupermarketsByBrandAndGeo(brand: string, req:Request): Promise<StoreInfoInterface[]> {

        const currentUser  = req.user as User;

        const user = await this.prismaService.user.findUnique({where: {id: currentUser.id, isActive:true}});
        

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

            return (data.elements || []).map(el => ({
                id: el.id,
                name: el.tags?.name || "Unknown market",
                brand: el.tags?.brand || brand,
                address: `${el.tags?.["addr:street"] || ""} ${el.tags?.["addr:housenumber"] || ""}`.trim(),
                lat: el.lat || el.center?.lat,
                lon: el.lon || el.center?.lon,
            }));
        } catch (err) {
            console.error(`[Overpass API] Error fetching ${brand}:`, err.message);
            return [];
        }
    }

    async getSupermarketsGeo(req: Request):Promise<StoreInfoInterface[]> {
        const foraStores = await this.getSupermarketsByBrandAndGeo('Фора',req);
        const atbStores = await this.getSupermarketsByBrandAndGeo('АТБ-Маркет',req);

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
