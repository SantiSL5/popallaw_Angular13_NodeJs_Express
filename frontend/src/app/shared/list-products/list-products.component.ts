import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/core/models/product';
import { Filters } from 'src/app/core/models/filters';
import { ProductService } from 'src/app/core/services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})

export class ListProductsComponent implements OnInit {

  @Output() shDetails = new EventEmitter<string>();
  listProducts: Product[] = [];
  detailedProduct!: Product;
  isProducts: Boolean = true;
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };

  constructor(
    private _productService: ProductService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllProducts(this.defaultFilters);
  }

  getAllProducts(filters: Filters): void {
    this._productService.query(filters).subscribe(data => {
      if (data.numproducts == 0) {
        this.isProducts = false;
      } else {
        this.isProducts = true;
        this.listProducts = data.products;
      }
    });
  }

  showDetails(value: string) {
    this.shDetails.emit(value);
  }

  loadPage(filters: Filters) {
    this.getAllProducts(filters);
  }

}
