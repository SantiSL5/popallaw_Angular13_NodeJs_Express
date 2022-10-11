import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit {

  // totalProducts: number = 0;
  numpages: number = 0;
  pages: number[] = [];
  actualpage: number = 1;
  uphide: Boolean = false;
  downhide: Boolean = false;
  hide: Boolean = true;
  filters = new Filters();
  onMostLeft: Boolean = true;
  onMostRight: Boolean = false;
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };
  @Output() filtersList = new EventEmitter<Filters>();

  constructor(
    private _productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.getProductsCount();
  }

  getProductsCount(): void {
    this._productService.query(this.defaultFilters).subscribe(data => {
      this.numpages = Math.ceil(data.numproducts / 6);
      for (let i = 0; i < this.numpages; i++) {
        this.pages[i] = i + 1;
      }
    });
  }

  setPageTo(pageNumber: number) {
    this.actualpage = pageNumber;

    this.filters.limit = 6;
    this.filters.offset = this.filters.limit * (this.actualpage - 1);

    this.onMostLeft = false;
    this.onMostRight = false;

    if (this.actualpage == 1) {
      this.onMostLeft = true;
    }

    if (this.actualpage == this.pages.length) {
      this.onMostRight = true;
    }

    this.filtersList.emit(this.filters);

    // this.location.replaceState('/shop/' + btoa(JSON.stringify(this.filters)));
    // this.getListFiltered(this.filters);
  }

}
