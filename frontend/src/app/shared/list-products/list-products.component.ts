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
    this.getAllProducts(this.filters);
  }

  getAllProducts(newFilters: Filters): void {
    if (newFilters.category) this.filters.category=newFilters.category ;
    if (newFilters.limit) this.filters.limit=newFilters.limit;
    if (newFilters.name) this.filters.name=newFilters.name;
    if (newFilters.offset) this.filters.offset=newFilters.offset;
    if (newFilters.priceMax) this.filters.priceMax=newFilters.priceMax;
    if (newFilters.priceMin) this.filters.priceMin=newFilters.priceMin;
    console.log(this.filters);
    this._productService.query(newFilters).subscribe(data => {
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
    this.getAllProducts(newFilters);
  }

  loadFilters(newFilters: Filters) {
    this.getAllProducts(newFilters);
  }

}
