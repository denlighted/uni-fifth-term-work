import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {ScrapedCategory, ScrapedProduct} from "../../scraper/schemas";
import {Model} from "mongoose";
import Fuse, {FuseResult} from "fuse.js";
import slugify from "slugify";
import {PrivateBrands, UnitedCategories, UnitedProducts} from "../schemas";
import type{PrivateBrandsRequest} from "../dto";


@Injectable()
export class ProductsService {

    constructor(
        @InjectModel(ScrapedCategory.name) private category: Model<ScrapedCategory>,
        @InjectModel(ScrapedProduct.name) private product: Model<ScrapedProduct>,
        @InjectModel(PrivateBrands.name) private privateBrands:Model<PrivateBrands>,
        @InjectModel(UnitedCategories.name) private unitedCategories:Model<UnitedCategories>,
        @InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>,
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

    private synonyms: Record<string, string[]> = {
        "Хліб та випічка": ["Хлібобулочні вироби"],
        "Фрукти, овочі та соління": ["Овочі та фрукти"],
        "Ковбаси та сири": ["Сири", "Ковбаса і м'ясні делікатеси"],
        "Дитячі товари": ["Товари для дітей", "Дитяче харчування"],
        "Солодощі": ["Кондитерські вироби"],
        "Бакалія, консерви та соуси": ["Бакалія"],
        "Заморожена продукція": ["Заморожені продукти"],
        "Піца та кулінарія": ["Кулінарія", "Готові страви"],
        "М'ясо та риба":["Риба і морепродукти", "М'ясо"]
    };

    async normalizeCategories() {
        const foraCategories = await this.category.find({ store: "Fora" });
        const atbCategoriesRaw = await this.category.find({ store: "ATB" });

        const atbCategories = atbCategoriesRaw.map(cat => ({
            ...cat.toObject(),
            normalizedName: this.normalizeName(cat.name)
        }));

        const fuse = new Fuse(atbCategories, {
            keys: ["name", "normalizedName"],
            threshold: 0.3,
            includeScore: true
        });

        for (const foraCat of foraCategories) {
            const originalName = foraCat.name;
            const normalizedFora = this.normalizeName(originalName);

            if (this.synonyms[originalName]) {
                for (const synonym of this.synonyms[originalName]) {
                    const atbCat = await this.category.findOne({ name: synonym });
                    if (!atbCat) continue;

                    const exists = await this.unitedCategories.findOne({
                        sources: { $all: [foraCat.id, atbCat.id] }
                    });
                    if (exists) continue;

                    await this.unitedCategories.updateOne(
                        { name: originalName },
                        {
                            $setOnInsert: { name: originalName },
                            $addToSet: { sources: [foraCat._id, atbCat._id] }
                        },
                        { upsert: true }
                    );

                }
            }

            else {
                const matches = fuse.search(normalizedFora, { limit: 3 })
                    .filter(r => r.score && r.score < 0.35);

                for (const match of matches) {
                    const atbCat:any = match.item;
                    const exists = await this.unitedCategories.findOne({
                        sources: { $all: [foraCat.id, atbCat.id] }
                    });
                    if (exists) continue;

                    await this.unitedCategories.updateOne(
                        { name: originalName },
                        {
                            $setOnInsert: { name: originalName },
                            $addToSet: { sources: [foraCat._id, atbCat._id] }
                        },
                        { upsert: true }
                    );
                }
            }
        }
        return {
            status: true,
            message: "United categories successfully matched",
        };
    }


    async DeletePrivateBrands() {
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

        const products = await this.DeletePrivateBrands()

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
            ignoreFieldNorm:true,
            useExtendedSearch: true,
            ignoreLocation: true,
            threshold: 0.5,
            distance: 200,
        });


        let numRes :number=0;

        for (const foraProd of foraProds) {
            const originalName = foraProd.name;

            const brand = (foraProd.productInfo as unknown as Map<string, string>).get("Торгова марка");
            const normalizedFora = this.normalizeNameProds(originalName as string,brand as string);

            const dynamicThreshold = originalName.length > 30 ? 0.2 : 0.35;

            const results = fuse.search(normalizedFora as string);
            const match = results.find(r => r.score !== undefined && r.score < dynamicThreshold);


            if (match) {
                console.log(`✅ ${originalName} ↔ ${match.item.name} (через Fuse.js)`);
                numRes+=1;

                const unitedCategory = await this.unitedCategories.findOne(
                    {sources:{ $in: [foraProd.category] },
                    },
                    { _id: 1 }
                )

                if(!unitedCategory){
                    throw new NotFoundException("Category has not been found")
                }

                const exists = await this.unitedProducts.findOne({
                    sources: { $all: [foraProd._id, match.item._id] }
                });
                if (exists) continue;

                await this.unitedProducts.create({
                    name:originalName,
                    brand: brand || (match.item.productInfo as unknown as Map<string, string>).get("Торгова марка") || "Не знайдено",
                    normalizedName:normalizedFora,
                    slug:slugify(originalName as string,{locale:'ua', lower:true}),
                    unitedCategory:unitedCategory._id,
                    sources:[foraProd._id,match.item._id]
                })

            } else {
                console.log(`➕ ${originalName} (нет совпадений)`);
            }

        }
        console.log(`Result quantity ${numRes}`);

    }

    // private getBrand(product:ScrapedProduct){
    //     if(!product?.productInfo){
    //         return ""
    //     }
    //     const keys = Object.keys(product.productInfo);
    //
    //     const brandKey = keys.find(k=>k.toLowerCase().includes("торгова марка"));
    //
    //     return brandKey ? product.productInfo[brandKey] : "";
    // }

    async writePrivateBrands(dto:PrivateBrandsRequest){
        const {name,store,reason} = dto;

         await this.privateBrands.create({
             name:name,
             store:store,
             reason:reason
         })
         return true;
    }

    async testBrand(){
        const testFora = await this.product.find({store:"ATB"});

        for(const test of testFora ){
            const brand = (test.productInfo as unknown as Map<string, string>).get("Торгова марка");
            console.log(brand, test.store);
        }
    }
}
