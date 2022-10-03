export class Product {
    slug: string;
    name: string;
    price: number;

    constructor( slug: string, name: string, price: number ) {
        this.slug = slug;
        this.name = name;
        this.price = price;
    }
}