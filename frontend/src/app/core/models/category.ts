export class Category {
    slug: string;
    name: string;
    photo: string;

    constructor( slug: string, name: string, photo: string ) {
        this.slug = slug;
        this.name = name;
        this.photo = photo;
    }
}