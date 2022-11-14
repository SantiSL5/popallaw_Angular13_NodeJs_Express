import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';
import { PaginationConfig } from 'src/app/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent {

  numpages: number = 0;
  pages: number[] = [];
  actualpage: number = 1;
  uphide: Boolean = false;
  downhide: Boolean = false;
  hide: Boolean = true;
  filters = new Filters();
  onMostLeft: Boolean = true;
  onMostRight: Boolean = false;

  @Output() pageChange = new EventEmitter<void>();
  @Input()
  set config(config: PaginationConfig) {
    if (config) {
      this.setNumPages(config.numItems);
    }
  }
  constructor(
    private _productService: ProductService,
  ) { }

  setNumPages(count: number): void {
    this.numpages = Math.ceil(count / 6);
    this.pages=[];
    for (let i = 0; i < this.numpages; i++) {
      this.pages[i] = i + 1;
    }
    this.checkMove();
  }

  async setPageTo(pageNumber: number) {

    this._productService.setFilters(this.filters,"pagination");

    this.actualpage = pageNumber;
    this.filters.limit = 6;
    this.filters.offset = this.filters.limit * (this.actualpage - 1);
    this._productService.setFilters(this.filters);

    this.checkMove();

    await setTimeout(()=>{
      this.actualpage = pageNumber;
      this.pageChange.emit();
    }, 30) ;
    

    // this.location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));
    // this.getListFiltered(this.filters);
  }

  checkMove() {
    this.onMostLeft = false;
    this.onMostRight = false;

    if (this.actualpage == 1) {
      this.onMostLeft = true;
    }

    if (this.actualpage == this.pages.length) {
      this.onMostRight = true;
    }
  }

}
