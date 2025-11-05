import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {ScrapedCategory, ScrapedProduct} from "../scraper/schemas";
import {Model} from "mongoose";
import Fuse, {FuseResult} from "fuse.js";

import {PrivateBrands} from "./schemas";
import {PrivateBrandsRequest} from "./dto";

@Injectable()
export class ProductsService {

    constructor(
        @InjectModel(ScrapedCategory.name) private category: Model<ScrapedCategory>,
        @InjectModel(ScrapedProduct.name) private product: Model<ScrapedProduct>,
        @InjectModel(PrivateBrands.name) private privateBrands:Model<PrivateBrands>,
        ) {}

    private normalizeName(name: string) {
        const stopWords = ['та', 'і', 'для', 'продукти', 'вироби', 'товари', 'шт', 'г', 'гр', 'мл',];
        return name
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, '')
            .split(' ')
            .filter(w => !stopWords.includes(w))
            .sort()
            .join(' ')
            .trim();
    }

    private normalizeNameProds(name: string, brand: string) {
        const stopWords = ['та', 'і', 'для', 'продукти', 'вироби', 'товари', 'шт', 'г', 'гр', 'мл'];


        return (name + ' ' + brand)
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, '')
            .split(/\s+/)
            .filter(word => !stopWords.includes(word))
            .sort()
            .join(' ')
            .trim();
    }

    // Словарь синонимов для «глубоких» совпадений
    private synonyms: Record<string, string> = {
        "Хліб та випічка": "Хлібобулочні вироби",
        "Фрукти, овочі та соління": "Овочі та фрукти",
        "Ковбаси та сири": "М'ясо і Сири",
        "Дитячі товари": "Товари для дітей",
        "Солодощі": "Кондитерські вироби",
        "М'ясо та риба": "М'ясо; Риба і морепродукти",
        "Бакалія, консерви та соуси": "Бакалія",
        "Заморожена продукція": "Заморожені продукти",
        "Піца та кулінарія": "Кулінарія",
    };

    async normalizeCategories() {
        const foraCategories = await this.category.find({store: "Fora"} );
        const atbCategoriesRaw = await this.category.find({store: "ATB"}, );

        // Нормализуем ATB категории
        const atbCategories = atbCategoriesRaw.map(cat => ({
            ...cat.toObject(),
            normalizedName: this.normalizeName(cat.name)
        }));


        // Настраиваем Fuse.js для поиска совпадений
        const fuse = new Fuse(atbCategories, {
            keys: ["name", 'normalizedName'],
            threshold: 0.3,
            includeScore: true
        });

        for (const foraCat of foraCategories) {
            const originalName = foraCat.name;

            const synonymMatch = this.synonyms[originalName];

            if (synonymMatch) {
                console.log(`✅ ${originalName} → ${synonymMatch} (через словарь)`);
                continue;

            }

            const normalizedFora = this.normalizeName(originalName);
            const results = fuse.search(normalizedFora, {limit: 3});
            const match = results.find(r => r.score !== undefined && r.score < 0.35);

            if (match) {
                console.log(`✅ ${originalName} ↔ ${match.item.name} (через Fuse.js)`);
            } else {
                console.log(`➕ ${originalName} (нет совпадений)`);
            }
        }
    }

    async exclusiveTest() {
        const privateBrands = await this.privateBrands.find();
        const blacklistedBrands = privateBrands.map(b => b.name);

        const brandRegex = blacklistedBrands.map(b => new RegExp(b, "i"));

        const products = await this.product.find({
            $and: [
                { "productInfo.Торгова марка": { $nin: blacklistedBrands } },
                { "productInfo.ВТМ Фора": { $nin: ["Так"] } },
                { name: { $not: { $in: brandRegex } } }
            ]
        });
        return  products ;
    }

    async normalizeProducts() {

        const products = await this.exclusiveTest()

        const foraProds = products.filter(p => p.store === "Fora");
        const atbProds = products.filter(p => p.store === "ATB");

        const fuse = new Fuse(atbProds, {
            keys: [
                { name: "name", weight: 0.7 },
                { name: "productInfo.Торгова марка", weight: 0.3 },
            ],
            isCaseSensitive: false,
            includeScore: true,
            includeMatches: true,
            shouldSort: true,
            minMatchCharLength: 2,

            useExtendedSearch: true,
            ignoreLocation: true,
            threshold: 0.42,
            distance: 200,
        });


        let numRes :number=0;
        for (const foraProd of foraProds) {
            const originalName = foraProd.name;

            const brand = foraProd.productInfo!['Торгова марка'] || '';
            const normalizedFora = this.normalizeNameProds(originalName as string,brand as string);

            const dynamicThreshold = originalName.length > 30 ? 0.2 : 0.35;

            const results = fuse.search(normalizedFora as string);
            const match = results.find(r => r.score !== undefined && r.score < dynamicThreshold);


            if (match) {
                console.log(`✅ ${originalName} ↔ ${match.item.name} (через Fuse.js)`);
                numRes+=1;
            } else {
                console.log(`➕ ${originalName} (нет совпадений)`);
            }

        }
        console.log(`Result quantity ${numRes}`);

    }

    async writePrivateBrands(dto:PrivateBrandsRequest){
        const {name,store,reason} = dto;

         await this.privateBrands.create({
             name:name,
             store:store,
             reason:reason
         })
         return true;
    }
}
