import {BadRequestException, Injectable, NotFoundException, Query} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {UnitedCategories, UnitedProducts} from "../schemas";
import {Model} from "mongoose";
import {QueryBuilder} from "../../utils/query-builder";
import {ProductFilterDto} from "../../common/dto/product-filter.dto";
import {BaseQueryDto} from "../../common/dto/query.dto";
import {RoleEnum} from "@prisma/client";
import {ScrapedProduct} from "../../scraper/schemas";

@Injectable()

export class RestProductService {
    constructor( @InjectModel(UnitedCategories.name) private unitedCategories:Model<UnitedCategories>,
                 @InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>,
                 @InjectModel(ScrapedProduct.name) private scrapedProduct: Model<ScrapedProduct>)
{
    }

    async getAllUnitedCategories(){
        return await this.unitedCategories.find().populate('sources');
    }

    async getAllUnitedProducts(queryDto: any) {
        // 1. Добавляем brand в деструктуризацию
        const { search, category, country, brand } = queryDto;

        let searchProductIds: any[] | null = null;
        let foundCategoryIds: any[] | null = null;

        // --- Atlas Search: Поиск товаров по тексту ---
        if (search) {
            const searchResults = await this.unitedProducts.aggregate([
                {
                    $search: {
                        index: "productsIndex",
                        text: {
                            query: search,
                            path: ["name", "brand", "normalizedName", "slug"],
                            fuzzy: { maxEdits: 1 }
                        },
                    },
                },
                { $project: { _id: 1 } }
            ]);
            searchProductIds = searchResults.map(r => r._id);

            if (searchProductIds.length === 0) {
                return { data: [], totalItems: 0, totalPages: 0, page: 1 };
            }
        }

        // --- Atlas Search: Поиск категорий ---
        if (category) {
            const categoryResults = await this.unitedCategories.aggregate([
                {
                    $search: {
                        index: "categoryIndex",
                        text: {
                            query: category,
                            path: "name",
                            fuzzy: { maxEdits: 1 }
                        },
                    },
                },
                { $project: { _id: 1 } }
            ]);

            foundCategoryIds = categoryResults.map(c => c._id);

            if (foundCategoryIds.length === 0) {
                return { data: [], totalItems: 0, totalPages: 0, page: 1 };
            }
        }

        // --- Сборка основного фильтра ---
        const baseFilter: any = {};

        if (searchProductIds) {
            baseFilter._id = { $in: searchProductIds };
        }

        if (foundCategoryIds) {
            baseFilter.unitedCategory = { $in: foundCategoryIds };
        }

        // --- 2. ЛОГИКА БРЕНДА (Новое) ---
        if (brand) {
            baseFilter.brand = brand;
        }

        // --- 3. ЛОГИКА СТРАНЫ (Исправлено) ---
        if (country) {
            // Мы не можем фильтровать "sources.productInfo" напрямую в UnitedProducts,
            // так как sources - это массив ID (ссылок).
            // Сначала ищем ID источников, которые относятся к этой стране:
            const sourcesInCountry = await this.scrapedProduct
                .find({ "productInfo.Країна": country })
                .select('_id');

            const sourceIds = sourcesInCountry.map(s => s._id);

            if (sourceIds.length === 0) {
                // Если в этой стране нет источников -> возвращаем пустоту
                return { data: [], totalItems: 0, totalPages: 0, page: 1 };
            }

            // Ищем товары, у которых есть хотя бы один источник из списка sourceIds
            baseFilter.sources = { $in: sourceIds };
        }

        // --- 4. Запрос и Пагинация ---
        const totalItems = await this.unitedProducts.countDocuments(baseFilter);

        const query = this.unitedProducts
            .find(baseFilter)
            .populate("unitedCategory sources");

        // Очистка DTO для QueryBuilder
        const builderDto = { ...queryDto };
        delete builderDto.search;
        delete builderDto.category;
        delete builderDto.brand;
        delete builderDto.country;

        if (queryDto.sort === 'cheap') {
            builderDto.sort = 'minPrice';
        } else if (queryDto.sort === 'expensive') {
            builderDto.sort = '-minPrice';
        } else {
            builderDto.sort = '-createdAt';
        }

        if (builderDto.page) builderDto.page = Number(builderDto.page);
        if (builderDto.limit) builderDto.limit = Number(builderDto.limit);

        const products = await new QueryBuilder(builderDto, query)
            .filter()
            .sorting()
            .pagination()
            .build();

        const limit = Number(queryDto.limit || 50);
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: products,
            totalItems,
            totalPages,
            page: Number(queryDto.page || 1)
        };
    }

    async getUnitedProductBySlug(slug:string){
        console.log(slug);
        const unitedProd = await this.unitedProducts.findOne({slug:slug}).populate('sources unitedCategory',{__v:0}).select({__v:0, id:0});

        if(!unitedProd){
            throw new NotFoundException("United pages not found by slug");
        }
        return unitedProd;
    }


    async getUnitedProductById(id: string) {
        console.log('Searching for id:', id);

        const unitedProd = await this.unitedProducts.findById(id).populate('reviews');

        if (!unitedProd) {
            throw new NotFoundException('United product not found by id');
        }

        return unitedProd;
    }

    async getUniqueBrands(){
        const brand = this.unitedProducts.distinct("brand");
        return brand.sort();
    }

    async getUniqueCountries() {

        const countries = await this.scrapedProduct.distinct("productInfo.Країна");

        return countries
            .filter(country => country && country.trim() !== '')
            .sort();
    }

    async deleteProductById(id:string){
        return this.unitedProducts.deleteOne({_id: id});
    }

    async deleteAllMatchedProds(){
        return this.unitedProducts.deleteMany({});
    }
}