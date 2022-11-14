export class PaginationConfig {
    limit: number;
    offset: number;
    numItems: number;

    constructor(
        limit: number,
        offset: number,
        numItems:number
    ) {
        this.limit = limit;
        this.offset = offset;
        this.numItems = numItems;
    }
}