import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';

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
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };
  @Output() filtersList = new EventEmitter<Filters>();

  constructor(
  ) { }

  setNumPages(count: number): void {
    console.log(count);

    this.numpages = Math.ceil(count / 6);
    for (let i = 0; i < this.numpages; i++) {
      this.pages[i] = i + 1;
    }
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
