import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from "cookie-parser";
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import path from "node:path";
import type{NextFunction,Request,Response} from "express";
import express from "express";
import { dirname,join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import {fileURLToPath} from "node:url";




async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);

    const PROJECT_ROOT = process.cwd();

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
        exposedHeaders: ['Set-Cookie', 'Content-Disposition'],
        allowedHeaders: ['Authorization', 'X-Api-Key','Content-type'],

    })

    app.use('/avatars', express.static(join(PROJECT_ROOT, 'uploads/avatars'),{
        setHeaders: (res, path, stat) => {
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        }
    }));

    app.use(express.static(join(PROJECT_ROOT, 'public')));

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.originalUrl.startsWith('/api')|| req.originalUrl.startsWith('/avatars')) {
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
