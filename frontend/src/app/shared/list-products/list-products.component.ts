import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
// import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})

export class ListProductsComponent implements OnInit {
  @Output() shDetails = new EventEmitter<string>();
  products: any;
  listProducts: Product[] = [];
  detailedProduct!: Product;
  productCount!: number;
  isProducts: Boolean = true;
  filters!: Filters;
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };
  minValue = 0;
  maxValue = 0;
  urlParams: any = [];

  constructor(
    private _productService: ProductService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.filters = this.defaultFilters;
    this.getUrl();
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.products = this._productService.getProducts();
    if (this.products.numproducts == 0) {
      this.isProducts = false;
    } else {
      this.isProducts = true;
      this.listProducts = this.products.products;
      this.productCount = this.products.numproducts;
      this.maxValue = this.products.maxprice;
      this.minValue = this.products.minprice;
      // this.changePagination.next();
    }
  }

  showDetails(value: string) {
    this.shDetails.emit(value);

    this.router.navigateByUrl('/shop/item/' + value);
  }

  loadPage() {
    this.getAllProducts();
  }

  loadFilters() {
    this.getAllProducts();
  }

  getUrl() {
    this.route.queryParams
      .subscribe(params => {
        this.urlParams = params;
      });
  }

  toggleFav(slug: string, operation: string, i: number) {
    if (operation == "fav") {
      this.listProducts[i].favorited = true;
      this.listProducts[i].favoritesCount++;
      this._productService.favProduct(slug).subscribe();
    } else {
      this.listProducts[i].favorited = false;
      this.listProducts[i].favoritesCount--;
      this._productService.unfavProduct(slug).subscribe();
    }
  }

}
