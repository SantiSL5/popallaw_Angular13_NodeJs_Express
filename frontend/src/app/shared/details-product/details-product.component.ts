import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/core/models/product';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-details-product',
  templateUrl: './details-product.component.html',
  styleUrls: ['./details-product.component.css']
})
export class DetailsProductComponent implements OnInit {

  @Input() slug = '';
  @Output() shShop = new EventEmitter();
  product!: Product;

  constructor(
    private _productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.showDetails(this.slug);
  }

  showDetails(slug: string) {
    this._productService.get(slug).subscribe(data => {
      this.product = data;
    });
  }

  returnShop() {
    this.shShop.emit();
    this.router.navigateByUrl('/shop');
  }

  toggleFav(slug: string, operation: string) {
    if (operation == "fav") {
      this.product.favorited = true;
      this.product.favoritesCount++;
      this._productService.favProduct(slug).subscribe();
    } else {
      this.product.favorited = false;
      this.product.favoritesCount--;
      this._productService.unfavProduct(slug).subscribe();
    }
  }

}
