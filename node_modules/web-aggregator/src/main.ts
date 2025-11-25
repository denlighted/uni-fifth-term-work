import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from "cookie-parser";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import path from "node:path";
import type{NextFunction,Request,Response} from "express";
import express from "express";

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
        origin: "http://localhost:5173",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        exposeHeaders: ['Set-Cookie', 'Content-Disposition'],
        allowedHeaders: ['Authorization', 'X-Api-Key','Content-type'],

    })

    app.use(express.static(path.join(__dirname, '..', 'public')));

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.originalUrl.startsWith('/api')) {
            return next(); //
        }
        return res.sendFile(
            path.join(__dirname, '..', 'public', 'index.html'),
        );
    });

    await app.listen(process.env.PORT ?? 3000);
    console.log(`Server is running on: ${await app.getUrl()}`);
}

bootstrap();
