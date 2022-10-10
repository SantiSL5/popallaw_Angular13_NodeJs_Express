export class Filters {
    limit?: number;
    offset?: number;
    name?: string;
    priceMin?: number;
    priceMax?: number;
    category?: number;

    constructor(
        limit?: number,
        offset?: number,
        name?: string,
        priceMin?: number,
        priceMax?: number,
        category?: number
    ) {
        this.limit = limit || 3;
        this.offset = offset || 0;
        this.name = name;
        this.priceMin = priceMin;
        this.priceMax = priceMax;
        this.category = category;
    }

}