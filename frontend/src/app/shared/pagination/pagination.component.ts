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

export class PaginationComponent implements OnInit {
  limit!: number;
  page!: string;
  numpages: number = 0;
  pages: number[] = [];
  actualpage: number = 1;
  uphide: Boolean = false;
  downhide: Boolean = false;
  hide: Boolean = true;
  filters = new Filters();
  onMostLeft: Boolean = true;
  onMostRight: Boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Input()
  set config(config: PaginationConfig) {
    if (config) {
      this.limit=config.limit;
      this.page=config.page;
      this.setNumPages(config.numItems);
    }
  }
  constructor(
    private _productService: ProductService,
  ) { }
  ngOnInit(): void {
    if (this.page=="shop") {
      this.filters=this._productService.getFilters();
      if (this.filters.offset==0) {
        this.setPageTo(1)
      }
    }
  }

  setNumPages(count: number): void {
    this.actualpage=1;
    this.numpages = Math.ceil(count / this.limit);
    this.pages=[];
    for (let i = 0; i < this.numpages; i++) {
      this.pages[i] = i + 1;
    }
    this.checkMove();
  }

  async setPageTo(pageNumber: number) {
    if (this.page=="shop") {
      if (pageNumber != this.actualpage) {
        this.filters=this._productService.getFilters();
  
        this.actualpage = pageNumber;
        this.filters.limit = this.limit;
        this.filters.offset = this.filters.limit * (this.actualpage - 1);
        this._productService.setFilters(this.filters);
        this._productService.setFilters(this.filters,"pagination");
    
        this.checkMove();
    
        await setTimeout(()=>{
          this.pageChange.emit(this.actualpage);
        }, 80) ;
        
      }
    } else if (this.page=="profile") {
        this.actualpage = pageNumber;
        this.checkMove();
        await setTimeout(()=>{
          this.pageChange.emit(this.actualpage);
        }, 80) ;
    }
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
