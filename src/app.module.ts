import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScraperModule } from './scraper/scraper.module';
import {ConfigModule} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { ProductComparisonModule } from './product-comparison/product-comparison.module';


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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
