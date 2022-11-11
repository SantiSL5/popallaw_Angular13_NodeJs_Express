import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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


  constructor(
    private _productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.checkView();
  }

  showDetails(slug: any) {
    this.slug = slug;
    this.view = "details";
  }

  showShop() {
    this.view = "list";
  }

  checkView() {
    if (this.route.snapshot.paramMap.get("slug")) {
      this.showDetails(this.route.snapshot.paramMap.get("slug"));
    } else {
      this.showShop();
    }
  }


}
