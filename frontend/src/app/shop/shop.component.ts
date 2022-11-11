import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Filters } from '../core/models/filters';
import { ProductService } from '../core/services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  view: String = "list";
  slug: string = "";
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };


  constructor(private _productService: ProductService) { }

  ngOnInit(): void {
  }

  showDetails(slug: string) {
    this.slug = slug;
    this.view = "details";
  }

  showShop() {
    this.view = "list";
  }

}
