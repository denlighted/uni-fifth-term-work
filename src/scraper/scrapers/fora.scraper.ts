import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ProductUrlInterface, ScraperInterface} from "../interfaces";
import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import pLimit from "p-limit";
import {elementAt} from "rxjs";


@Injectable()
export class ForaScraper{

    public readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = configService.getOrThrow<string>('FORA_BASE_URL')
    }

    async getForaProductCardLink(categoryUrl:string): Promise<ProductUrlInterface[]> {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });
        const page = await browser.newPage();
        await page.goto(categoryUrl, {
            waitUntil: "networkidle2",
        });

        const urls: ProductUrlInterface[] = [];

        let lastCount = 0;

        while (true) {
            const html = await page.content();
            const $ = cheerio.load(html);

            const cards = $(".product-list-item-wrapper");
            for (let i = lastCount; i < cards.length; i++) {
                const href = $(cards[i]).find("a.image-content-wrapper").attr("href");
                if (href) {
                    const fullUrl = this.baseUrl + href;
                    urls.push({ url: fullUrl });
                }
            }

            lastCount = cards.length;

            const nextButton = await page.$(".load-more-items__btn");
            if (!nextButton) break;

            await nextButton.click();
            await page.waitForFunction(
                (prevCount) => document.querySelectorAll(".product-list-item-wrapper").length > prevCount,
                {},
                lastCount
            );
        }
        await browser.close();
        const test = [...new Set(urls)];
        console.log(test.length );
        return urls;
    }


    async parseForaProductsByCategory(categoryUrl:string): Promise<ScraperInterface[]> {
        const urls = (await this.getForaProductCardLink(categoryUrl));

        const limit = pLimit(3);
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });
        const products: ScraperInterface[] = [];

        try {
            const results = await Promise.all(
                urls.map((url) =>
                    limit(async () => {
                        const page = await browser.newPage();
                        await page.goto(url.url, {waitUntil: 'domcontentloaded'});


                        await page.waitForSelector('.product-preview_info h1', {timeout: 10000});
                        await page.waitForSelector('.product-details-info', {timeout: 5000}).catch(() => null);

                        const html = await page.content();

                        const $ = cheerio.load(html);

                        const name = await page.$eval(".product-preview_info h1", el => el.textContent.trim()).catch(() => "");
                        const imageLink = await page.$eval(
                            ".product-preview_carousel img",
                            el => el.getAttribute("src") || ""
                        ).catch(() => "");
                        const currentInteger = await page.$eval(".current-price .current-integer", el => el.textContent.trim()).catch(() => "");
                        const currentFraction = await page.$eval(".current-price .current-fraction", el => el.textContent.trim()).catch(() => "");
                        let price = "";

                        if (currentInteger) {
                            price = `${currentInteger}.${currentFraction.replace(/\D/g, "")}`;
                        }
                        const description = await page.$eval('.product-characteristics__desc', el => (el as HTMLElement).innerText.trim()).catch(() => "");
                        const productInfo = await page.$$eval('.product-details-column', (columns) => {
                            const info: Record<string, string> = {};
                            for (const col of columns) {
                                const key = col.querySelector('.product-details-label')?.textContent?.trim();
                                const value = col.querySelector('.product-details-value')?.textContent?.trim();
                                if (key && value) {
                                    info[key] = value;
                                }
                            }
                            return info;
                        });

                        await page.close();

                        return {
                            name,
                            price: price,
                            store: "Fora",
                            description: description.replace('Склад\n', '') || "",
                            productInfo: productInfo,
                            imageLink

                        };
                    })
                )
            );

            products.push(...results);
        }
        finally {
            await browser.close();
        }

        console.log(products.length)
        return products;

    }

    async parseForaCategories():Promise<ProductUrlInterface[]> {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });

        const page = await browser.newPage();
        const url = this.configService.getOrThrow<string>('FORA_BASE_URL');

        await page.goto(url, { waitUntil: "networkidle2" });

        await page.waitForSelector(".all-product_btn", { visible: true });
        await page.click(".all-product_btn");
        await page.waitForSelector(".category-list-item-wrapper", { visible: true });

        const categories = await page.$$eval(".category-list-item-wrapper", els =>
            els.map(el => ({
                title: el.querySelector(".category-list-item-title")?.textContent?.trim() || "",
            }))
        );

        const result:ProductUrlInterface[] = [];

        for (let i = 0; i < categories.length; i++) {
            const title = categories[i].title;

            const items = await page.$$(".category-list-item-wrapper");

            const currentUrl = page.url();

            await Promise.all([
                items[i].click(),
                page.waitForFunction(
                    (prevUrl) => window.location.href !== prevUrl,
                    {},
                    currentUrl
                ).catch(() => null),
            ]);

            // Ждем, пока URL станет не /catalog
            await page.waitForFunction(
                () => !window.location.href.endsWith("/catalog"),
                { timeout: 5000 }
            ).catch(() => null);

            const categoryUrl = page.url();

            result.push({
                url: categoryUrl,
                name:title,
                store:"Fora"

            });

            await page.goto(url, { waitUntil: "networkidle2" });
            await page.waitForSelector(".all-product_btn", { visible: true });
            await page.click(".all-product_btn");
            await page.waitForSelector(".category-list-item-wrapper", { visible: true });
        }

        await browser.close();
        return result;
    }
}