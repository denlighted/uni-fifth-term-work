import {BadRequestException, Injectable, NotFoundException, Param} from '@nestjs/common';

import {ConfigService} from "@nestjs/config";

import {InjectModel} from "@nestjs/mongoose";
import {ScrapedCategory, ScrapedProduct} from "./schemas";
import {Model} from "mongoose";
import pLimit from "p-limit";
import {AtbScraper, ForaScraper} from "./scrapers";

@Injectable()
export class ScraperService {
    constructor(
        private readonly atbScraper: AtbScraper,
        private readonly foraScraper:ForaScraper,
        @InjectModel(ScrapedCategory.name) private category: Model<ScrapedCategory>,
        @InjectModel(ScrapedProduct.name) private product:Model<ScrapedProduct>
    ) {}


    async cleanCategCollection(){
        await this.category.deleteMany({});
        return true
    }

    async cleanProdCollection(){
        await this.product.deleteMany({});
        return true
    }


    async deleteForaProd(){
        await this.product.deleteMany({store:"ATB"});
        return true;
    }


    async writeAllAtbProducts() {
        const { data } = await this.getAllAtbCategories();
        const limit = pLimit(5);

        if (!data || data.length === 0) {
            throw new NotFoundException("No ATB categories found");
        }

        const tasks = data.map(category =>
            limit(async () => {
                try {
                    await this.writeAtbProductsByCategory(category.id.toString());

                }
                catch (err)
                {
                    console.error(`Failed for ${category.name}: ${err.message}`);
                }
            })
        );

        await Promise.all(tasks);
        console.log("All categories have been recorded");
    }

    async writeAllForaProducts() {
        const { data } = await this.getAllForaCategories();
        const limit = pLimit(3);

        if (!data || data.length === 0) {
            throw new NotFoundException("No Fora categories found");
        }

        const tasks = data.map(category =>
            limit(async () => {
                try {
                    await this.writeForaProductsByCategory(category.id.toString());

                }
                catch (err)
                {
                    console.error(`Failed for ${category.name}: ${err.message}`);
                }
            })
        );

        await Promise.all(tasks);
        console.log("All categories have been recorded");
    }



    async getAllAtbProducts(){
        const products =  await this.product.find({store:"ATB"},{__v:0});
        return products;
    }

    async getAtbProductById(id:String){
        const product = await this.product.findById(id, {__v:0});

        if(product && product.store ==="Fora"){
            throw new BadRequestException("This product is not allowed for this store");
        }
        return product;
    }

    async getAllForaProducts(){
        const products = await this.product.find({store:"Fora"},{__v:0})
        return products;
    }

    async getForaProductById(id:String){
        const product = await this.product.findById(id, {__v:0});

        if(product && product.store ==="ATB"){
            throw new BadRequestException("This product is not allowed for this store");
        }
        return product;
    }


    async getAllAtbCategories(){
        const data = await this.category.find({store:"ATB"},{__v:0});
        return {
            data:data,
            count:data.length
        }
    }

    async getAllForaCategories() {
        const data = await this.category.find({store:"Fora"},{__v:0});
        return {
            data:data,
            count:data.length
        }
    }

    async getAtbCategoryById(id:string){
        const data = await this.category.findById(id,{__v:0});

        if (!data) {
            throw new NotFoundException("Category not found");
        }

        if(data && data.store ==="Fora"){
            throw new BadRequestException("This category does not belong to chosen store");
        }
        return data;
    }

    async getForaCategoryById(id:string){
        const data= await this.category.findById(id,{__v:0});
        if (!data) {
            throw new NotFoundException("Category not found");
        }

        if(data && data.store ==="ATB"){
            throw new BadRequestException("This category does not belong to chosen store");
        }
        return data;
    }

    async writeForaProductsByCategory(categoryId:string):Promise<Boolean>{
        const {url} = await this.getForaCategoryById(categoryId)
        const products = await this.foraScraper.parseForaProductsByCategory(url)
        if(!Array.isArray(products) || products.length===0){
            throw new NotFoundException("There are no products for record")
        }
        const productsWithCategory = products.map((p) => ({
            ...p,
            category: categoryId, // <-- One-to-many связь
        }));

        await this.product.insertMany(productsWithCategory);
        return true;
    }

    async writeAtbProductsByCategory(categoryId:string):Promise<Boolean>{
        const {url} = await this.getAtbCategoryById(categoryId)
        const products = await this.atbScraper.parseAtbShop(url)

        if(!Array.isArray(products) || products.length===0){
            throw new NotFoundException("There are no products for record")
        }

        const productsWithCategory = products.map((p) => ({
            ...p,
            category: categoryId, // <-- One-to-many связь
        }));

        await this.product.insertMany(productsWithCategory);
        return true
    }

    async writeAtbCategories():Promise<boolean>{
        const data = await this.atbScraper.parseAtbCategories();
        if (!Array.isArray(data) || data.length === 0) {
            throw new NotFoundException("There are no categories for record")
        }
        await this.category.insertMany(data);
        return true
    }

    async writeForaCategories():Promise<boolean>{
        const data = await this.foraScraper.parseForaCategories();
        if (!Array.isArray(data) || data.length === 0) {
            throw new NotFoundException("There are no categories for record")
        }
        await this.category.insertMany(data);
        return true
    }
}
