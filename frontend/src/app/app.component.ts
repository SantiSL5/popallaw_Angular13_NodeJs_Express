import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Filters } from './core/models/filters';
import { ProductService } from './core/services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular 13 CRUD example';
  loaded: Promise<boolean>=Promise.resolve(false);
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };

  constructor(private _productService: ProductService) {}

  ngOnInit() {
    if (this._productService.getFilters().offset!=undefined) {
      this.defaultFilters=this._productService.getFilters();
    }
    this._productService.setFilters(this.defaultFilters);
    this._productService.query(this.defaultFilters).subscribe(data => {
      this._productService.setProducts(data);
      this.loaded=Promise.resolve(true);
    });
  }
}
