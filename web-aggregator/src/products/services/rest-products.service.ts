import {BadRequestException, Injectable, NotFoundException, Query} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {UnitedCategories, UnitedProducts} from "../schemas";
import {Model} from "mongoose";
import {QueryBuilder} from "../../utils/query-builder";
import {ProductFilterDto} from "../../common/dto/product-filter.dto";
import {BaseQueryDto} from "../../common/dto/query.dto";
import {RoleEnum} from "@prisma/client";

@Injectable()

export class RestProductService {
    constructor( @InjectModel(UnitedCategories.name) private unitedCategories:Model<UnitedCategories>,
                 @InjectModel(UnitedProducts.name) private unitedProducts:Model<UnitedProducts>) {
    }

    async getAllUnitedCategories(){
        return await this.unitedCategories.find().populate('sources');
    }

    async getAllUnitedProducts(queryDto: any) {
        const { search, category, country } = queryDto;

        let searchProductIds: any[] | null = null;
        let foundCategoryIds: any[] | null = null;

        // Atlas search by prods
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

        // search with atlas search by prods
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

        // Фильтр по стране
        if (country) {
            baseFilter["sources.productInfo.Країна"] = country;
        }

        // --- 4. Запрос и Пагинация
        const totalItems = await this.unitedProducts.countDocuments(baseFilter);

        const query = this.unitedProducts
            .find(baseFilter)
            .populate("unitedCategory sources");

        const builderDto = { ...queryDto };
        delete builderDto.search;
        delete builderDto.category;

        const products = await new QueryBuilder(builderDto, query)
            .filter()
            .sorting()
            .pagination()
            .build();

        const limit = queryDto.limit || 50;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: products,
            totalItems,
            totalPages,
            page: queryDto.page || 1
        };
    }

    async getSearchedProducts(queryDto: any) {
        const { search = '', limit = 50, page = 1 } = queryDto;
        const skip = (page - 1) * limit;

        const pipeline: any[] = [];
        if (search) {
            pipeline.push({
                $search: {
                    index: 'productsIndex',
                    text: {
                        query: search,
                        path: ['name', 'brand', 'normalizedName', 'slug'],
                        fuzzy: {
                            maxEdits: 1
                        }
                    },
                },
            });
        } else {
            pipeline.push({ $sort: { createdAt: -1 } });
        }


        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [{ $skip: skip }, { $limit: limit }],
            },
        });

        const result = await this.unitedProducts.aggregate(pipeline);

        const data = result[0].data;
        const total = result[0].metadata.length > 0 ? result[0].metadata[0].total : 0;
        const totalPages = Math.ceil(total / limit);

        return {
            data,
            totalItems: total,
            totalPages,
            page,
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

    async deleteProductById(id:string){
        return this.unitedProducts.deleteOne({_id: id});
    }

    async deleteAllMatchedProds(){
        return this.unitedProducts.deleteMany({});
    }
}