import { Category } from "./category";

export class Product {
    slug: string;
    name: string;
    description: string;
    status: string;
    photo: string;
    category: string;
    categoryname: Category;
    price: number;

    constructor( slug: string, name: string, price: number, description: string, status: string, photo: string, category: string, categoryname: Category ) {
        this.slug = slug;
        this.name = name;
        this.price = price;
        this.description = description;
        this.status = status;
        this.photo = photo;
        this.category = category;
        this.categoryname = categoryname;
    }
}