export interface ScraperInterface {
    name:string,
    price:string,
    store:string,
    categoryUrl?:string|null,
    description:string
    productInfo:{};
    imageLink:string
}