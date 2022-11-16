import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '../pagination/pagination.component';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { PaginationConfig, UserService } from 'src/app/core';

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
  listConfig!: PaginationConfig;
  minValue = 0;
  maxValue = 0;
  urlParams: any = [];

  constructor(
    private _productService: ProductService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private _userService: UserService,
  ) { }

  ngOnInit(): void {
    this.filters = this.defaultFilters;
    this.getUrl();
    setTimeout(()=>{
      this.getAllProducts();
    }, 50) ;
  }

  public getAllProducts(mode="filters"): void {
    this.products = this._productService.getProducts();
    if (this.products.numproducts == 0) {
      this.isProducts = false;
    } else {
      this.isProducts = true;
      this.listProducts = this.products.products;
      this.productCount = this.products.numproducts;
      this.maxValue = this.products.maxprice;
      this.minValue = this.products.minprice;
      if (mode=="filters") {
        this.listConfig= {
          numItems:this.productCount,
          limit:6,
          page:"shop"
        }
      }
    }
  }

  showDetails(value: string) {
    this.shDetails.emit(value);

    this.router.navigateByUrl('/shop/item/' + value);
  }

  loadPage(pageNumber:number) {
    setTimeout(()=>{
      this.getAllProducts("pagination");
    }, 80) ;
  }

  loadFilters() {
    setTimeout(()=>{
      this.getAllProducts();
    }, 80) ;
  }

  getUrl() {
    this.route.queryParams
      .subscribe(params => {
        this.urlParams = params;
      });
  }

  toggleFav(slug: string, operation: string, i: number) {
    this._userService.currentUser.subscribe(
      (loggedUser) => {
        if (loggedUser.username) {
          if (operation == "fav") {
            this.listProducts[i].favorited = true;
            this.listProducts[i].favoritesCount++;
            this._productService.favProduct(slug).subscribe();
          } else {
            this.listProducts[i].favorited = false;
            this.listProducts[i].favoritesCount--;
            this._productService.unfavProduct(slug).subscribe();
          }
        } else {
          this.router.navigate(['/login']);
        }
      }
    );
  }


}