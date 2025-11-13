import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from "cookie-parser";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);


    app.use(cookieParser())
    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    app.enableCors({
        origin: config.get<string>('ALLOWED_ORIGINS')?.split(',') ?? [],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        exposeHeaders: ['Set-Cookie', 'Content-Disposition'],
        allowedHeaders: ['Authorization', 'X-Api-Key'],

    })

    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is running on: ${await app.getUrl()}`);
}

bootstrap();
