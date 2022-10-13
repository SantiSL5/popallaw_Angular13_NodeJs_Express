import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})

export class ListProductsComponent implements OnInit {
  @ViewChild(PaginationComponent) 
  private pagComponent: PaginationComponent = new PaginationComponent;

  @Output() shDetails = new EventEmitter<string>();
  listProducts: Product[] = [];
  detailedProduct!: Product;
  productCount!: number;
  isProducts: Boolean = true;
  filters!: Filters;
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };

  constructor(
    private _productService: ProductService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.filters=this.defaultFilters;
    this.getAllProducts(this.filters, "start");
  }

  getAllProducts(newFilters: Filters, call: string): void {
    if (call=="filters") {
      this.filters.limit=this.defaultFilters.limit;
      this.filters.offset=this.defaultFilters.offset;
      this.filters.category=newFilters.category;
      this.filters.name=newFilters.name;
      this.filters.priceMax=newFilters.priceMax;
      this.filters.priceMin=newFilters.priceMin;
    }
    if (call=="pagination") {
      this.filters.limit=newFilters.limit;
      this.filters.offset=newFilters.offset;
    }
    this._productService.query(this.filters).subscribe(data => {
      if (data.numproducts == 0) {
        this.isProducts = false;
      } else {
        this.isProducts = true;
        this.listProducts = data.products;
        this.productCount = data.numproducts;
        this.pagComponent.setNumPages(this.productCount)
      }
    });
  }

  showDetails(value: string) {
    this.shDetails.emit(value);
  }

  loadPage(newFilters: Filters) {
    this.getAllProducts(newFilters, "pagination");
  }

  loadFilters(newFilters: Filters) {
    this.getAllProducts(newFilters, "filters");
  }

}
