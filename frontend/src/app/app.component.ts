import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Filters } from './core/models/filters';
import { ProductService } from './core/services/product.service';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Popallaw';
  loaded: Promise<boolean>=Promise.resolve(false);
  defaultFilters: Filters = {
    limit: 6,
    offset: 0
  };

  constructor(
    private _userService: UserService,
    private _productService: ProductService
  ) {}

  ngOnInit() {
    this._userService.populate();
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
