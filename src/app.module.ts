import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { ProductComparisonModule } from './product-comparison/product-comparison.module';
import { ReviewsModule } from './reviews/reviews.module';
import {MorganMiddleware} from "@nest-middlewares/morgan";
import { GeoStoresModule } from './geo-stores/geo-stores.module';
import { FavoritesModule } from './favorites/favorites.module';
import { BestCartModule } from './best-cart/best-cart.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScraperModule,
    AuthModule,
    PrismaModule,
    MailModule,
    ProductsModule,
    ProductComparisonModule,
    ReviewsModule,
    GeoStoresModule,
    FavoritesModule,
    BestCartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    MorganMiddleware.configure('dev')
    consumer.apply(MorganMiddleware).forRoutes('*path');
  }
}
