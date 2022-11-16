export class PaginationConfig {
    numItems: number;
    limit: number;
    page: string;

    constructor(
        numItems:number,
        limit:number,
        page:string,
    ) {
        this.numItems = numItems;
        this.limit = limit;
        this.page = page;
    }
}