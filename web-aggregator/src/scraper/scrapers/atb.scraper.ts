import * as cheerio from 'cheerio'
import * as puppeteer from "puppeteer";
import {ProductUrlInterface, ScraperInterface} from "../interfaces";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";
import pLimit from "p-limit";


@Injectable()
export class AtbScraper {

    public readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.baseUrl = configService.getOrThrow<string>('ATB_BASE_URL')
    }

    async getProductCardUrlAtb(category:string): Promise<ProductUrlInterface[]> {
        const browser = await puppeteer.launch({
            headless: false, // оставляем false для обхода Turnstile
            defaultViewport: null,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-blink-features=AutomationControlled",
            ],
        });

        const page = await browser.newPage();
        await page.goto(category, {
            waitUntil: "networkidle2",
        });

        const urls: ProductUrlInterface[] = [];
        const seen = new Set<string>();
        let lastCount = 0;

        while (true) {

            const html = await page.content();
            const $ = cheerio.load(html);

            const cards = $("article.catalog-item");

            for (let i = lastCount; i < cards.length; i++) {
                const href = $(cards[i]).find(".catalog-item__title a").attr("href");
                if (href) {
                    const fullUrl = this.baseUrl + href;
                    if (!seen.has(fullUrl)) {
                        seen.add(fullUrl);
                        urls.push({url: fullUrl});
                    }
                }
            }

            lastCount = cards.length;

            const nextButton = await page.$(".product-pagination__more");
            if (!nextButton) break;

            await Promise.all([
                nextButton.click(),
                page.waitForFunction(
                    (prevCount) => document.querySelectorAll("article.catalog-item").length > prevCount,
                    {},
                    lastCount
                ),
            ]);
        }

        await browser.close();
        console.log(`${urls.length}`);
        return urls;
    }

    async parseAtbCategories(): Promise<ProductUrlInterface[]> {
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
        await page.goto(this.configService.getOrThrow<string>('ATB_BASE_URL'), {
            waitUntil: "networkidle2",
        });

        const html = await page.content();
        const $ = cheerio.load(html);

        const categoriesLinks: ProductUrlInterface[] = []

        $('li.category-menu__item').each((_, el) => {
            const a = $(el).find('a.category-menu__link-wrap');
            const href = a.attr('href');
            const name = $(el).find("span.category-menu__link").text().trim();
            if (href) {
                categoriesLinks.push({
                    url: `https://www.atbmarket.com${href}`,
                    name:name,
                    store:"ATB"
                });
            }
        });
        await browser.close();
        return categoriesLinks.slice(3);

    }

    async parseAtbShop(category:string): Promise<ScraperInterface[]> {
        const urls = (await this.getProductCardUrlAtb(category))
        const limit = pLimit(5);
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

        const results = await Promise.all(
            urls.map((url) =>
                limit(async () => {
                    const page = await browser.newPage();
                    await page.goto(url.url, {waitUntil: 'domcontentloaded'});


                    const html = await page.content();

                    const data = {};

                    const $ = cheerio.load(html);

                    const categoryUrl = await page.$eval(
                        '.breadcrumbs__item a[href*="/catalog/"]',
                        el => el.href
                    ).catch(() => null);
                    const name = $(".product-page__title").contents().first().text().trim();
                    const price = $(".product-price__top > span:not(.product-price__coin)").first().text().replace(/[^\d]/g, "");
                    const imageLink = $('.cardproduct-tabs__item.current picture img').attr('src')!;
                    const description = await page.$eval('.product-characteristics__desc', el => (el as HTMLElement).innerText.trim()).catch(() => "");
                    $(".product-characteristics__item").each((_, el) => {
                        const value = $(el).find(".product-characteristics__value").text().trim();
                        const name = $(el).find(".product-characteristics__name").text().trim();
                        if (name && value) {
                            data[name] = value;
                        }
                    });

                    await page.close();

                    return {
                        name,
                        price: price.slice(0, price.length - 2) + '.' + price.slice(-2),
                        store: "ATB",
                        categoryUrl,
                        description: description.replace('Склад\n', '') || "",
                        productInfo: data,
                        imageLink


                    };
                })
            )
        );

        products.push(...results);
        await browser.close();
        console.log(products.length)
        return products;
    }
}
