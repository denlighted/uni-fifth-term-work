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
        const { search, category, country, brand } = queryDto;

        let searchProductIds: any[] | null = null;
        let foundCategoryIds: any[] | null = null;

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

        const baseFilter: any = {};

        if (searchProductIds) {
            baseFilter._id = { $in: searchProductIds };
        }

        if (foundCategoryIds) {
            baseFilter.unitedCategory = { $in: foundCategoryIds };
        }

        if (brand) {
            baseFilter.brand = brand;
        }

        if (country) {
            const sourcesInCountry = await this.scrapedProduct
                .find({ "productInfo.Країна": country })
                .select('_id');

            const sourceIds = sourcesInCountry.map(s => s._id);

            if (sourceIds.length === 0) {
                return { data: [], totalItems: 0, totalPages: 0, page: 1 };
            }

            baseFilter.sources = { $in: sourceIds };
        }

        const totalItems = await this.unitedProducts.countDocuments(baseFilter);

        const query = this.unitedProducts
            .find(baseFilter)
            .populate("unitedCategory sources");

        const builderDto = { ...queryDto };
        delete builderDto.search;
        delete builderDto.category;
        delete builderDto.brand;
        delete builderDto.country;

        if (queryDto.sort === 'cheap') {
            // Сначала по цене (возрастание), если цена равна — по ID
            builderDto.sort = 'minPrice _id';
        } else if (queryDto.sort === 'expensive') {
            // Сначала по цене (убывание), если цена равна — по ID
            builderDto.sort = '-minPrice _id';
        } else {
            // Сначала новые, если время совпадает — по ID
            builderDto.sort = '-createdAt _id';
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