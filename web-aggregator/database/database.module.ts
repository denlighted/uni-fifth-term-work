import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import * as process from "node:process";


@Module({
    imports: [MongooseModule.forRoot(`mongodb+srv://morrantt:${process.env.DATABASE_PASSWORD}@web-service-price-aggre.5njd5nt.mongodb.net/`, {
        dbName: 'product_scraper'
    })],
    exports:[MongooseModule]
})

export class DatabaseModule {
}